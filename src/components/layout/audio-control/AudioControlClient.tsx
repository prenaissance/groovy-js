import { useCallback } from "react";
import Image from "next/image";
import {
  BsSkipStartFill,
  BsPlayCircleFill,
  BsPauseFill,
  BsSkipEndFill,
} from "react-icons/bs";

import "@stores/audio";
import ShallowButton from "@components/ui/ShallowButton";
import SliderInput from "@components/ui/SliderInput";
import type { PlayerStore } from "@stores/usePlayerStore";
import usePlayerStore from "@stores/usePlayerStore";
import AudioControlContainer from "./AudioControlContainer";
import VolumeRocker from "./VolumeRocker";
import PlaytimeSlider from "./PlaytimeSlider";

const { setIsPlaying } = usePlayerStore.getState();
const currentSongSelector = (state: PlayerStore) => state.currentSong;
const isPlayingSelector = (state: PlayerStore) => state.isPlaying;

function AudioControlClient() {
  const song = usePlayerStore(currentSongSelector);
  const isPlaying = usePlayerStore(isPlayingSelector);

  const PlayOrPauseButton = useCallback(
    () => (
      <ShallowButton
        disabled={!song}
        onClick={() => {
          if (isPlaying) {
            setIsPlaying(false);
          } else {
            setIsPlaying(true);
          }
        }}
      >
        {isPlaying ? (
          <BsPauseFill size="36px" />
        ) : (
          <BsPlayCircleFill size="36px" />
        )}
      </ShallowButton>
    ),
    [isPlaying, song],
  );

  return (
    <AudioControlContainer>
      <div className="hidden w-full gap-1 self-start justify-self-start text-primary-contrast md:flex">
        {song ? (
          <>
            <Image
              height={64}
              width={64}
              src={song.imageUrl}
              alt={song.title}
              crossOrigin="anonymous"
            />
            <div className="w-32 space-y-2 truncate p-1">
              <p className="font-mono text-lg">{song.title}</p>
              <p className="font-sans text-sm">{song.artist.name}</p>
            </div>
          </>
        ) : (
          <div className="h-16 w-16 rounded-sm border border-accent-light" />
        )}
      </div>
      <div className="items-center justify-self-center">
        <div className="flex items-center justify-center gap-4">
          <ShallowButton disabled>
            <BsSkipStartFill size="48px" />
          </ShallowButton>
          <PlayOrPauseButton />
          <ShallowButton disabled>
            <BsSkipEndFill size="48px" />
          </ShallowButton>
        </div>
        <PlaytimeSlider />
      </div>
      <VolumeRocker />
    </AudioControlContainer>
  );
}

export default AudioControlClient;
