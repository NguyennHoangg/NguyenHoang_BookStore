
import "rc-slider/assets/index.css";

export interface PriceRangeProps {
  options: Array<{
    id: number;
    value: string;
    label: string;
    min: number;
    max: number;
  }>;
  onFilterChange: (value: string) => void;
  currentValue: string;
}



export default function PriceFilter({
  options,
  currentValue,
  onFilterChange,
}: PriceRangeProps) {
  return (
    <div className="flex flex-col gap-4 mt-10">
      <h3 className="font-serif italic text-[#153328] text-xl">Khoảng giá</h3>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onFilterChange(option.value)}
            className={`px-3 py-2 rounded-md text-sm transition-colors ${
              currentValue === option.value
                ? "bg-[#153328] text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
