import { memo } from "react";
import type { HTMLAttributes } from "react";
import clsx from "clsx";

import RemoveIcon from "./RemoveIcon";

type Props = {
  noGutters?: boolean;
  variant?: "primary" | "secondary" | "accent";
  outlined?: boolean;
  removable?: boolean;
  onRemove?: () => void;
} & HTMLAttributes<HTMLDivElement>;

function Chip({
  noGutters = false,
  variant = "primary",
  outlined = false,
  removable = false,
  onRemove,
  className,
  children,
  ...props
}: Props) {
  return (
    <div
      className={clsx(
        className,
        "flex w-fit items-center gap-2 rounded-full text-sm font-semibold",
        {
          "bg-primary text-primary-contrast":
            !outlined && variant === "primary",
          "bg-secondary text-secondary-contrast":
            !outlined && variant === "secondary",
          "bg-accent text-accent-contrast": !outlined && variant === "accent",
          "border-2 bg-white/[0.02]": outlined,
          "border-primary text-primary": outlined && variant === "primary",
          "border-secondary text-secondary":
            outlined && variant === "secondary",
          "border-accent-light text-accent-light":
            outlined && variant === "accent",
        },
        {
          "px-2 py-1": !noGutters,
        },
      )}
      {...props}
    >
      {children}
      {removable && (
        <RemoveIcon onRemove={onRemove} size="1rem" variant={variant} />
      )}
    </div>
  );
}

export default memo(Chip);
