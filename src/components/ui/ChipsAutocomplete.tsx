import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChangeEventHandler, ReactNode, ComponentProps } from "react";

import type { Option } from "@lib/options";
import { getUniformOptions } from "@lib/options";
import TextField from "./TextField";
import Chip from "./Chip";
import RemoveIcon from "./RemoveIcon";

type Props = {
  options: Option[];
  onSelectedChange?: (data: string[]) => void;
} & ComponentProps<typeof TextField>;

function ChipsAutocomplete({
  options,
  onChange,
  onSelectedChange,
  className,
  ...props
}: Props) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const dataListId = useId();
  const shouldFocusRef = useRef(false);
  const focusRef = useRef<HTMLInputElement>(null);
  const availableOptions = useMemo(() => {
    const uniformOptions = getUniformOptions(options);
    return uniformOptions.filter((opt) => !selectedValues.includes(opt.value));
  }, [options, selectedValues]);

  useEffect(() => {
    if (shouldFocusRef.current) {
      shouldFocusRef.current = false;
      focusRef.current?.focus();
    }
  });

  const handleInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const { value } = e.target;
      const option = availableOptions.find(
        (opt) => opt.value === value || opt.label === value,
      );
      const label = option?.label ?? value;
      setInputValue(label);
      if (option) {
        const newValues = [...selectedValues, option.value];
        setSelectedValues(newValues);
        onSelectedChange?.(newValues);
        setInputValue("");
        shouldFocusRef.current = true;
      }
      onChange?.(e);
    },
    [availableOptions, onChange, onSelectedChange, selectedValues],
  );

  const handleClear = useCallback(() => {
    setSelectedValues([]);
    onSelectedChange?.([]);
    shouldFocusRef.current = true;
    setInputValue("");
    // misses dispatching onChange event, 99% won't need this
  }, [onSelectedChange]);

  const getDeleteChipHandler = useCallback(
    (index: number) => () => {
      const newValues = selectedValues.filter((_, i) => i !== index);
      setSelectedValues(newValues);
      onSelectedChange?.(newValues);
      shouldFocusRef.current = true;
    },
    [selectedValues, onSelectedChange],
  );

  const ChipContainer = useCallback(
    (containerProps: { children: ReactNode }) => (
      <div className="flex w-full justify-center">
        <div className="flex flex-1 flex-wrap gap-2">
          {selectedValues.map((value, index) => (
            <Chip key={value} removable onRemove={getDeleteChipHandler(index)}>
              {value}
            </Chip>
          ))}
          {containerProps.children}
        </div>
        {selectedValues.length > 0 && <RemoveIcon onRemove={handleClear} />}
      </div>
    ),
    [selectedValues, getDeleteChipHandler, handleClear],
  );

  return (
    <>
      <TextField
        {...props}
        list={dataListId}
        className={className}
        value={inputValue}
        onChange={handleInputChange}
        container={ChipContainer}
        ref={focusRef}
      />
      <datalist id={dataListId}>
        {availableOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </datalist>
    </>
  );
}

export default ChipsAutocomplete;
