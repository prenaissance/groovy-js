import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { mapSongsToSongDtos } from "./common/mappings";

export const historyRouter = router({
  addPlayedSong: protectedProcedure
    .input(
      z.object({
        songId: z.string().cuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { songId } = input;
      const { prisma, session } = ctx;

      const song = await prisma.song.findUnique({
        where: {
          id: songId,
        },
      });

      if (!song) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Song not found",
        });
      }

      await prisma.historySong.create({
        data: {
          userId: session.user.id,
          songId,
        },
      });
    }),

  getPlayedSongs: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(10),
        cursor: z.string().cuid().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor } = input;
      const { prisma, session } = ctx;

      const historySongs = await prisma.historySong.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
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
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
      });

      const songs = historySongs.map((historySong) => historySong.song);
      const hasMore = historySongs.length === limit;
      const nextCursor = hasMore ? historySongs.at(-1)!.id : null;

      const mappedSongs = mapSongsToSongDtos(songs);

      return {
        songs: mappedSongs,
        hasMore,
        nextCursor,
      };
    }),
});
