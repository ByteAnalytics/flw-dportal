import { formatDate, formatLabel } from "@/lib/utils";
import { ActiveDetailsSheet, CaseItem } from "@/types/risk-overview";

interface TableRowHandlers {
  setSelectedCaseId: (id: string) => void;
  setActiveDetailsSheet: (sheet: ActiveDetailsSheet) => void;
  goToPageIfDraft: (id: string, facilityType: string) => void;
}

export function buildTableRows(
  data: CaseItem[] | undefined,
  handlers: TableRowHandlers,
) {
  if (!data) return [];

  const { setSelectedCaseId, setActiveDetailsSheet, goToPageIfDraft } =
    handlers;

  return data.map((c) => {
    const caseStatus = c.status?.toUpperCase() ?? "";
    const statusLabel = formatLabel(c.status);

    const actionLabel =
      caseStatus === "PENDING_REVIEW"
        ? "Review"
        : caseStatus === "REJECTED"
          ? "View"
          : "Open";

    const handleAction = () => {
      setSelectedCaseId(c.id);
      if (caseStatus === "PENDING_REVIEW") setActiveDetailsSheet("validation");
      else if (caseStatus === "REJECTED") setActiveDetailsSheet("returned");
      else if (caseStatus === "DRAFT") goToPageIfDraft(c.id, c.facility_type);
      else setActiveDetailsSheet("details");
    };

    return {
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
          className="flex items-center gap-1 text-[13px] font-semibold text-emerald-600 cursor-pointer hover:text-emerald-700"
          onClick={handleAction}
        >
          {actionLabel} →
        </span>
      ),
    };
  });
}
