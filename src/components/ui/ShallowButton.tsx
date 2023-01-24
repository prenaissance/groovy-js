import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

function ShallowButton({ className, disabled, ...rest }: Props) {
  const props = {
    ...rest,
    disabled,
  };
  return (
    <button
      className={clsx(
        "rounded-sm border-0 bg-transparent outline-blue-500 transition-[filter] duration-75 ease-in focus:outline focus:outline-2 active:outline active:outline-2",
        {
          "text cursor-not-allowed text-gray-500": disabled,
          "text-primary-contrast hover:brightness-75 active:brightness-75":
            !disabled,
        },
        className,
      )}
      type="button"
      {...props}
    />
  );
}

export default ShallowButton;
