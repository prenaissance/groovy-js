import { memo } from "react";
import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type Props = {
  variant?: "primary" | "secondary" | "accent" | "positive";
  disabled?: boolean;
  outlined?: boolean;
  loading?: boolean;
  noGutters?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type SubButtonProps = Omit<Props, "outlined">;

const spinner = (
  <AiOutlineLoading3Quarters
    className="mx-auto h-full animate-spin text-gray-500"
    size="16px"
  />
);

function FilledButton({
  className,
  variant,
  disabled,
  noGutters,
  ...props
}: SubButtonProps) {
  return (
    // eslint-disable-next-line react/button-has-type
    <button
      disabled={disabled}
      className={clsx(
        className,
        "min-h-[1rem] rounded-md border text-sm font-semibold outline-2 transition-colors",
        !noGutters && "px-4 py-2",
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
          "border-emerald-900 bg-emerald-600 text-emerald-100 hover:bg-emerald-700":
            variant === "positive",
        },
      )}
      {...props}
    />
  );
}

function OutlinedButton({
  className,
  disabled,
  variant,
  noGutters,
  ...props
}: SubButtonProps) {
  return (
    // eslint-disable-next-line react/button-has-type
    <button
      disabled={disabled}
      className={clsx(
        className,
        "min-h-[1rem] rounded-md border bg-white/[0.02] text-sm font-semibold outline-2 transition duration-150 focus:outline focus:outline-blue-500 active:outline active:outline-blue-500",
        !noGutters && "px-4 py-2",
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
        },
      )}
      {...props}
    />
  );
}

function Button({
  variant = "primary",
  outlined = false,
  disabled = false,
  noGutters = false,
  loading,
  children,
  ...rest
}: Props) {
  const props = {
    ...rest,
    disabled,
    variant,
    loading,
    children: loading ? spinner : children,
    noGutters,
  };
  return outlined ? <OutlinedButton {...props} /> : <FilledButton {...props} />;
}
// eslint-enable react/button-has-type
export default memo(Button);
