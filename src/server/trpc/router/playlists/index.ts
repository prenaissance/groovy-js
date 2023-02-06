import type { SongDto } from "@shared/songs/types";
import { TRPCError } from "@trpc/server";
import type { Session } from "next-auth";
import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";
import type { PlaylistInput } from "./schemas";
import { PlaylistInputSchema, PlaylistSongInputSchema } from "./schemas";
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

  getPlayLists: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    const playlists = await prisma.playlist.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        playlistSongs: {
          select: {
            song: {
              select: {
                title: true,
                id: true,
              },
            },
          },
        },
      },
    });

    return playlists.map(({ id, title, playlistSongs }) => ({
      id,
      title,
      songs: playlistSongs.map(({ song }) => ({
        id: song.id,
        title: song.title,
      })),
    }));
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
                      id: true,
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

      const flattenedPlaylist: SongDto[] = playlist.playlistSongs.map(
        ({ song }) => ({
          ...song,
          imageUrl: song.album?.imageUrl || song.artist.imageUrl,
          artist: {
            id: song.artist.id,
            name: song.artist.name,
          },
          album: song.album
            ? {
                id: song.album.id,
                title: song.album.title,
              }
            : null,
        }),
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

  createIfNotExistsPlaylist: protectedProcedure
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

      await prisma.playlistSong.create({
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

      await prisma.playlistSong.delete({
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
