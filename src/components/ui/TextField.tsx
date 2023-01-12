// !React.memo crashed this component, not sure why
import { forwardRef, useMemo } from "react";
import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";

type Props = {
  color?: "primary" | "secondary" | "accent";
  icon?: ReactNode;
  helperText?: string;
  className?: string;
  errorMessage?: string;
  // eslint-disable-next-line no-undef
  container?: (props: { children: ReactNode }) => JSX.Element;
} & InputHTMLAttributes<HTMLInputElement>;

function TextField(
  {
    className,
    icon,
    color = "primary",
    helperText,
    errorMessage,
    container: Container,
    ...props
  }: Props,
  ref: Ref<HTMLInputElement>,
) {
  const innerComponent = useMemo(
    () => (
      <div className="relative min-w-[8rem] flex-1 after:absolute after:left-1/2 after:bottom-0 after:h-[1px] after:w-0 after:-translate-x-1/2 after:bg-blue-500 after:content-[''] focus-within:after:w-full after:motion-safe:transition-all">
        <input
          ref={ref}
          className="w-full bg-transparent focus:outline-none"
          {...props}
        />
      </div>
    ),
    [props, ref],
  );

  return (
    <div className={className}>
      <div
        className={clsx("relative flex w-full rounded-md border px-2 py-1", {
          "border-accent-light bg-primary-dark text-primary-contrast":
            color === "primary",
          "border-accent-light bg-secondary-dark text-secondary-contrast":
            color === "secondary",
          "border-primary-light bg-accent-dark text-accent-contrast":
            color === "accent",
          "pl-8": !!icon,
        })}
      >
        {icon && (
          <div className="pointer-events-none absolute flex h-full w-8 items-center justify-center text-primary-contrast">
            {icon}
          </div>
        )}
        {Container ? <Container>{innerComponent}</Container> : innerComponent}
      </div>
      {errorMessage ? (
        <div className="text-xs text-red-500">{errorMessage}</div>
      ) : (
        helperText && (
          <div
            className={clsx("text-xs", {
              "text-primary-contrast": color === "primary",
              "text-secondary-contrast": color === "secondary",
              "text-accent-contrast": color === "accent",
            })}
          >
            {helperText}
          </div>
        )
      )}
    </div>
  );
}

export default forwardRef(TextField);
