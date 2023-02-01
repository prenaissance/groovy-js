import type { RouterOutputs } from "../../utils/trpc";

export type SongDto = RouterOutputs["songs"]["getSongs"]["songs"][number];
