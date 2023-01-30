import clsx from "clsx";
import type { ReactNode } from "react";
import { memo } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
};

function Skeleton({ className, children }: Props) {
  return (
    <div className={clsx(className, "animate-pulse rounded-md bg-gray-500")}>
      {children}
    </div>
  );
}

export default memo(Skeleton);
