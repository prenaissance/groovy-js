import { Genre } from "@prisma/client";
import { uploadBase64File, uploadUrlFile } from "@server/services/blob-storage";
import { AddSongSchema } from "@shared/songs/schemas";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const songsRouter = router({
  addSong: protectedProcedure
    .input(AddSongSchema)
    .mutation(async ({ input, ctx }) => {
      const { title, artistId, albumId, songUrl, songFile, genre, year } =
        input;
      const { prisma, session } = ctx;

      const songExists = await prisma.song.findUnique({
        where: {
          artistId_title: {
            artistId,
            title,
          },
        },
      });

      if (songExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Song with the same name and artist already exists",
        });
      }

      if (albumId) {
        const albumExists = await prisma.album.findFirst({
          where: {
            id: albumId,
            artistId,
          },
        });

        if (!albumExists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Album not found ",
          });
        }
      }

      const url = songFile
        ? await uploadBase64File(songFile, "songs", title)
        : await uploadUrlFile(songUrl!, "songs", title);

      const song = await prisma.song.create({
        data: {
          title,
          genre,
          year,
          artistId,
          albumId,
          songUrl: url,
          uploadedById: session.user.id,
        },
      });

      return song;
    }),

  getSongs: publicProcedure
    .input(
      z.object({
        limit: z.number().int().positive().optional().default(10),
        cursor: z.string().cuid().nullish(),
        genre: z.nativeEnum(Genre).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor, genre } = input;
      const { prisma } = ctx;

      const songs = await prisma.song.findMany({
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        where: genre && {
          genre,
        },
        include: {
          artist: {
            select: {
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
      });

      const hasMore = songs.length === limit;
      const nextCursor = hasMore ? songs.at(-1)!.id : null;

      return {
        songs,
        nextCursor,
      };
    }),
  getFavoriteSongs: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().positive().optional().default(10),
        cursor: z.string().cuid().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor } = input;
      const { prisma, session } = ctx;

      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User data not present in authenticated request",
        });
      }

      const favoriteSongs = await prisma.favoriteSong.findMany({
        where: {
          user,
        },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          song: true,
        },
      });

      const songs = favoriteSongs.map((favoriteSong) => favoriteSong.song);
      const hasMore = songs.length === limit;
      const nextCursor = hasMore ? songs.at(-1)!.id : null;

      return {
        songs,
        nextCursor,
      };
    }),
});
