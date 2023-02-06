import { forwardRef, memo } from "react";
import type { ButtonHTMLAttributes, Ref } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { noDarken?: boolean };

function ShallowButton(
  { className, disabled, noDarken = false, ...rest }: Props,
  ref: Ref<HTMLButtonElement>,
) {
  const props = {
    ...rest,
    disabled,
  };
  return (
    <button
      ref={ref}
      className={clsx(
        "rounded-sm border-0 bg-transparent outline-blue-500 transition-[filter] duration-75 ease-in focus:outline focus:outline-2 active:outline active:outline-2",
        {
          "text cursor-not-allowed text-gray-500": disabled,
          "text-primary-contrast hover:brightness-75 active:brightness-75":
            !noDarken && !disabled,
        },
        className,
      )}
      type="button"
      {...props}
    />
  );
}

export default memo(forwardRef(ShallowButton));
