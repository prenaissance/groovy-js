import clsx from "clsx";
import { memo } from "react";

type Props = {
  variant: "success" | "error" | "warning" | "info";
  message?: string;
};

function NotificationBar({ variant, message }: Props) {
  return message ? (
    <div
      className={clsx(
        "roboto border py-1 px-1 text-center font-semibold text-white",
        {
          "border-green-800 bg-green-600": variant === "success",
          "border-red-800 bg-red-600": variant === "error",
          "border-yellow-800 bg-yellow-600": variant === "warning",
          "border-sky-800 bg-sky-600": variant === "info",
        }
      )}
    >
      {message}
    </div>
  ) : null;
}

export default memo(NotificationBar);
