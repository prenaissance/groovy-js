import { Playlist } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Session } from "next-auth";

export function ensureOwnPlaylist<PlaylistT extends Playlist>(
  playlist: PlaylistT | null,
  session: Session,
): playlist is NonNullable<PlaylistT> {
  if (!playlist) {
    throw new TRPCError({
      message: "Playlist not found",
      code: "NOT_FOUND",
    });
  }

  if (playlist.userId !== session.user?.id) {
    throw new TRPCError({
      message: "You do not have access to this playlist",
      code: "FORBIDDEN",
    });
  }

  return true;
}
