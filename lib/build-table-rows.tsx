import { formatDate, formatLabel } from "@/lib/utils";
import { ActiveDetailsSheet, CaseItem } from "@/types/risk-overview";

interface TableRowHandlers {
  setSelectedCaseId: (id: string) => void;
  setActiveDetailsSheet: (sheet: ActiveDetailsSheet) => void;
  goToPageIfDraft: (id: string, facilityType: string) => void;
  selectedRows: Set<string>;
  handleRowSelect: (caseId: string) => void;
  isValidValidator: boolean;
}

export function buildTableRows(
  data: CaseItem[] | undefined,
  handlers: TableRowHandlers,
) {
  if (!data) return [];

  const {
    setSelectedCaseId,
    setActiveDetailsSheet,
    goToPageIfDraft,
    selectedRows,
    handleRowSelect,
    isValidValidator,
  } = handlers;

  return data.map((c) => {
    const caseStatus = c.status?.toUpperCase() ?? "";
    const statusLabel = formatLabel(c.status);

   const canReview =
     isValidValidator &&
     (caseStatus === "PENDING_REVIEW" || caseStatus === "IN_REVIEW");

    const isClickable = isValidValidator ? caseStatus !== "DRAFT" : true;

    const actionLabel =
      caseStatus === "PENDING_REVIEW" || caseStatus === "IN_REVIEW"
        ? canReview
          ? "Review"
          : "View Only"
        : caseStatus === "REJECTED"
          ? "View"
          : "Open";

    const handleAction = () => {
      if (!isClickable) return;

      setSelectedCaseId(c.id);
      if (caseStatus === "PENDING_REVIEW" || caseStatus === "IN_REVIEW") {
        if (canReview) {
          setActiveDetailsSheet("validation");
        } else {
          setActiveDetailsSheet("details");
        }
      } else if (caseStatus === "REJECTED") {
        setActiveDetailsSheet("returned");
      } else if (caseStatus === "DRAFT") {
        goToPageIfDraft(c.id, c.facility_type); // unreachable for validators since isClickable=false
      } else {
        setActiveDetailsSheet("details");
      }
    };

    return {
      checkbox: (
        <input
          type="checkbox"
          checked={selectedRows.has(c.id)}
          onChange={() => handleRowSelect(c.id)}
          className="w-4 h-4 rounded border-gray-300 text-[#006F37] focus:ring-[#006F37] cursor-pointer"
        />
      ),
      caseId: (
        <span className="text-gray-500 font-medium">{c.case_number}</span>
      ),
      customerName: (
        <span className="text-[#003A1B] font-semibold">{c.customer_name}</span>
      ),
      facilityType: c.facility_type,
      rater: c.rater_name,
      validator: c.validator_name ?? "-",
      lastUpdated: formatDate(c.last_updated),
      status: statusLabel,
      rating: (
        <span className="font-semibold text-gray-700">{c.rating ?? "-"}</span>
      ),
      actions: (
        <span
          className={`flex items-center gap-1 text-[13px] font-semibold ${
            isClickable
              ? "text-emerald-600 cursor-pointer hover:text-emerald-700"
              : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={handleAction}
        >
          {actionLabel} {(canReview || caseStatus === "DRAFT") && "→"}
        </span>
      ),
    };
  });
}
