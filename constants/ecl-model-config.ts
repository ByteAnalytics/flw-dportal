export const ITEMS_PER_PAGE = 10;

export const ECL_DF_COLUMNS = [
  { key: "Scenario", label: "SCENARIO", width: "w-[140px]" },
  { key: "Counter Party", label: "COUNTER PARTY", width: "w-[200px]" },
  { key: "Rating", label: "RATING", width: "w-[100px]" },
  { key: "Stage", label: "STAGE", width: "w-[90px]" },
  { key: "ECL", label: "ECL", width: "w-[140px]" },
];

export const ECL_PER_ASSET_COLUMNS = [
  { key: "Counter Party", label: "ASSET DESCRIPTION", width: "w-[200px]" },
  { key: "Carrying Amount", label: "CARRYING AMOUNT", width: "w-[160px]" },
  { key: "Baseline", label: "BASELINE", width: "w-[140px]" },
  { key: "Best Case", label: "BEST CASE", width: "w-[140px]" },
  { key: "Worst Case", label: "WORST CASE", width: "w-[140px]" },
  {
    key: "Probability Weighted ECL",
    label: "WEIGHTED ECL",
    width: "w-[160px]",
  },
  { key: "ECL with Scalar", label: "ECL SCALAR", width: "w-[150px]" },
  { key: "ECL Ratio", label: "ECL RATIO", width: "w-[120px]" },
];

export const TAB_CONFIG = [
  { value: "ecl", label: "ECL Summary", scenario: null },
  { value: "baseline", label: "Baseline", scenario: "Baseline" },
  { value: "best-case", label: "Best Case", scenario: "Best Case" },
  { value: "worst-case", label: "Worst Case", scenario: "Worst Case" },
] as const;
