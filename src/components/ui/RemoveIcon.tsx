import { memo } from "react";
import type { MouseEventHandler } from "react";
import clsx from "clsx";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  size?: string;
  variant?: "primary" | "secondary" | "accent";
  onRemove?: MouseEventHandler<SVGElement>;
  className?: string;
};

function RemoveIcon({
  className,
  size = "16px",
  variant = "primary",
  onRemove,
}: Props) {
  return (
    <button
      type="button"
      className={clsx(
        className,
        "rounded-lg p-[0.125rem] focus:outline focus:outline-2 focus:outline-blue-500",
      )}
    >
      <AiOutlineClose
        className={clsx(
          "rounded-full bg-transparent transition-colors ease-in-out hover:scale-125 hover:bg-white/10",
          {
            "text-primary-contrast": variant === "primary",
            "text-secondary-contrast": variant === "secondary",
            "text-accent-contrast": variant === "accent",
          },
        )}
        size={size}
        onClick={onRemove}
      />
    </button>
  );
}

export default memo(RemoveIcon);
