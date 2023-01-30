import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

function AudioControlContainer({ children }: Props) {
  return (
    <footer className="fixed bottom-0 grid h-20 w-full grid-cols-3 border-t border-accent-light bg-secondary-light px-2 py-2">
      {children}
    </footer>
  );
}

export default AudioControlContainer;
