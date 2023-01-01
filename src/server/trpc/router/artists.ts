import { AddArtistSchema } from "@shared/artists/schemas";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const artistsRouter = router({
  addArtist: protectedProcedure
    .input(AddArtistSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, imageUrl, imageFile } = input;
      const { prisma, blobStorage } = ctx;

      let url = imageUrl;
      if (!imageUrl) {
        try {
          const blobName = `${name}-${Date.now()}`;
          const blockBlobClient = blobStorage
            .getContainerClient("artists")
            .getBlockBlobClient(blobName);
          // convert base64 to buffer
          const base64 = imageFile!.split(",")[1]!;
          const buffer = Buffer.from(base64, "base64");

          await blockBlobClient.upload(buffer, buffer.length);
          url = blockBlobClient.url;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to upload image! Is your file valid?",
          });
        }
      }

      const artist = await prisma.artist.create({
        data: {
          name,
          imageUrl: url!,
        },
      });

      return artist;
    }),

  getArtists: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const artists = await prisma.artist.findMany({
      orderBy: {
        name: "asc",
      },
      select: {},
    });
    return artists;
  }),
});
