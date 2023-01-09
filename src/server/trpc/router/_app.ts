import { router } from "../trpc";
import { artistsRouter } from "./artists";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { songsRouter } from "./songs";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  songs: songsRouter,
  artists: artistsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
