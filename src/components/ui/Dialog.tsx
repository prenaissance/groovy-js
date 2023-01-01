import clsx from "clsx";
import type { HTMLAttributes, KeyboardEventHandler, ReactNode } from "react";
import { useEffect } from "react";
import React from "react";

type Props = {
  children: ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
  open?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const Dialog = ({
  children,
  dismissible = true,
  onClose = () => {},
  open = false,
  className,
}: Props) => {
  const ref = React.useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) {
      !ref.current?.open && ref.current?.showModal();
    } else {
      ref.current?.open && ref.current?.close();
    }
  }, [open]);

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
    <dialog
      ref={ref}
      className="border-0 backdrop:hidden"
      onKeyDown={handleEscDismiss}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black opacity-50"
          onClick={handleDismiss}
        />
        <div
          className={clsx(
            "rounded-md border border-accent-light bg-primary-light",
            className
          )}
        >
          {children}
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;
