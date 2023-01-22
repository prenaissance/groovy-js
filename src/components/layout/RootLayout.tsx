import { useCallback, useState } from "react";
import type { ReactNode } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

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
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

export default RootLayout;
