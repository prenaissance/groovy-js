import { useCallback, useState } from "react";
import type { ReactNode } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AudioControl from "./AudioControl";

type Props = {
  children: ReactNode;
};

function RootLayout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleExpand = useCallback(() => setIsSidebarOpen(true), []);
  const handleCollapse = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onExpand={handleExpand} />
      <Sidebar isOpen={isSidebarOpen} onCollapse={handleCollapse} />
      <main className="relative flex flex-1 flex-col">{children}</main>
      <AudioControl />
    </div>
  );
}

export default RootLayout;
