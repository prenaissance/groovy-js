import type { Album, Artist, Song } from "@prisma/client";
import type { SongDto } from "@shared/songs/types";

export function mapSongsToSongDtos(
  songs: (Song & {
    artist: Pick<Artist, "id" | "name" | "imageUrl">;
    album: Pick<Album, "id" | "title" | "imageUrl"> | null;
  })[],
): SongDto[] {
  return songs.map((song) => ({
    ...song,
    artist: {
      id: song.artist.id,
      name: song.artist.name,
    },
    album: song.album
      ? {
          id: song.album.id,
          title: song.album.title,
        }
      : null,
    imageUrl: song.album?.imageUrl || song.artist.imageUrl,
  }));
}
