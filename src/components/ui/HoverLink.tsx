import Link from "next/link";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "className">;

function HoverLink(props: Props) {
  return (
    <Link
      {...props}
      className="px-2 font-semibold text-primary-contrast transition-[filter] duration-75 ease-out hover:brightness-75"
    />
  );
}

export default HoverLink;
