import { z } from "zod";

export const yearFromPastNumber = (message?: string) =>
  z.number().lte(new Date().getFullYear(), message);

export const yearFromPast = (message?: string) =>
  z.preprocess(
    (value) => parseInt(z.string().parse(value?.toString() ?? value), 10),
    yearFromPastNumber(message),
  );
