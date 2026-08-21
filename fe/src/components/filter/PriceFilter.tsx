import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export interface PriceRangeProps {
  min: number;
  max: number;
  onFilterChange: (value: string) => void;
  currentValue: string;
}

export default function PriceFilter({
  min,
  max,
  currentValue,
  onFilterChange,
}: PriceRangeProps) {
  const values = currentValue
    ? currentValue.split("-").map(Number)
    : [min, max];

  return (
    <div className="flex flex-col gap-4 mt-10">
     <h3 className="font-sans text-lg">Khoảng giá</h3>

      <Slider
        className="text-[#0a1813]"
        range
        min={min}
        max={max}
        step={10000}
        value={values}
        onChange={(value) => {
          if (Array.isArray(value)) {
            onFilterChange(`${value[0]}-${value[1]}`);
          }
        }}
      />

      <div className="flex justify-between text-sm">
        <span>{values[0].toLocaleString("vi-VN")}đ</span>

        <span>{values[1].toLocaleString("vi-VN")}đ</span>
      </div>
    </div>
  );
}
