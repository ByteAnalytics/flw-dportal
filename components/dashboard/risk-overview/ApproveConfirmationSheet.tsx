import { Button } from "@/components/ui/button";
import { CustomImage } from "@/components/ui/custom-image";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import SuccessIcon from "@/public/assets/icon/success-icon.svg";
import { CaseDetails } from "@/stores/risk-overview-store";
import { CalculateResponse } from "@/types/risk-overview";

interface ApproveConfirmationSheetProps {
  isApproveSheetOpen: boolean;
  setIsApproveSheetOpen: (open: boolean) => void;
  details: CaseDetails | undefined;
  calculateResponse: CalculateResponse | null;
  approvalComment: string;
  setApprovalComment: (comment: string) => void;
  confirmApproveRating: () => void;
  isApproving: boolean;
}

const ApproveConfirmationSheet: React.FC<ApproveConfirmationSheetProps> = ({
  isApproveSheetOpen,
  setIsApproveSheetOpen,
  details,
  calculateResponse,
  approvalComment,
  setApprovalComment,
  confirmApproveRating,
  isApproving,
}) => {
  return (
    <SheetWrapper
      open={isApproveSheetOpen}
      setOpen={setIsApproveSheetOpen}
      title="Approve Credit Risk Rating"
      width="sm:max-w-[540px]"
      headerClassName="bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] !text-white"
      titleClassName="text-white px-6 py-4"
      SheetContentClassName="p-0 bg-white"
    >
      <div className="flex flex-col gap-2 mb-4 items-center justify-center p-4">
        <CustomImage src={SuccessIcon} style="w-20 h-20 mb-4" />
        <p className="text-center">
          Are you sure you want to approve the credit risk rating for{" "}
          {details?.customer_name ?? "this case"}? This action will finalize the
          rating as {calculateResponse?.data?.baseline_score ?? "-"}.
        </p>
      </div>

      <div className="mb-3 px-4">
        <label className="block text-sm font-medium text-gray-700">
          Comment
        </label>
        <textarea
          value={approvalComment}
          onChange={(e) => setApprovalComment(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
          rows={4}
          placeholder="Add comment"
        />
      </div>

      <div className="flex justify-end gap-2 mt-auto px-4 mb-4">
        <Button
          variant="secondary"
          onClick={() => setIsApproveSheetOpen(false)}
        >
          Cancel
        </Button>
        <Button
          onClick={confirmApproveRating}
          disabled={isApproving}
          className="ms-auto h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white text-[14px] font-semibold rounded-[8px]"
        >
          {isApproving ? "Approving..." : "Confirm Approve"}
        </Button>
      </div>
    </SheetWrapper>
  );
};

export default ApproveConfirmationSheet;
