/* eslint-disable @typescript-eslint/no-explicit-any */

export const isPercentageField = (key: string): boolean => {
  return (
    key.includes("RATE") ||
    key.includes("EIR") ||
    key.includes("LGD") ||
    key === "HAIRCUT"
  );
};

export const isCurrencyField = (key: string): boolean => {
  return (
    key.includes("BALANCE") ||
    key.includes("AMOUNT") ||
    key.includes("VALUE") ||
    key.includes("SECURED RECOVERY") ||
    key.includes("ALLOCATED") ||
    key.includes("UTILIZED")
  );
};

export const formatCurrency = (value: number): string => {
  return `₦${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const formatCellValue = (key: string, value: any): React.ReactNode => {
  if (value === null) {
    return <span className="text-gray-400 italic">N/A</span>;
  }

  if (typeof value === "number") {
    let formattedValue: string;

    if (isPercentageField(key)) {
      formattedValue = formatPercentage(value);
    } else if (isCurrencyField(key)) {
      formattedValue = formatCurrency(value);
    } else {
      formattedValue = String(value);
    }

    return <span className="text-[#444846]">{formattedValue}</span>;
  }

  const stringValue = String(value);
  const textColor =
    key === "CLIENT NAME" ? "text-[#003A1B] font-medium" : "text-[#444846]";

  return <span className={textColor}>{stringValue}</span>;
};
