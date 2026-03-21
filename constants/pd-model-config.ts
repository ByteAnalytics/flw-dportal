/* eslint-disable @typescript-eslint/no-explicit-any */

export const RISK_OPTIONS = [
  { label: "AAA", value: "AAA" },
  { label: "AA+", value: "AA+" },
  { label: "AA", value: "AA" },
  { label: "AA-", value: "AA-" },
  { label: "A+", value: "A+" },
  { label: "A", value: "A" },
  { label: "A-", value: "A-" },
  { label: "BBB+", value: "BBB+" },
  { label: "BBB", value: "BBB" },
  { label: "BBB-", value: "BBB-" },
  { label: "BB+", value: "BB+" },
  { label: "BB", value: "BB" },
  { label: "BB-", value: "BB-" },
  { label: "B+", value: "B+" },
  { label: "B", value: "B" },
  { label: "B-", value: "B-" },
  { label: "BC", value: "BC" },
  { label: "CCC/C", value: "CCC/C" },
];

export const EXCLUDED_KEYS = ["rating_index", "index", "PD_Metric"];

export const TABS_WITH_PD_METRICS = [
  "monthly-combo-metrics",
  "yearly-combo-metrics",
];

export const formatPDValue = (value: any): React.ReactNode => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "N/A"
  ) {
    return "-";
  }

  const num = Number(value);
  if (!isNaN(num)) {
    const isLikelyDecimal = num < 1 && num !== 0;
    const displayValue = isLikelyDecimal ? num * 100 : num;

    return `${displayValue.toFixed(2)}%`;
  }

  return String(value);
};

export const RATING_ORDER: { [key: string]: number } = {
  AAA: 1,
  "AA+": 2,
  AA: 3,
  "AA-": 4,
  "A+": 5,
  A: 6,
  "A-": 7,
  "BBB+": 8,
  BBB: 9,
  "BBB-": 10,
  "BB+": 11,
  BB: 12,
  "BB-": 13,
  "B+": 14,
  B: 15,
  "B-": 16,
  BC: 17,
  "CCC/C": 18,
};

export const ITEMS_PER_PAGE = 10;

export const MONTHLY_TAB_METRIC_MAP: Record<string, string | null> = {
  // "monthly-pd": null,
  "scaled-monthly-conditional": "Scaled_Monthly_Conditional_PD",
  "monthly-cumulative": "Monthly_Cummulative_PD",
  "monthly-marginal": "Monthly_Marginal_PD",
  Annual_Conditional_PD: "Annual_Conditional_PD",
};

export const YEARLY_TAB_METRIC_MAP: Record<string, string | null> = {
  Annual_Conditional_PD: "Annual_Conditional_PD",
};

export const TAB_CONFIG = [
  { value: "Annual_Conditional_PD", label: "Annual PD", type: "yearly" },
  { value: "monthly-marginal", label: "Marginal", type: "monthly" },
  {
    value: "scaled-monthly-conditional",
    label: "Conditional",
    type: "monthly",
  },
  { value: "monthly-cumulative", label: "Cumulative", type: "monthly" },
];
