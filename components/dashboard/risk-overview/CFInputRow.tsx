import React from "react";

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  isCalculated?: boolean;
}

const CFInputRow: React.FC<Props> = ({
  label,
  value,
  onChange,
  isCalculated,
}) => (
  <div className="flex flex-col gap-[2px] mb-4">
    <span
      className={`text-[13px] font-medium ${
        isCalculated ? "text-amber-600" : "text-gray-600"
      }`}
    >
      {label}
    </span>

    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full h-[41px] px-3 text-right text-[12px] font-medium rounded-[8px] border outline-none
        ${
          isCalculated
            ? "border-amber-300 bg-amber-50 text-amber-700"
            : "border-gray-200 bg-InfraBorder text-gray-700"
        }`}
      placeholder="0"
    />
  </div>
);

export default CFInputRow;
