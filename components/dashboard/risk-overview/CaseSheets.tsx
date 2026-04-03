import { SheetWrapper } from "@/components/ui/custom-sheet";
import CaseDetailsSheet from "./CaseDetailsSheet";
import { ReturnedCaseSheet } from "./ReturnedCaseSheet";
import ValidationReviewSheet from "./ValidationReviewSheet";
import { ActiveDetailsSheet } from "@/types/risk-overview";
import { useQueryClient } from "@tanstack/react-query";

interface CaseSheetsProps {
  activeDetailsSheet: ActiveDetailsSheet;
  selectedCaseId: string | null;
  setActiveDetailsSheet: (sheet: ActiveDetailsSheet) => void;
  setIsSheetOpen: (open: boolean) => void;
}

export const CaseSheets = ({
  activeDetailsSheet,
  selectedCaseId,
  setActiveDetailsSheet,
  setIsSheetOpen,
}: CaseSheetsProps) => {
  const queryClient = useQueryClient();

  const close = () => setActiveDetailsSheet(null);

  const handleCaseApproved = () => {
    // Invalidate the case details to refresh the data
    if (selectedCaseId) {
      queryClient.invalidateQueries({
        queryKey: ["case-details", selectedCaseId],
      });
    }
    close();
  };

  return (
    <>
      <SheetWrapper
        title="Case Details"
        open={activeDetailsSheet === "details"}
        setOpen={close}
        width="sm:max-w-[80%]"
        headerClassName="bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] !text-white"
        titleClassName="text-white px-6 py-4"
        SheetContentClassName="p-0 bg-white"
      >
        {selectedCaseId && (
          <CaseDetailsSheet caseId={selectedCaseId} onClose={close} />
        )}
      </SheetWrapper>

      <SheetWrapper
        title="Returned Case"
        open={activeDetailsSheet === "returned"}
        setOpen={close}
        width="sm:max-w-[80%]"
        headerClassName="bg-gradient-to-r from-[#ea580c] to-[#f59e0b] !text-white"
        titleClassName="text-white px-6 py-4"
        SheetContentClassName="p-0 bg-white"
      >
        {selectedCaseId && (
          <ReturnedCaseSheet
            caseId={selectedCaseId}
            onClose={close}
            onEditAndResubmit={close}
          />
        )}
      </SheetWrapper>

      <SheetWrapper
        title="Validation Review"
        open={activeDetailsSheet === "validation"}
        setOpen={close}
        width="sm:max-w-[80%]"
        headerClassName="bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] !text-white"
        titleClassName="text-white px-6 py-4"
        SheetContentClassName="p-0 bg-white"
      >
        {selectedCaseId && (
          <ValidationReviewSheet
            caseId={selectedCaseId}
            onClose={close}
            onReturnForRevision={() => {
              close();
              setIsSheetOpen(true);
            }}
            onApproveRating={handleCaseApproved}
          />
        )}
      </SheetWrapper>
    </>
  );
};
