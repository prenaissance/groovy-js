import { uploadBase64File, uploadUrlFile } from "@server/services/blob-storage";
import { AddAlbumSchema } from "@shared/albums/schemas";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";

export const albumsRouter = router({
  addAlbum: protectedProcedure
    .input(AddAlbumSchema)
    .mutation(async ({ input, ctx }) => {
      const { title, artistId, year, imageUrl, imageFile, genres } = input;
      const { prisma } = ctx;

      const artistExists = await prisma.artist.findUnique({
        where: {
          id: artistId,
        },
      });

      if (!artistExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Artist not found, something bad happened",
        });
      }

      const url = imageFile
        ? await uploadBase64File(imageFile, "albums", title)
        : await uploadUrlFile(imageUrl!, "albums", title);

      const album = await prisma.album.create({
        data: {
          title,
          artistId,
          year,
          imageUrl: url,
          genres,
        },
      });

      return album;
    }),
  getAllTitles: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const albums = await prisma.album.findMany({
      orderBy: {
        title: "asc",
      },
      select: {
        id: true,
        title: true,
      },
    });
    return albums.map((album) => album.title);
  }),
});
