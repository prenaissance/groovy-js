import type { SongDto } from "@shared/songs/types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

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
    .input(
      z
        .object({
          id: z.string().cuid().optional(),
          title: z.string().optional(),
        })
        .refine((data) => data.id || data.title, {
          message: "Either id or title must be provided",
          path: ["id", "title"],
        }),
    )
    .query(async ({ input, ctx }) => {
      const { id, title } = input;
      const { prisma, session } = ctx;

      const whereQuery = id
        ? { id }
        : { userId_title: { userId: session.user.id, title: title! } };

      const playlist = await prisma.playlist.findUnique({
        where: whereQuery,
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

      if (!playlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });
      }

      if (playlist.userId !== session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this playlist",
        });
      }

      const flattenedPlaylist = playlist.playlistSongs.map(
        (playlistSong) => playlistSong.song,
      );

      return flattenedPlaylist;
    }),
});
