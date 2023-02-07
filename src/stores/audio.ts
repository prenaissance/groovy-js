import { isClient } from "@shared/utilities/isomorphism";
import usePlayerStore from "./usePlayerStore";

const globalAudio = (isClient() ? new Audio() : null)!;

if (isClient()) {
  globalAudio.crossOrigin = "anonymous";
  globalAudio.volume = usePlayerStore.getState().volume;
  globalAudio.addEventListener("timeupdate", () => {
    usePlayerStore.setState({
      currentTime: Math.floor(globalAudio.currentTime),
    });
  });
  const song = usePlayerStore.getState().currentSong;
  if (song) {
    globalAudio.src = song.songUrl;
    globalAudio.load();
  }
}

usePlayerStore.subscribe(
  (state) => state.volume,
  (volume) => {
    globalAudio.volume = volume;
  },
);

usePlayerStore.subscribe(
  (state) => state.currentSong,
  (song) => {
    if (song) {
      globalAudio.src = song.songUrl;
      globalAudio.load();

      if (usePlayerStore.getState().isPlaying) {
        globalAudio.play();
      }
    }
  },
);

usePlayerStore.subscribe(
  (state) => state.isPlaying,
  (isPlaying) => {
    if (isPlaying) {
      globalAudio.play();
    } else {
      globalAudio.pause();
    }
  },
);

export { globalAudio };
