import { useCallback } from "react";
import { BsVolumeDown, BsVolumeMute, BsVolumeUp } from "react-icons/bs";

import SliderInput from "@components/ui/SliderInput";
import usePlayerStore from "@stores/usePlayerStore";
import FavoriteStar from "@components/songs/FavoriteStar";
import SongOptions from "@components/songs/song-item/SongOptions";

function VolumeRocker() {
  const song = usePlayerStore((state) => state.currentSong);
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
    <div className="volume mr-2 flex items-center gap-2 justify-self-end">
      {!!song && (
        <>
          <SongOptions size="32px" songId={song.id} position="top" />
          <FavoriteStar size="24px" songId={song.id} />
        </>
      )}
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
