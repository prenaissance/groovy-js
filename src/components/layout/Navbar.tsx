import Link from "next/link";
import { BiMenu } from "react-icons/bi";

type Props = {
  onExpand: () => void;
};

function Navbar({ onExpand }: Props) {
  return (
    <nav className="sticky top-0 z-[49] flex flex-row items-center justify-start border-b border-accent-light bg-secondary p-1">
      <button
        type="button"
        className="hover:bg-secondary-dark/20 flex flex-row items-center p-1 text-secondary-contrast"
        onClick={onExpand}
      >
        <BiMenu size="24px" />
      </button>
      <div className="m-y-2 flex h-fit flex-row divide-x divide-accent-light font-semibold text-secondary-contrast">
        <Link className="px-2" href="/">
          Groovy
        </Link>
        <Link className="px-2" href="/songs">
          Songs
        </Link>
        <Link className="px-2" href="/upload-song">
          Upload
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
