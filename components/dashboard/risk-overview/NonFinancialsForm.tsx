// components/shared/NonFinancialsForm.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/ui/custom-button";
import {
  DynamicSection,
  useNonFinancialsForm,
} from "@/hooks/use-non-financials-form";
import { PFNonFinancialsData } from "./PFNonFinancialsTab";

interface NonFinancialsFormProps {
  progressType: "pf_non_financials" | "cf_non_financials";
  sections: DynamicSection[];
  initialValues?: PFNonFinancialsData;
  isLoadingQuestions: boolean;
  onNext: (data: PFNonFinancialsData) => void;
  onSaveAsDraft: (data: PFNonFinancialsData) => void;
  onPrevious?: () => void;
}

export default function NonFinancialsForm({
  progressType,
  sections,
  initialValues,
  isLoadingQuestions,
  onNext,
  onSaveAsDraft,
  onPrevious,
}: NonFinancialsFormProps) {
  const {
    values,
    errors,
    submitAttempted,
    isUpdating,
    isSavingDraft,
    unansweredCount,
    handleChange,
    handleNext,
    handleSaveAsDraft,
  } = useNonFinancialsForm({
    progressType,
    sections,
    onNext,
    onSaveAsDraft,
    initialValues,
  });

  if (isLoadingQuestions) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
        Loading questions…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="text-[14px] font-bold text-InfraSoftBlack tracking-wide mb-4">
            {section.title}
          </h3>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-5">
            {section.fields.map((field) => {
              const hasError = submitAttempted && errors[field.key];
              return (
                <div
                  key={field.key}
                  className="flex flex-col gap-1.5"
                  data-field-error={hasError ? "true" : "false"}
                >
                  <label
                    className={`text-[14px] font-[500] ${hasError ? "text-red-500" : "text-InfraSoftBlack"}`}
                  >
                    {field.label}
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>

                  <Select
                    value={values[field.key] ?? ""}
                    onValueChange={(val) => handleChange(field.key, val)}
                  >
                    <SelectTrigger
                      className={`h-[45px] italic rounded-[10px] w-full border bg-InfraBorder text-[#A3A3A3] text-[12px] ${
                        hasError
                          ? "border-red-400 ring-1 ring-red-400"
                          : "border-[#e5e5e5]"
                      }`}
                    >
                      <SelectValue placeholder="select answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {hasError && (
                    <p className="text-red-500 text-[11px] mt-0.5">
                      This field is required
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {submitAttempted && unansweredCount > 0 && (
        <p className="text-red-500 text-[12px] font-medium">
          {unansweredCount} field{unansweredCount > 1 ? "s are" : " is"}{" "}
          required before you can proceed.
        </p>
      )}

      <div className="pt-6 flex flex-wrap items-center gap-3 justify-between mt-auto">
        {onPrevious && (
          <CustomButton
            type="button"
            title="Previous"
            onClick={onPrevious}
            disabled={isSavingDraft || isUpdating}
            className="w-[117px] h-[40px] flex items-center gap-2 border bg-white hover:bg-gray-600 hover:text-white text-gray-600 text-[16px] font-semibold"
          />
        )}

        <div className="ms-auto py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleSaveAsDraft}
            disabled={isSavingDraft}
            className="text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 bg-white cursor-pointer rounded-[8px] h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingDraft ? "Saving..." : "Save as draft"}
          </button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={isUpdating}
            className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:opacity-90 text-white text-[14px] font-semibold rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Saving..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
