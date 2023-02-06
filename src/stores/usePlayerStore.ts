import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

import type { SongDto } from "@shared/songs/types";

interface PlayerState {
  isPlaying: boolean;
  playlist?: {
    id: string;
    index: number;
  } | void;
  currentSong?: SongDto | void;
  volume: number;
  currentTime: number;
}

type PlayerActions = {
  setPlaylist: (playlist: PlayerState["playlist"]) => void;
  setCurrentSong: (song: PlayerState["currentSong"]) => void;
  moveToNextSong: () => void;
  moveToPreviousSong: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
};

export type PlayerStore = PlayerState & PlayerActions;

const usePlayerStore = create<PlayerState & PlayerActions>()(
  persist(
    subscribeWithSelector((set) => ({
      isPlaying: false,
      volume: 0.5,
      currentTime: 0,
      setVolume: (volume) => set({ volume }),
      setPlaylist: (playlist) => set({ playlist }),
      setCurrentSong: (song) => set({ currentSong: song, currentTime: 0 }),
      moveToNextSong: () => {},
      moveToPreviousSong: () => {},
      setCurrentTime: (time) => set({ currentTime: time }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
    })),
    {
      name: "playlist",
    },
  ),
);

// on first page load
usePlayerStore.setState({
  isPlaying: false,
});

export default usePlayerStore;
