import { AddSongSchema } from "@shared/songs/schemas";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const songsRouter = router({
  addSong: protectedProcedure
    .input(AddSongSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        title, artist, album, year, songUrl, songFile,
      } = input;

      let url = songUrl;
      if (!songUrl) {
        const blobClient = ctx.blobStorage
          .getContainerClient("songs")
          .getBlockBlobClient(songFile.name);
        await blobClient.uploadData(songFile);
        url = blobClient.url;
      }
      const song = await ctx.prisma.song.create({
        data: {
          title,
          // artist,
          // album,
          year,
          songUrl: url,
          // songFile,
        },
      });

      return song;
    }),
});
