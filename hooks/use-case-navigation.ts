import { useRouter } from "nextjs-toploader/app";
import { useRiskOverviewStore } from "@/stores/risk-overview-store";

/**
 * Hook for handling case navigation logic
 * Manages navigation to draft cases and sheet state
 */
export const useCaseNavigation = () => {
  const router = useRouter();
  const { setSelectedCaseId, setIsSheetOpen } = useRiskOverviewStore();

  const goToPageIfDraft = (caseId: string, facilityType: string) => {
    setSelectedCaseId(caseId);
    setIsSheetOpen(true);
    router.push(
      `/dashboard/ccr/overview?step=pf_financials&caseId=${caseId}&facilityType=${encodeURIComponent(facilityType)}`,
    );
  };

  return { goToPageIfDraft };
};
