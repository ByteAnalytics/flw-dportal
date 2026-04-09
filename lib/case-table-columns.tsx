import { TableColumn } from "@/components/ui/custom-table";

export function buildCaseTableColumns(
  selectAll: boolean,
  onSelectAll: () => void,
): TableColumn[] {
  return [
    {
      key: "checkbox",
      label: (
        <input
          type="checkbox"
          checked={selectAll}
          onChange={onSelectAll}
          className="w-4 h-4 rounded border-gray-300 text-[#006F37] focus:ring-[#006F37] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
      ),
      width: "w-12",
    },
    { key: "caseId", label: "CASE NO", width: "w-[100px]" },
    {
      key: "customerName",
      label: "CUSTOMER NAME",
      width: "md:w-[200px] w-[150px]",
    },
    { key: "facilityType", label: "FACILITY TYPE", align: "left" },
    { key: "rater", label: "RATER", align: "left" },
    { key: "validator", label: "VALIDATOR", align: "left" },
    { key: "lastUpdated", label: "LAST UPDATED", align: "left" },
    { key: "status", label: "STATUS", align: "left" },
    { key: "rating", label: "RATING", align: "left" },
    { key: "actions", label: "ACTIONS", align: "left" },
  ];
}
