import { Genre } from "@prisma/client";
import { imageFile } from "@shared/validators/files";
import { imageUrl } from "@shared/validators/urls";
import { z } from "zod";

export const AddAlbumSchema = z
  .object({
    title: z.string(),
    artistId: z.string().cuid("You must select an artist"),
    year: z
      .number()
      .lte(new Date().getFullYear(), "The album cannot be from the future!"),
    imageUrl: imageUrl.or(z.string().length(0)).optional(),
    imageFile: imageFile.optional(),
    genres: z.array(z.nativeEnum(Genre)),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either imageUrl or imageFile must be provided",
    path: ["imageUrl", "imageFile"],
  });
