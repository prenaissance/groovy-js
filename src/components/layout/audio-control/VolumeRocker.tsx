import ShallowButton from "@components/ui/ShallowButton";
import SliderInput from "@components/ui/SliderInput";
import usePlayerStore from "@stores/usePlayerStore";
import { useCallback } from "react";
import { BsVolumeDown, BsVolumeMute, BsVolumeUp } from "react-icons/bs";

function VolumeRocker() {
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);

  const VolumeIndicator = useCallback(() => {
    if (volume === 0) {
      return <BsVolumeMute size="32px" />;
    }
    if (volume < 0.5) {
      return <BsVolumeDown size="32px" />;
    }
    return <BsVolumeUp size="32px" />;
  }, [volume]);

  const handleChangeVolume = useCallback(
    (value: number) => {
      const roundedValue = Number(value.toFixed(3));
      setVolume(roundedValue);
    },
    [setVolume],
  );

  return (
    <div className="volume mr-2 flex items-center justify-self-end">
      <VolumeIndicator />
      <SliderInput
        className="w-32"
        min={0}
        max={1}
        defaultValue={volume}
        onChange={handleChangeVolume}
      />
    </div>
  );
}

export default VolumeRocker;
