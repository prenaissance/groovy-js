import { Song } from "@prisma/client";

export type SongDto = Song & {
  imageUrl: string;
  artist: {
    id: string;
    name: string;
  };
  album: {
    id: string;
    title: string;
  } | null;
};
