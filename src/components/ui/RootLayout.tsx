import type { ReactNode } from "react";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleExpand = () => setIsSidebarOpen(true);
  const handleCollapse = () => setIsSidebarOpen(false);
  return (
    <>
      <Navbar onExpand={handleExpand} />
      <Sidebar isOpen={isSidebarOpen} onCollapse={handleCollapse} />
      <main className="flex flex-1 flex-col">{children}</main>
    </>
  );
};

export default RootLayout;
