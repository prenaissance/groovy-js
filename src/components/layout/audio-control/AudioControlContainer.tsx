import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

function AudioControlContainer({ children }: Props) {
  return (
    <footer className="fixed bottom-0 flex w-full justify-between border-t border-accent-light bg-secondary-light px-2 py-2">
      {children}
    </footer>
  );
}

export default AudioControlContainer;
