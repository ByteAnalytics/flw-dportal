export const ITEMS_PER_PAGE = 10;

export const FLI_COLUMNS = [
  { key: "Year", label: "YEAR", width: "w-[100px]" },
  { key: "Best Case", label: "BEST CASE", width: "w-[150px]" },
  { key: "Baseline", label: "BASELINE", width: "w-[150px]" },
  { key: "Worst Case", label: "WORST CASE", width: "w-[150px]" },
  {
    key: "Probability_Weighted",
    label: "PROBABILITY WEIGHTED",
    width: "w-[180px]",
  },
];

export const TAB_CONFIG = [
  { value: "fli-pd", label: "FLI PD Scenarios", dataKey: "fli_scenarios_pd" },
  {
    value: "fli-ead",
    label: "FLI EAD Scenarios",
    dataKey: "fli_scenarios_ead",
  },
] as const;
