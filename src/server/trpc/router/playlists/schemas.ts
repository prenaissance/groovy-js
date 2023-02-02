import { z } from "zod";

export const PlaylistInputSchema = z
  .object({
    playlistId: z.string().cuid().optional(),
    playlistTitle: z.string().optional(),
  })
  .refine((data) => data.playlistId || data.playlistTitle, {
    message: "Either playlistId or playlistTitle must be provided",
    path: ["playlistId", "playlistTitle"],
  });

export const PlaylistSongInputSchema = z
  .object({
    playlistId: z.string().cuid().optional(),
    playlistTitle: z.string().optional(),
    songId: z.string().cuid(),
  })
  .refine((data) => data.playlistId || data.playlistTitle, {
    message: "Either playlistId or playlistTitle must be provided",
    path: ["playlistId", "playlistTitle"],
  });

export type PlaylistInput = z.infer<typeof PlaylistInputSchema>;
export type PlaylistSongInput = z.infer<typeof PlaylistSongInputSchema>;
