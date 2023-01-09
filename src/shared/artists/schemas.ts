import { z } from "zod";

export const AddArtistSchema = z
  .object({
    name: z.string().min(1),
    imageUrl: z
      .string()
      .url()
      .regex(
        /.+\.(png|jpe?g|jpe|webp)$/,
        "The url does not seem to link to an image!",
      )
      .or(z.string().length(0))
      .optional(),
    imageFile: z
      .string()
      .regex(/^data:image\/([A-Za-z0-9]+);base64,/)
      .optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either imageUrl or imageFile must be provided",
    path: ["imageUrl", "imageFile"],
  });
