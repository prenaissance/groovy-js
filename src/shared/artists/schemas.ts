import { imageFile } from "@shared/validators/files";
import { imageUrl } from "@shared/validators/urls";
import { z } from "zod";

export const AddArtistSchema = z
  .object({
    name: z.string().min(1),
    imageUrl: imageUrl.or(z.string().length(0)).optional(),
    imageFile: imageFile.optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either imageUrl or imageFile must be provided",
    path: ["imageUrl", "imageFile"],
  });
