import { z } from "zod";

export const AddSongSchema = z
  .object({
    title: z.string(),
    artist: z.string(),
    album: z.string().optional(),
    year: z.number(),
    songUrl: z.string().optional(),
    songFile: z
      .string()
      .regex(/^data:audio\/([A-Za-z0-9]+);base64,/)
      .optional(),
  })
  .refine((data) => data.songUrl || data.songFile, {
    message: "Either songUrl or songFile must be provided",
    path: ["songUrl", "songFile"],
  });
