import type { PlayerStore } from "@stores/usePlayerStore";
import { useEffect, useState } from "react";
import { globalAudio as audio } from "@stores/audio";
import usePlayerStore from "@stores/usePlayerStore";
import SliderInput from "@components/ui/SliderInput";

type Props = {};

const handleChangeTime = (value: number) => {
  audio.currentTime = value;
};
const currentTimeSelector = (state: PlayerStore) => state.currentTime;
const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  const secondsString = seconds.toString().padStart(2, "0");
  return `${minutes}:${secondsString}`;
};

function PlaytimeSlider({}: Props) {
  const currentTime = usePlayerStore(currentTimeSelector);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const handlerDurationChange = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("durationchange", handlerDurationChange);

    return () => {
      audio.removeEventListener("durationchange", handlerDurationChange);
    };
  }, []);

  return (
    <div className="flex items-center gap-1 font-sans text-xs">
      <span>
        {formatDuration(currentTime)} / {formatDuration(duration)}
      </span>
      <SliderInput
        className="h-[6px] w-40 border border-accent-light"
        value={currentTime}
        min={0}
        max={duration}
        onChange={handleChangeTime}
        noThumb
        aria-label="Playtime slider"
      />
      <span className="invisible">
        {formatDuration(currentTime)} / {formatDuration(duration)}
      </span>
    </div>
  );
}

export default PlaytimeSlider;
