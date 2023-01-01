import { forwardRef, InputHTMLAttributes, Ref, useId } from "react";
import TextField from "./TextField";

type Props = {
  options: string[];
  color: "primary" | "secondary" | "accent";
} & InputHTMLAttributes<HTMLInputElement>;

const Autocomplete = (
  { children, options, ...props }: Props,
  ref: Ref<HTMLInputElement>
) => {
  const datalistId = useId();
  return (
    <>
      <TextField {...props} list={datalistId} ref={ref}></TextField>
      <datalist id={datalistId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </>
  );
};

export default forwardRef(Autocomplete);
