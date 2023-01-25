import ShallowButton from "@components/ui/ShallowButton";
import { BsVolumeDown, BsVolumeUp, BsVolumeMute } from "react-icons/bs";

type Props = {};

function AudioControl({}: Props) {
  // use context
  return (
    <footer className="fixed bottom-0 flex w-full justify-around bg-secondary-light">
      <div className="song & author" />
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
      </div>
    </footer>
  );
}

export default AudioControl;
