import ShallowButton from "@components/ui/ShallowButton";
import Skeleton from "@components/ui/Skeleton";

import { memo } from "react";
import {
  BsVolumeDown,
  BsPlayCircleFill,
  BsSkipStartFill,
  BsSkipEndFill,
} from "react-icons/bs";
import AudioControlContainer from "./AudioControlContainer";

function AudioControlSkeleton() {
  return (
    <AudioControlContainer>
      <div className="flex gap-1 self-start justify-self-start text-primary-contrast">
        <Skeleton className="h-16 w-16 rounded-sm" />
        <div className="w-20 space-y-2 truncate p-1">
          <Skeleton>
            <p className="invisible font-mono text-lg">Title Placeholder</p>
          </Skeleton>
          <Skeleton>
            <p className="invisible font-sans text-sm">Artist PLaceholder</p>
          </Skeleton>
        </div>
      </div>
      <div className="flex items-center gap-4 justify-self-center">
        <ShallowButton disabled>
          <BsSkipStartFill size="48px" />
        </ShallowButton>
        <ShallowButton disabled>
          <BsPlayCircleFill size="36px" />
        </ShallowButton>
        <ShallowButton disabled>
          <BsSkipEndFill size="48px" />
        </ShallowButton>
      </div>
      <div className="mr-2 flex items-center justify-self-end">
        <ShallowButton disabled>
          <BsVolumeDown size="32px" />
        </ShallowButton>
        <Skeleton className="h-3 w-32" />
      </div>
    </AudioControlContainer>
  );
}

export default memo(AudioControlSkeleton);
