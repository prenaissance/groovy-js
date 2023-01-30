import type { Song } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlaylistState {
  playlist?: {
    id: string;
    index: number;
  } | void;
  currentSong?:
    | (Song & {
        artist: {
          id: string;
          name: string;
        };
        imageUrl: string;
      })
    | void;
  volume: number;
}

type PlaylistActions = {
  setPlaylist: (playlist: PlaylistState["playlist"]) => void;
  setCurrentSong: (song: PlaylistState["currentSong"]) => void;
  moveToNextSong: () => void;
  moveToPreviousSong: () => void;
  setVolume: (volume: number) => void;
};

const usePlayerStore = create<PlaylistState & PlaylistActions>()(
  persist(
    (set) => ({
      volume: 50,
      setVolume: (volume) => set({ volume }),
      setPlaylist: (playlist) => set({ playlist }),
      setCurrentSong: (song) => set({ currentSong: song }),
      moveToNextSong: () => {},
      moveToPreviousSong: () => {},
    }),
    {
      name: "playlist",
    },
  ),
);

export default usePlayerStore;
