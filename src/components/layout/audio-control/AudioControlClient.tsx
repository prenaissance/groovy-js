import { useCallback, useEffect, useRef, useState } from "react";
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

const audio = (isClient() ? new Audio() : null)!;

function AudioControlClient() {
  const { song, volume, setCurrentTime } = usePlayerStore(
    (state) => ({
      song: state.currentSong,
      volume: state.volume,
      currentTime: state.currentTime,
      setCurrentTime: state.setCurrentTime,
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

  const VolumeIndicator = useCallback(() => {
    if (volume === 0) {
      return <BsVolumeMute size="32px" />;
    }
    if (volume < 0.5) {
      return <BsVolumeDown size="32px" />;
    }
    return <BsVolumeUp size="32px" />;
  }, [volume]);

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
      <div className="volume mr-2 flex items-center justify-self-end">
        <ShallowButton>
          <VolumeIndicator />
        </ShallowButton>
        <SliderInput className="w-32" />
      </div>
    </AudioControlContainer>
  );
}

export default AudioControlClient;
