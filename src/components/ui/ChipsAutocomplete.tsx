import { forwardRef, useCallback, useId, useMemo, useState } from "react";
import type {
  ChangeEventHandler,
  KeyboardEventHandler,
  ReactNode,
  ComponentProps,
} from "react";
import type { Option } from "@lib/options";
import { getUniformOptions } from "@lib/options";
import TextField from "./TextField";
import Chip from "./Chip";

type Props = {
  options: Option[];
  onChange: ChangeEventHandler;
} & ComponentProps<typeof TextField>;

type ContainerProps = {
  selectedValues: string[];
  children: ReactNode;
  getDeleteChipHandler: (index: number) => () => void;
};

function Container({
  selectedValues,
  children,
  getDeleteChipHandler,
}: ContainerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {selectedValues.map((value, index) => (
        <Chip key={value} removable onRemove={getDeleteChipHandler(index)}>
          {value}
        </Chip>
      ))}
      {children}
    </div>
  );
}

function ChipsAutocomplete({ options, onChange, className, ...props }: Props) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const dataListId = useId();
  const availableOptions = useMemo(() => {
    const uniformOptions = getUniformOptions(options);
    return uniformOptions.filter((opt) => !selectedValues.includes(opt.value));
  }, [options, selectedValues]);

  const handleEnterKeystroke = useCallback<
    KeyboardEventHandler<HTMLInputElement>
  >(
    (e) => {
      if (e.key !== "Enter") return;
      const option = availableOptions.find((opt) => opt.label === inputValue);
      if (option) {
        setSelectedValues((prev) => [...prev, option.value]);
        setInputValue("");
      }
    },
    [availableOptions, inputValue],
  );

  const handleInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const { value } = e.target;
      const option = availableOptions.find((opt) => opt.value === value);
      const label = option?.label ?? value;
      setInputValue(label);
      onChange(e);
    },
    [availableOptions, onChange],
  );

  const getDeleteChipHandler = useCallback(
    (index: number) => () => {
      setSelectedValues((prev) => prev.filter((_, i) => i !== index));
    },
    [],
  );

  const ChipContainer = useCallback(
    (containerProps: { children: ReactNode }) => (
      <Container
        selectedValues={selectedValues}
        getDeleteChipHandler={getDeleteChipHandler}
      >
        {containerProps.children}
      </Container>
    ),
    [selectedValues, getDeleteChipHandler],
  );

  return (
    <>
      <TextField
        {...props}
        list={dataListId}
        className={className}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleEnterKeystroke}
        container={ChipContainer}
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

export default forwardRef(ChipsAutocomplete);
