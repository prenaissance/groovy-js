import { z } from "zod";

export const imageFile = z
  .string()
  .regex(/^data:image\/([A-Za-z0-9]+);base64,/);
