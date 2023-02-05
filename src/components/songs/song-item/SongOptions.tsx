import { AiOutlineEllipsis } from "react-icons/ai";

import ExpandableMenu from "@components/ui/ExpandableMenu";
import type { Position } from "@components/ui/ExpandableMenu";
import ShallowButton from "@components/ui/ShallowButton";

type Props = {
  songId: string;
  size?: string;
  position?: Position;
};

function SongOptions({ songId, size = "32px", position = "bottom" }: Props) {
  return (
    <ExpandableMenu
      className="w-auto break-keep rounded-md border border-accent-light bg-secondary-dark py-1 px-2 shadow-md"
      position={position}
      buttonContent={<AiOutlineEllipsis size={size} />}
    >
      <li>
        <ShallowButton>Option 1</ShallowButton>
      </li>
    </ExpandableMenu>
  );
}

export default SongOptions;
