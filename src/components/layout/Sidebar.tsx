import React, { memo } from "react";
import clsx from "clsx";
import { BsCollection } from "react-icons/bs";
import Hamburger from "@components/ui/icons/Hamburger";
import HoverLink from "@components/ui/HoverLink";
import { AiFillStar } from "react-icons/ai";

type Props = {
  isOpen: boolean;
  onCollapse: () => void;
};

function Sidebar({ isOpen, onCollapse }: Props) {
  return (
    <>
      <div
        role="toolbar"
        className={clsx(
          "fixed inset-y-0 left-0 z-[50] flex w-64 flex-col overflow-x-hidden border-r border-accent-light bg-secondary transition-transform duration-75 ease-out",
          {
            "translate-x-0": isOpen,
            "-translate-x-64": !isOpen,
          },
        )}
      >
        <div className="my-1 ml-2 flex flex-col justify-between gap-2 divide-x divide-primary-contrast bg-secondary text-primary-contrast">
          <div className="ml-[5px] flex items-center lg:mb-4">
            <Hamburger onClick={onCollapse} />
            <HoverLink onClick={onCollapse} href="/">
              Groovy
            </HoverLink>
          </div>
          <HoverLink onClick={onCollapse} href="/favorites">
            <div className="flex items-center gap-2">
              <AiFillStar size="24px" />
              Favorites
            </div>
          </HoverLink>
          <HoverLink onClick={onCollapse} href="/playlists">
            <div className="flex items-center gap-2">
              <BsCollection size="24px" />
              Playlists
            </div>
          </HoverLink>
        </div>
      </div>
      <div
        className={clsx(
          "fixed inset-0 z-[20] bg-black/50 transition-opacity duration-75 ease-out",
          {
            "visible opacity-100": isOpen,
            "pointer-events-none invisible opacity-0": !isOpen,
          },
        )}
        onClick={onCollapse}
      />
    </>
  );
}

export default memo(Sidebar);
