import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { BiMenu } from "react-icons/bi";

type Props = { size?: string } & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
>;

function Hamburger({ className, size = "24px", ...props }: Props) {
  return (
    <button
      type="button"
      className={clsx(
        "flex items-center gap-2 px-1 py-2 text-primary-contrast transition-[filter] duration-75 ease-out hover:brightness-75",
        className,
      )}
      {...props}
    >
      <BiMenu size={size} />
    </button>
  );
}

export default Hamburger;
