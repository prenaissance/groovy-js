import { uploadBase64File, uploadUrlFile } from "@server/services/blob-storage";
import { AddSongSchema } from "@shared/songs/schemas";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";

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
});
