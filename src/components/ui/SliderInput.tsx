import clsx from "clsx";
import type {
  ChangeEventHandler,
  InputHTMLAttributes,
  PointerEventHandler,
} from "react";
import { useCallback, useRef, memo } from "react";

const minmax = (min: number, max: number, value: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

type Props = InputHTMLAttributes<HTMLInputElement> & {
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
  const props = { min, max, defaultValue, noThumb, ...rest };
  const { className, onChange } = props;

  const value = useRef(defaultValue);
  const percentage = useRef(((defaultValue - min) / (max - min)) * 100);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const pointerId = useRef<number | null>(null);

  const updateSlider = useCallback(
    (clientX: number) => {
      const { left, width } = sliderRef.current!.getBoundingClientRect();
      const newValue = minmax(min, max, ((clientX - left) / width) * max);
      const newPercentage = ((newValue - min) / (max - min)) * 100;

      value.current = newValue;
      percentage.current = newPercentage;
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
        "relative h-1 w-16 cursor-pointer rounded-full bg-primary-dark",
      )}
      style={{ "--percentage": `${percentage.current}%` } as any}
      onClick={handleSliderClick}
      ref={sliderRef}
      onPointerDown={handleThumbPointerDown}
      onPointerMove={handleSliderHeadMove}
      onPointerUp={handleSliderHeadPointerUp}
      onPointerLeave={handleSliderHeadPointerUp}
      data-percentage={`${percentage.current}%`}
    >
      <input
        {...props}
        onChange={handleScreenReaderChange}
        type="range"
        step={(max - min) / 20}
        className="sr-only"
      />
      <div className="width-[calc(var(--percentage) - 1px)] absolute left-0 z-[1] h-full bg-white" />
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
