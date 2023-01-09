import React, { memo } from "react";
import clsx from "clsx";
import { BiMenu } from "react-icons/bi";

type Props = {
  isOpen: boolean;
  onCollapse: () => void;
};

function Sidebar({ isOpen, onCollapse }: Props) {
  return (
    <>
      <div
        className={clsx(
          " fixed inset-y-0 left-0 z-[50] flex w-64 flex-col overflow-x-hidden border-r border-accent-light bg-secondary transition-transform duration-75 ease-out",
          {
            "translate-x-0": isOpen,
            "-translate-x-64": !isOpen,
          },
        )}
      >
        <div className="flex flex-row justify-between gap-2 divide-x divide-accent bg-secondary">
          <div className="flex flex-row ">
            <button
              type="button"
              className="flex flex-row items-center gap-2 px-4 py-2 text-white hover:text-white/80"
              onClick={onCollapse}
            >
              <BiMenu size="1.5rem" />
            </button>
          </div>
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
