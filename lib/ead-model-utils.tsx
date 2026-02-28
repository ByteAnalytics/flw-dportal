/* eslint-disable @typescript-eslint/no-explicit-any */

export const isPercentageField = (key: string): boolean => {
  return (
    key.includes("RATE") ||
    key.includes("EIR") ||
    key === "MONTHLY EIR" ||
    key === "PERIODIC EIR" ||
    key === "EIR ADJUSTED"
  );
};

export const isCurrencyField = (key: string): boolean => {
  return (
    key.includes("AMOUNT") ||
    key.includes("BALANCE") ||
    key === "UNDRAWN" ||
    key === "COLLATERAL AMOUNT"
  );
};

export const isMonthlyProjection = (key: string): boolean => {
  return key.includes("202") || key.includes("PMT");
};

export const isDateField = (key: string): boolean => {
  return key.includes("DATE");
};

export const formatCurrency = (value: number): string => {
  return `₦${value.toLocaleString()}`;
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const formatDateValue = (value: string): string => {
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCellValue = (key: string, value: any): React.ReactNode => {
  if (value === null) {
    return <span className="text-gray-400 italic">N/A</span>;
  }

  if (key === "LOAN UNIQUE ID") {
    return <span className="text-[#003A1B] font-medium">{String(value)}</span>;
  }

  if (key === "CLIENT NAME") {
    return <span className="text-[#003A1B] font-medium">{String(value)}</span>;
  }

  if (typeof value === "number") {
    let formattedValue: string;

    if (isPercentageField(key)) {
      formattedValue = formatPercentage(value);
    } else if (isCurrencyField(key)) {
      formattedValue = formatCurrency(value);
    } else if (isMonthlyProjection(key)) {
      formattedValue = value.toLocaleString();
    } else {
      formattedValue = String(value);
    }

    return <span className="text-[#444846]">{formattedValue}</span>;
  }

  const stringValue = String(value);

  if (isDateField(key)) {
    return (
      <span className="text-[#444846]">{formatDateValue(stringValue)}</span>
    );
  }

  return <span className="text-[#444846]">{stringValue}</span>;
};
