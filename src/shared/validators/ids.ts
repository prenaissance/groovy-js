import { z } from "zod";

export const trimCuid = (message?: string) =>
  z.preprocess(
    (value) => z.string().parse(value).trim(),
    z.string().cuid(message),
  );
