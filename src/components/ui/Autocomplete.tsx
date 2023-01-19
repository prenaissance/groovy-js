import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentProps, Ref, ChangeEventHandler } from "react";
import type { Option } from "@lib/options";
import { getUniformOptions } from "@lib/options";
import TextField from "./TextField";

export type AutocompleteRefValue = { value: string; inputValue: string };

type Props = {
  options: Option[];
  defaultInputValue?: string;
  onSelectedChange?: (value: string) => void;
  onInputChange?: (value: string) => void;
} & ComponentProps<typeof TextField>;

function Autocomplete(
  {
    defaultValue = "",
    defaultInputValue = "",
    onSelectedChange,
    onInputChange,
    options,
    ...props
  }: Props,
  ref: Ref<AutocompleteRefValue>,
) {
  const datalistId = useId();
  const valueRef = useRef(defaultValue?.toString() ?? "");
  const [inputValue, setInputValue] = useState(defaultInputValue);
  const uniformOptions = useMemo(() => getUniformOptions(options), [options]);
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const currentValue = e.target.value;
      const option = uniformOptions.find(
        (opt) => opt.value === currentValue || opt.label === currentValue,
      );

      setInputValue(currentValue);
      onInputChange?.(currentValue);

      if (option) {
        valueRef.current = option.value;
        setInputValue(option.label);
        onSelectedChange?.(option.value);
      }

      if (!option && currentValue === "") {
        valueRef.current = "";
        onSelectedChange?.("");
      }
    },
    [onSelectedChange, onInputChange, uniformOptions],
  );

  useImperativeHandle(
    ref,
    () => ({
      value: valueRef.current,
      get inputValue() {
        return inputValue;
      },
      set inputValue(val) {
        setInputValue(val);
      },
    }),
    [inputValue],
  );

  return (
    <>
      <TextField
        onChange={handleChange}
        value={inputValue}
        {...props}
        list={datalistId}
      />
      <datalist id={datalistId}>
        {uniformOptions.map(({ label, value: optionValue }) => (
          <option key={label} value={optionValue}>
            {label}
          </option>
        ))}
      </datalist>
    </>
  );
}

export default forwardRef(Autocomplete);
