import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { BiMenu } from "react-icons/bi";
import ShallowButton from "../ShallowButton";

type Props = { size?: string } & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
>;

function Hamburger({ className, size = "24px", ...props }: Props) {
  return (
    <ShallowButton
      type="button"
      className={clsx(
        "flex items-center gap-2 px-1 py-2 text-primary-contrast",
        className,
      )}
      {...props}
    >
      <BiMenu size={size} />
    </ShallowButton>
  );
}

export default Hamburger;
