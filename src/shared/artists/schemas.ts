import { z } from "zod";

export const AddArtistSchema = z
  .object({
    name: z.string(),
    imageUrl: z.string().url().optional(),
    imageFile: z
      .string()
      .regex(/^data:image\/([A-Za-z0-9]+);base64,/)
      .optional(),
  })
  .refine(
    (data) => {
      return data.imageUrl || data.imageFile;
    },
    {
      message: "Either imageUrl or imageFile must be provided",
      path: ["imageUrl", "imageFile"],
    }
  );
