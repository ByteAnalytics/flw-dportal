/* eslint-disable @typescript-eslint/no-explicit-any */

export const TAB_LABELS: Record<string, string> = {
  "monthly-combo-metrics": "monthly combo metrics",
  "yearly-combo-metrics": "yearly combo metrics",
  "monthly-marginal": "monthly marginal PD",
  "monthly-cumulative": "monthly cumulative PD",
  "scaled-monthly-conditional": "scaled monthly conditional PD",
  "monthly-pd": "monthly PD",
  "annual-pd": "annual PD",
};

export const DEFAULT_COLUMNS = [
  "Obligor Type",
  "Month No",
  "Year",
  "M1",
  "M2",
  "M3",
  "M4",
  "M5",
  "M6",
  "M7",
  "M8",
  "M9",
  "M10",
  "M11",
  "M12",
];

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

export const EXCLUDED_KEYS = ["Rating", "rating_index", "index"];

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
