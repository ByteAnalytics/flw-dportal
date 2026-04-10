import { SheetWrapper } from "@/components/ui/custom-sheet";
import CaseDetailsSheet from "./CaseDetailsSheet";
import { ReturnedCaseSheet } from "./ReturnedCaseSheet";
import ValidationReviewSheet from "./ValidationReviewSheet";
import { ActiveDetailsSheet, CaseItem } from "@/types/risk-overview";
import { useRouter } from "nextjs-toploader/app";

interface CaseSheetsProps {
  activeDetailsSheet: ActiveDetailsSheet;
  selectedCaseId: string | null;
  setActiveDetailsSheet: (sheet: ActiveDetailsSheet) => void;
  setIsSheetOpen: (open: boolean) => void;
  selectedCaseDetails: CaseItem;
}

export const CaseSheets = ({
  activeDetailsSheet,
  selectedCaseId,
  selectedCaseDetails,
  setActiveDetailsSheet,
  setIsSheetOpen,
}: CaseSheetsProps) => {
  const router = useRouter();

  const close = () => setActiveDetailsSheet(null);

  const handleCaseApproved = () => {
   
    close();
  };

  const handleEdit = () => {
    close();
    router.push(
      `/dashboard/ccr/overview?step=model_info&caseId=${selectedCaseId}&facilityType=${encodeURIComponent(selectedCaseDetails?.facility_type || "")}`,
    );
    setIsSheetOpen(true);
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
            onEditAndResubmit={handleEdit}
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
            }}
            onApproveRating={handleCaseApproved}
          />
        )}
      </SheetWrapper>
    </>
  );
};
