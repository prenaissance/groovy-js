import type { ComponentProps, Ref} from "react";
import { forwardRef, memo, useId } from "react";
import TextField from "./TextField";

type Props = {
  options: string[];
} & ComponentProps<typeof TextField>;

function Autocomplete({ children, options, ...props }: Props,
  ref: Ref<HTMLInputElement>) {
  const datalistId = useId();

  return (
    <>
      <TextField {...props} list={datalistId} ref={ref} />
      <datalist id={datalistId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </>
  );
}

export default memo(forwardRef(Autocomplete));
