// !React.memo crashed this component, not sure why
import { forwardRef } from "react";
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
  const innerComponent = (
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
        },
      )}
      {...props}
    />
  );

  return (
    <div className={className}>
      <div className="relative flex">
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
