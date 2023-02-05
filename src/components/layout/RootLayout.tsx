import { useCallback, useState } from "react";
import type { ReactNode } from "react";

import clsx from "clsx";
import { Inter, Roboto_Mono } from "@next/font/google";
import Navbar from "./Navbar";
import Sidebar from "./sidebar";
import AudioControl from "./audio-control";

const inter = Inter({
  subsets: ["latin"],
  fallback: ["sans-serif"],
  display: "optional",
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  fallback: ["monospace"],
  display: "optional",
  variable: "--font-roboto-mono",
});

type Props = {
  children: ReactNode;
};

function RootLayout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleExpand = useCallback(() => setIsSidebarOpen(true), []);
  const handleCollapse = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <div
      className={clsx(
        "flex min-h-screen flex-col",
        inter.variable,
        robotoMono.variable,
      )}
    >
      <Navbar onExpand={handleExpand} />
      <Sidebar isOpen={isSidebarOpen} onCollapse={handleCollapse} />
      <main className="relative flex flex-1 flex-col">{children}</main>
      <AudioControl />
    </div>
  );
}

export default RootLayout;
