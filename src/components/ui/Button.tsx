import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import { memo } from "react";

type Props = {
  variant?: "primary" | "secondary" | "accent";
  disabled?: boolean;
  outlined?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type SubButtonProps = Omit<Props, "outlined">;

function FilledButton({
  className,
  variant,
  disabled,
  ...props
}: SubButtonProps) {
  return (
    // eslint-disable-next-line react/button-has-type
    <button
      disabled={disabled}
      className={clsx(
        className,
        "rounded-md border px-4 py-2 text-sm font-semibold outline-2 transition-colors",
        {
          "border-gray-400 bg-gray-400 text-gray-500": disabled,
          "focus:outline focus:outline-blue-500 active:outline active:outline-blue-500":
            !disabled,
        },
        !disabled && {
          "border-accent-light bg-primary text-primary-contrast hover:bg-primary-dark":
            variant === "primary",
          "border-accent-light bg-secondary text-secondary-contrast hover:bg-secondary-dark":
            variant === "secondary",
          "border-primary-dark bg-accent text-accent-contrast hover:bg-accent-dark":
            variant === "accent",
        }
      )}
      {...props}
    />
  );
}

function OutlinedButton({
  className,
  disabled,
  variant,
  ...props
}: SubButtonProps) {
  return (
    // eslint-disable-next-line react/button-has-type
    <button
      disabled={disabled}
      className={clsx(
        className,
        "rounded-md border bg-white/[0.02] px-4 py-2 text-sm font-semibold outline-2 transition duration-150 focus:outline focus:outline-blue-500 active:outline active:outline-blue-500",
        {
          "border-gray-500 text-gray-500": disabled,
          "focus:outline focus:outline-blue-500 active:outline active:outline-blue-500":
            !disabled,
        },
        !disabled && {
          "border-primary-light text-primary-light hover:border-primary-dark hover:text-primary-dark focus:border-primary-dark  focus:text-primary-dark active:border-primary-dark active:text-primary-dark":
            variant === "primary",
          "border-secondary-light text-secondary-light hover:border-secondary-dark hover:text-secondary-dark focus:border-secondary-dark  focus:text-secondary-dark active:border-secondary-dark active:text-secondary-dark":
            variant === "secondary",
          "border-accent-light text-accent-light hover:border-accent-dark hover:text-accent-dark focus:border-accent-dark  focus:text-accent-dark active:border-accent-dark active:text-accent-dark":
            variant === "accent",
        }
      )}
      {...props}
    />
  );
}

function Button({
  variant = "primary",
  outlined = false,
  disabled = false,
  ...rest
}: Props) {
  const props = { ...rest, disabled, variant };
  return outlined ? <OutlinedButton {...props} /> : <FilledButton {...props} />;
}
// eslint-enable react/button-has-type
export default memo(Button);
