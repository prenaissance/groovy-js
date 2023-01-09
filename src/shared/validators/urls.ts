import { z } from "zod";

export const imageUrl = z
  .string()
  .url()
  .regex(
    /.+\.(png|jpe?g|jpe|webp)$/,
    "The url does not seem to link to an image!",
  );
