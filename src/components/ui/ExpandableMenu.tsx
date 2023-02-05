import clsx from "clsx";
import type { KeyboardEvent, MouseEvent, ReactElement, ReactNode } from "react";
import { useRef, useId, useCallback, useState } from "react";

import ShallowButton from "./ShallowButton";

export type Position =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

type Props = {
  position?: Position;
  buttonContent: ReactElement;
  children: ReactNode;
  className?: string;
};

function ExpandableMenu({
  position = "bottom",
  buttonContent,
  children,
  className,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const listId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutIdRef = useRef<number | null>(null);

  const left = position.includes("left");
  const right = position.includes("right");
  const top = position.includes("top");
  const bottom = position.includes("bottom");

  const handleToggleExpand = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    if (e.target !== buttonRef.current) return;
    if (timeoutIdRef.current) {
      window.clearTimeout(timeoutIdRef.current);
    }
    setIsExpanded((prev) => !prev);
  }, []);
  const handleExpand = useCallback(() => {
    if (timeoutIdRef.current) {
      window.clearTimeout(timeoutIdRef.current);
    }
    setIsExpanded(true);
  }, []);
  const handleEscape = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
        buttonRef.current?.focus();
      }
    },
    [],
  );
  const handleDelayedCollapse = useCallback(() => {
    if (timeoutIdRef.current) {
      window.clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = window.setTimeout(() => setIsExpanded(false), 300);
  }, []);

  return (
    <ShallowButton
      ref={buttonRef}
      aria-label="Open menu"
      aria-haspopup
      aria-controls={listId}
      aria-expanded={isExpanded}
      className="relative"
      onClick={handleToggleExpand}
      onPointerOver={handleExpand}
      onKeyDown={handleEscape}
      onPointerLeave={handleDelayedCollapse}
    >
      {buttonContent}
      <ul
        id={listId}
        role="menu"
        className={clsx(
          "absolute -top-1/2 -left-1/2 z-[10]",
          left && "left-0 -translate-x-1/2",
          right && "right-0 translate-x-1/2",
          top && "-translate-y-1/2",
          bottom && "translate-y-1/2",
          !isExpanded && "hidden",
          isExpanded && "block",
          className,
        )}
        onPointerOver={handleExpand}
      >
        {children}
      </ul>
    </ShallowButton>
  );
}

export default ExpandableMenu;
