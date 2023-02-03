import { useCallback, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import Image from "next/image";
import {
  BsVolumeDown,
  BsVolumeUp,
  BsVolumeMute,
  BsSkipStartFill,
  BsPlayCircleFill,
  BsPauseFill,
  BsSkipEndFill,
} from "react-icons/bs";

import ShallowButton from "@components/ui/ShallowButton";
import SliderInput from "@components/ui/SliderInput";
import usePlayerStore from "@stores/usePlayerStore";
import { isClient } from "@shared/utilities/isomorphism";
import AudioControlContainer from "./AudioControlContainer";
import VolumeRocker from "./VolumeRocker";

const audio = (isClient() ? new Audio() : null)!;

function AudioControlClient() {
  const { song, volume, setCurrentTime } = usePlayerStore(
    (state) => ({
      song: state.currentSong,
      volume: state.volume,
      currentTime: state.currentTime,
      setCurrentTime: state.setCurrentTime,
      setVolume: state.setVolume,
    }),
    shallow,
  );
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (song) {
      audio.crossOrigin = "anonymous";
      audio.src = song.songUrl;
      audio.currentTime = usePlayerStore.getState().currentTime;
    }
  }, [song]);

  useEffect(() => {
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    let interval: number | null = null;

    if (isPlaying) {
      audio.play();
      interval = window.setInterval(() => {
        if (audio.currentTime < audio.duration) {
          setCurrentTime(Math.floor(audio.currentTime));
        }
      }, 1000);
    } else {
      audio.pause();
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isPlaying, setCurrentTime]);

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
      <div className="flex w-full gap-1 self-start justify-self-start text-primary-contrast">
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
      <div className="flex items-center gap-4 justify-self-center">
        <ShallowButton disabled>
          <BsSkipStartFill size="48px" />
        </ShallowButton>
        <PlayOrPauseButton />
        <ShallowButton disabled>
          <BsSkipEndFill size="48px" />
        </ShallowButton>
      </div>
      <VolumeRocker />
    </AudioControlContainer>
  );
}

export default AudioControlClient;
