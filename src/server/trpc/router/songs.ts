import { uploadBase64File, uploadUrlFile } from "@server/services/blob-storage";
import { AddSongSchema } from "@shared/songs/schemas";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const songsRouter = router({
  addSong: protectedProcedure
    .input(AddSongSchema)
    .mutation(async ({ input, ctx }) => {
      const { title, artistId, albumId, year, songUrl, songFile, genre } =
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
          message: "Song already exists",
        });
      }

      const album = await prisma.album.findUnique({
        where: {
          id: albumId,
        },
        include: {
          artist: true,
        },
      });

      if (!album || album.artistId !== artistId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Album does not match artist",
        });
      }

      const url = songFile
        ? await uploadBase64File(songFile, "songs", title)
        : await uploadUrlFile(songUrl!, "songs", title);

      const song = await prisma.song.create({
        data: {
          title,
          artistId,
          albumId,
          year,
          genre,
          songUrl: url,
          uploadedById: session.user.id,
        },
      });

      return song;
    }),
});
