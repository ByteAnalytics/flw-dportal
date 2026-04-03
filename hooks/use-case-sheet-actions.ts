import { useRiskOverviewStore } from "@/stores/risk-overview-store";
import { useCaseNavigation } from "./use-case-navigation";

interface CaseActionParams {
  caseId: string;
  facilityType: string;
  status: string;
}

/**
 * Hook for handling case sheet selection based on status
 * Determines which sheet/modal to open when a case is clicked
 */
export const useCaseSheetActions = () => {
  const { setSelectedCaseId, setActiveDetailsSheet } = useRiskOverviewStore();
  const { goToPageIfDraft } = useCaseNavigation();

  /**
   * Handle case action based on status
   * Maps different statuses to their corresponding sheet
   */
  const handleCaseAction = (params: CaseActionParams) => {
    const { caseId, facilityType, status } = params;
    const statusUpper = status?.toUpperCase();

    setSelectedCaseId(caseId);

    switch (statusUpper) {
      case "PENDING_REVIEW":
      case "PENDING":
        setActiveDetailsSheet("validation");
        break;
      case "REJECTED":
      case "RETURNED":
        setActiveDetailsSheet("returned");
        break;
      case "VALIDATED":
      case "APPROVED":
        setActiveDetailsSheet("details");
        break;
      case "DRAFT":
        goToPageIfDraft(caseId, facilityType);
        break;
      default:
        setActiveDetailsSheet("details");
    }
  };

  return { handleCaseAction };
};
