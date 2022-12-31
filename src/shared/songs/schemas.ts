import { z } from "zod";

export const AddSongSchema = z
  .object({
    title: z.string(),
    artist: z.string(),
    album: z.string().optional(),
    year: z.number(),
    songUrl: z.string().optional(),
    songFile: z.instanceof(Object).optional(),
  })
  .refine(
    (data) => {
      return data.songUrl || data.songFile;
    },
    {
      message: "Either songUrl or songFile must be provided",
      path: ["songUrl", "songFile"],
    }
  );
