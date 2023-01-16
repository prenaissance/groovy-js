import type { HTMLAttributes, KeyboardEventHandler, ReactNode } from "react";
import { useEffect, useRef } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
  isOpen?: boolean;
} & HTMLAttributes<HTMLDivElement>;

function Dialog({
  children,
  dismissible = true,
  onClose = () => {},
  isOpen = false,
  className,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (isOpen && !ref.current?.open) {
      ref.current?.showModal();
    } else if (!isOpen && ref.current?.open) {
      const timeout = setTimeout(() => {
        ref.current?.close();
      }, 300); // animation duration

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleDismiss = () => {
    if (dismissible) {
      onClose();
    }
  };

  const handleEscDismiss: KeyboardEventHandler<HTMLDialogElement> = (e) => {
    if (e.key === "Escape") {
      handleDismiss();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog
      onKeyDown={handleEscDismiss}
      ref={ref}
      className="overflow-y-hidden border-0 backdrop:hidden "
    >
      <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-xs">
        <div
          className="absolute inset-0 z-[51] bg-black opacity-30 "
          onClick={handleDismiss}
        />
        <div
          className={clsx(
            className,
            "z-[52] rounded-md border border-accent-light bg-primary-light",
            {
              "animate-show-up": isOpen,
              "animate-hide-down": !isOpen,
            },
          )}
        >
          {children}
        </div>
      </div>
    </dialog>
  );
}

export default Dialog;
