import { z } from "zod";
import { protectedProcedure, router } from "../trpc";


export const songsRouter = router({
  addSong: protectedProcedure.input(
    z.object({
      title: z.string(),
      artist: z.string(),
      album: z.string().optional(),
      year: z.number(),
      songUrl: z.string().optional(),
      songFile: z.instanceof(File).optional(),
    }).refine((data) => {
      return data.songUrl || data.songFile;
    }, {
      message: "Either songUrl or songFile must be provided",
      path: ["songUrl", "songFile"],
    }))
    .mutation(async ({ input, ctx }) => {
      const { title, artist, album, year, songUrl, songFile } = input;

      const song = await ctx.prisma.song.create({
        data: {
          title,
          artist,
          album,
          year,
          songUrl,
          songFile,
        },
      });

      return song;
    }),
});