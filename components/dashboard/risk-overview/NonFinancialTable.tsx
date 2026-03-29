/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface NonFinancialsTableRow {
  label: string;
  value?: string | number | null;
  score?: string | number | null;
}

interface NonFinancialsTableProps {
  rows: NonFinancialsTableRow[];
}

const formatValue = (value: any): string => {
  if (value === undefined || value === null) return "-";
  if (typeof value === "number") {
    // Format percentages (values between -100 and 100 that look like percentages)
    if (
      value <= 100 &&
      value >= -100 &&
      (value.toString().includes(".") || Math.abs(value) < 10)
    ) {
      return `${value.toFixed(2)}%`;
    }
    // Format large numbers with commas
    if (Math.abs(value) >= 1000) {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return value.toFixed(2);
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
};

const NonFinancialsTable = ({ rows }: NonFinancialsTableProps) => {
  if (!rows.length) {
    return (
      <div className="text-center py-8 text-gray-500">No data available</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-[#F9FAFB]">
            <th className="text-left px-4 py-2 font-semibold text-gray-500">
              LINE ITEM
            </th>
            <th className="text-left px-4 py-2 font-semibold text-gray-500">
              SCORE
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-gray-100">
              <td className="px-4 py-2 text-gray-700 font-medium">
                {row.label}
              </td>
              <td className="px-4 py-2 text-gray-600">
                {formatValue(row.value ?? row.score)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NonFinancialsTable;
