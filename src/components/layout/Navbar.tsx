import HoverLink from "@components/ui/HoverLink";
import Hamburger from "@components/ui/icons/Hamburger";

type Props = {
  onExpand: () => void;
};

function Navbar({ onExpand }: Props) {
  return (
    <nav className="sticky top-0 z-[10] flex flex-row items-center justify-start border-b border-accent-light bg-secondary p-1">
      <Hamburger onClick={onExpand} />
      <div className="my-1 flex h-fit flex-row divide-x divide-accent-light">
        <HoverLink href="/">Groovy</HoverLink>
        <HoverLink href="/discover">Discover</HoverLink>
        <HoverLink href="/genres">Genres</HoverLink>
        <HoverLink href="/upload-song">Upload</HoverLink>
        <HoverLink href="/history">History</HoverLink>
      </div>
    </nav>
  );
}

export default Navbar;
