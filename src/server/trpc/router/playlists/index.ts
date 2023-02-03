import { TRPCError } from "@trpc/server";
import { Session } from "next-auth";
import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";
import {
  PlaylistInput,
  PlaylistInputSchema,
  PlaylistSongInputSchema,
} from "./schemas";
import { ensureOwnPlaylist } from "./validators";

const getPlaylistWhereQuery = (input: PlaylistInput & { session: Session }) => {
  const { playlistId: id, playlistTitle: title, session } = input;
  const whereQuery = id
    ? { id }
    : { userId_title: { userId: session.user!.id, title: title! } };
  return whereQuery;
};

export const playlistsRouter = router({
  getPlaylistTitles: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    const playlists = await prisma.playlist.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return playlists;
  }),

  getPlaylist: protectedProcedure
    .input(PlaylistInputSchema)
    .query(async ({ input, ctx }) => {
      const { prisma, session } = ctx;

      const playlist = await prisma.playlist.findUnique({
        where: getPlaylistWhereQuery({ ...input, session }),
        include: {
          playlistSongs: {
            include: {
              song: {
                include: {
                  artist: {
                    select: {
                      id: true,
                      name: true,
                      imageUrl: true,
                    },
                  },
                  album: {
                    select: {
                      title: true,
                      imageUrl: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      if (!ensureOwnPlaylist(playlist, session)) {
        throw 0;
      }

      const flattenedPlaylist = playlist.playlistSongs.map(
        (playlistSong) => playlistSong.song,
      );

      return {
        id: playlist.id,
        title: playlist.title,
        songs: flattenedPlaylist,
      };
    }),

  createPlaylist: protectedProcedure
    .input(z.string().min(1).max(50))
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;

      const playlistExists = await prisma.playlist.findUnique({
        where: {
          userId_title: {
            userId: session.user.id,
            title: input,
          },
        },
      });

      if (playlistExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Playlist already exists",
        });
      }

      const playlist = await prisma.playlist.create({
        data: {
          title: input,
          userId: session.user.id,
        },
      });

      return playlist;
    }),

  createIfExistsPlaylist: protectedProcedure
    .input(z.string().min(1).max(50))
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;

      const playlist = await prisma.playlist.upsert({
        where: {
          userId_title: {
            userId: session.user.id,
            title: input,
          },
        },
        create: {
          title: input,
          userId: session.user.id,
        },
        update: {},
      });

      return playlist;
    }),

  addSongToPlaylist: protectedProcedure
    .input(PlaylistSongInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { songId } = input;
      const { prisma, session } = ctx;

      const songExists = await prisma.song.findUnique({
        where: {
          id: songId,
        },
      });

      if (!songExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Song not found",
        });
      }

      const playlist = await prisma.playlist.findUnique({
        where: getPlaylistWhereQuery({ ...input, session }),
      });

      if (!ensureOwnPlaylist(playlist, session)) {
        throw 0;
      }

      prisma.playlistSong.create({
        data: {
          playlistId: playlist.id,
          songId,
        },
      });

      return playlist;
    }),

  removeSongFromPlaylist: protectedProcedure
    .input(PlaylistSongInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { songId } = input;
      const { prisma, session } = ctx;

      const playlist = await prisma.playlist.findUnique({
        where: getPlaylistWhereQuery({ ...input, session }),
      });

      if (!ensureOwnPlaylist(playlist, session)) {
        throw 0;
      }

      prisma.playlistSong.delete({
        where: {
          playlistId_songId: {
            playlistId: playlist.id,
            songId,
          },
        },
      });

      return playlist;
    }),
});
