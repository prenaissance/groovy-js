import { memo } from "react";
import AudioControlContainer from "./AudioControlContainer";

function AudioControlSkeleton() {
  return <AudioControlContainer />;
}

export default memo(AudioControlSkeleton);
