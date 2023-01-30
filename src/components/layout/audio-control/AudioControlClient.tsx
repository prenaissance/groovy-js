import ShallowButton from "@components/ui/ShallowButton";
import SliderInput from "@components/ui/SliderInput";
import usePlayerStore from "@stores/usePlayerStore";
import Image from "next/image";
import { BsVolumeDown, BsVolumeUp, BsVolumeMute } from "react-icons/bs";
import AudioControlContainer from "./AudioControlContainer";

type Props = {};

function AudioControlClient({}: Props) {
  const song = usePlayerStore((state) => state.currentSong);
  return (
    <AudioControlContainer>
      <div className="flex gap-1 self-start justify-self-start text-primary-contrast">
        {!!song && (
          <>
            <Image
              height={64}
              width={64}
              src={song.imageUrl}
              alt={song.title}
              crossOrigin="anonymous"
            />
            <div className="p-2">
              <p className="font-mono text-lg">{song.title}</p>
              <p className="font-sans text-sm">{song.artist.name}</p>
            </div>
          </>
        )}
      </div>
      <div className="play & pause" />
      <div className="volume my-2 flex items-center">
        <ShallowButton>
          <BsVolumeDown size="24px" />
        </ShallowButton>
        <input
          defaultValue={100}
          min={0}
          max={100}
          step={5}
          type="range"
          className="h-1 cursor-pointer appearance-none rounded-full bg-primary-dark text-primary"
        />
        <SliderInput />
      </div>
    </AudioControlContainer>
  );
}

export default AudioControlClient;
