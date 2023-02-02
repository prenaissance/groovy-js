import { router } from "../trpc";
import { albumsRouter } from "./albums";
import { artistsRouter } from "./artists";
import { authRouter } from "./auth";
import { playlistsRouter } from "./playlists/playlists";
import { songsRouter } from "./songs";

export const appRouter = router({
  auth: authRouter,
  songs: songsRouter,
  artists: artistsRouter,
  albums: albumsRouter,
  playlists: playlistsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
