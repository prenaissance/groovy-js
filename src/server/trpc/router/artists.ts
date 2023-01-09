import { uploadBase64File, uploadUrlFile } from "@server/services/blob-storage";
import { AddArtistSchema } from "@shared/artists/schemas";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const artistsRouter = router({
  addArtist: protectedProcedure
    .input(AddArtistSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, imageUrl, imageFile } = input;
      const { prisma } = ctx;
      let url: string;

      const artistExists = await prisma.artist.findUnique({
        where: {
          name,
        },
      });

      if (artistExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Artist with the same name already exists",
        });
      }

      try {
        url = imageFile
          ? await uploadBase64File(imageFile, "artists", name)
          : await uploadUrlFile(imageUrl!, "artists", name);
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not upload your file! Please try again",
        });
      }

      const artist = await prisma.artist.create({
        data: {
          name,
          imageUrl: url,
        },
      });

      return artist;
    }),

  getArtistNames: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const artists = await prisma.artist.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        name: true,
      },
    });
    return artists.map((artist) => artist.name);
  }),
});
