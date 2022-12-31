import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";

type Props = {
  color?: "primary" | "secondary" | "accent";
  icon?: ReactNode;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const TextField = (
  { className, icon, color = "primary", ...props }: Props,
  ref: Ref<HTMLInputElement>
) => {
  return (
    <div className={clsx("relative flex w-fit", className)}>
      {icon && (
        <div className="pointer-events-none absolute flex h-full w-8 items-center justify-center text-primary-contrast">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        className={clsx(
          "w-full rounded-md px-2 py-1 outline outline-1 focus:outline-none focus:ring-2 focus:ring-blue-500",
          {
            "bg-primary-dark text-primary-contrast outline-accent-light":
              color === "primary",
            "bg-secondary-dark text-secondary-contrast outline-accent-light":
              color === "secondary",
            "bg-accent-dark text-accent-contrast outline-primary-light":
              color === "accent",
            "pl-8": !!icon,
          }
        )}
        {...props}
      />
    </div>
  );
};

export default forwardRef(TextField);
