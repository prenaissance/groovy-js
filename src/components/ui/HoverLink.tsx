import Link from "next/link";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "className">;

function HoverLink(props: Props) {
  return (
    <Link
      {...props}
      className="rounded-sm px-2 font-semibold text-primary-contrast outline-2 outline-blue-500 transition-[filter] duration-75 ease-out hover:brightness-75 focus:outline focus:brightness-75 focus:transition-none"
    />
  );
}

export default HoverLink;
