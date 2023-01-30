import useHydrated from "@hooks/useHydrated";
import AudioControlSkeleton from "./AudioControlSkeleton";
import AudioControlClient from "./AudioControlClient";

// ! Suspense with TRPC SSR crashes dynamic imports. This is a workaround.
function AudioControl() {
  const isHydrated = useHydrated();

  return isHydrated ? <AudioControlClient /> : <AudioControlSkeleton />;
}

export default AudioControl;
