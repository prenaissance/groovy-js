import clsx from "clsx";
import type {
  ChangeEventHandler,
  InputHTMLAttributes,
  PointerEventHandler,
} from "react";
import { useMemo, useCallback, useRef, memo } from "react";

const minmax = (min: number, max: number, value: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const inputToNumber = (
  value: string | number | readonly string[] | undefined,
) => {
  if (typeof value === "string") {
    return parseInt(value, 10);
  }
  if (Array.isArray(value)) {
    return parseInt(value[0], 10);
  }
  if (typeof value === "number") {
    return value;
  }

  return NaN;
};

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  defaultValue?: number;
  noThumb?: boolean;
};

// Skipping rerendering for performance and instant feedback
function SliderInput({
  min = 0,
  max = 100,
  defaultValue = 50,
  noThumb = false,
  ...rest
}: Props) {
  const props = { min, max, defaultValue, ...rest };
  const { className, onChange } = props;

  const value = useRef(defaultValue);
  const percentage = useMemo(
    () =>
      (((inputToNumber(props.value) || value.current) - min) / (max - min)) *
      100,
    [value, min, max, props.value],
  );
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const pointerId = useRef<number | null>(null);

  const updateSlider = useCallback(
    (clientX: number) => {
      const { left, width } = sliderRef.current!.getBoundingClientRect();
      const newValue = minmax(min, max, ((clientX - left) / width) * max);
      const newPercentage = ((newValue - min) / (max - min)) * 100;

      value.current = newValue;
      onChange?.(newValue);

      sliderRef.current!.style.setProperty("--percentage", `${newPercentage}%`);
    },
    [sliderRef, min, max, onChange],
  );

  const handleSliderClick: PointerEventHandler<HTMLDivElement> = (e) => {
    const { clientX } = e;
    updateSlider(clientX);
  };

  const handleThumbPointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    isDragging.current = true;
    pointerId.current = e.nativeEvent.pointerId;
    sliderRef.current?.setPointerCapture(e.nativeEvent.pointerId);
  };

  const handleSliderHeadMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging.current) return;
    const { clientX } = e;
    updateSlider(clientX);
  };

  const handleSliderHeadPointerUp = () => {
    isDragging.current = false;
    sliderRef.current?.releasePointerCapture(pointerId.current!);
  };

  const handleScreenReaderChange: ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    const val = Number(e.target.value);
    const distanceX = (val / 100) * sliderRef.current!.clientWidth;
    updateSlider(distanceX);
  };

  return (
    <div
      className={clsx(
        className,
        "after:w-[calc(100% - var(--percentage))] relative h-1 w-16 cursor-pointer rounded-full bg-primary-dark before:absolute before:left-0 before:top-0 before:h-full before:w-[var(--percentage)] before:rounded-full before:bg-accent-light before:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:rounded-full after:bg-primary-contrast after:content-['']",
      )}
      style={{ "--percentage": `${percentage}%` } as any}
      onClick={handleSliderClick}
      ref={sliderRef}
      onPointerDown={handleThumbPointerDown}
      onPointerMove={handleSliderHeadMove}
      onPointerUp={handleSliderHeadPointerUp}
      onPointerLeave={handleSliderHeadPointerUp}
      data-percentage={`${percentage}%`}
    >
      <input
        {...props}
        onChange={handleScreenReaderChange}
        type="range"
        step={(max - min) / 20}
        className="sr-only"
      />
      {!noThumb && (
        <div
          className="pointer-events-none absolute -top-[66%] left-[var(--percentage)] aspect-square h-[300%] rounded-full bg-accent-dark outline outline-1 outline-accent-light group-hover:visible"
          onPointerDown={handleThumbPointerDown}
        />
      )}
    </div>
  );
}

export default memo(SliderInput);
