import { SheetWrapper } from "@/components/ui/custom-sheet";
import ValidatorPicker from "./ValidatorPicker";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useGetValidators, Validator } from "@/hooks/use-risk-overview";

interface ValidatorsSheetProps {
  isValidatorSheetOpen: boolean;
  setIsValidatorSheetOpen: (open: boolean) => void;
  customerName: string;
  selectedValidator: Validator | null;
  setSelectedValidator: (validator: Validator | null) => void;
  confirmSubmitWithValidator: () => void;
  isSubmitting: boolean;
}

const ValidatorsSheet: React.FC<ValidatorsSheetProps> = ({
  isValidatorSheetOpen,
  setIsValidatorSheetOpen,
  customerName,
  selectedValidator,
  setSelectedValidator,
  confirmSubmitWithValidator,
  isSubmitting,
}) => {
  const { data: validatorsData, isLoading: isLoadingValidators } =
    useGetValidators();

  const validators = validatorsData?.data ?? [];

  return (
    <SheetWrapper
      open={isValidatorSheetOpen}
      setOpen={setIsValidatorSheetOpen}
      title="Request Validation"
      width="sm:max-w-[480px]"
      headerClassName="bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] !text-white"
      titleClassName="text-white px-6 py-4"
      SheetContentClassName="p-0 bg-white"
    >
      <div className="flex flex-col gap-5 p-6">
        {/* Intro copy */}
        <div className="flex flex-col gap-1">
          <p className="text-[14px] font-semibold text-gray-800">
            Assign a validator for this case
          </p>
          <p className="text-[13px] text-gray-500">
            Select a team member to review and validate the credit risk rating
            for{" "}
            <span className="font-semibold text-gray-700">{customerName}</span>.
            They will be notified once submitted.
          </p>
        </div>
        {/* Picker */}
        <ValidatorPicker
          validators={validators}
          isLoading={isLoadingValidators}
          selected={selectedValidator}
          onSelect={setSelectedValidator}
        />

        {/* Selected validator confirmation card */}
        {selectedValidator && (
          <div className="flex items-center gap-3 rounded-[8px] border border-teal-200 bg-teal-50 px-4 py-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-[12px] font-bold text-white shrink-0">
              {selectedValidator.first_name[0]}
              {selectedValidator.last_name[0]}
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-teal-800">
                {selectedValidator.first_name} {selectedValidator.last_name}
              </span>
              <span className="text-[12px] text-teal-600 truncate">
                {selectedValidator.email}
              </span>
            </div>
            <Button
              type="button"
              onClick={() => setSelectedValidator(null)}
              className="ml-auto text-teal-400 hover:text-teal-700 transition-colors"
              aria-label="Remove selected validator"
            >
              <X size={15} />
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between gap-2 px-6 pb-6 mt-auto w-full">
        <Button
          variant="secondary"
          onClick={() => {
            setIsValidatorSheetOpen(false);
            setSelectedValidator(null);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={confirmSubmitWithValidator}
          disabled={!selectedValidator || isSubmitting}
          className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] text-white text-[14px] font-semibold rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting…" : "Submit for Validation"}
        </Button>
      </div>
    </SheetWrapper>
  );
};

export default ValidatorsSheet;
