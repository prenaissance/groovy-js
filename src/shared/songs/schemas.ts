import { Genre } from "@prisma/client";
import { z } from "zod";

export const AddSongSchema = z
  .object({
    title: z.string(),
    artistId: z.string(),
    albumId: z.string().optional(),
    year: z.preprocess(
      (value) => parseInt(z.string().parse(value), 10),
      z
        .number()
        .lte(new Date().getFullYear(), "The album cannot be from the future!"),
    ),
    genre: z.nativeEnum(Genre),
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
