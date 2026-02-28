'use client';

import { ValidationErrorPayload } from "@/lib/parse-validation-error";
import { SheetWrapper } from "../ui/custom-sheet";

interface IValidationErrorSheetProps {
  errorSheetOpen: boolean;
  setErrorSheetOpen: (open: boolean) => void;
  validationError: ValidationErrorPayload | null;
}

const ValidationErrorSheet: React.FC<IValidationErrorSheetProps> = ({
  errorSheetOpen,
  setErrorSheetOpen,
  validationError,
}) => {
  return (
    <SheetWrapper
      open={errorSheetOpen}
      setOpen={setErrorSheetOpen}
      title="Validation Error Log"
      description="The uploaded file failed validation checks"
      width="sm:max-w-[400px]"
    >
      {validationError && (
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              {validationError.message}
            </p>

            {validationError.summary?.total_errors !== undefined && (
              <p className="mt-1 text-xs text-red-600">
                Total errors: {validationError.summary.total_errors}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {validationError.errors.map((err, index) => (
              <div
                key={index}
                className="rounded-md border border-gray-200 p-3"
              >
                <p className="text-sm font-medium text-gray-900">
                  {index + 1}. {err.message}
                </p>

                {err.column && (
                  <p className="mt-1 text-xs text-gray-500">
                    Column: {err.column}
                  </p>
                )}

                {err.severity && (
                  <p className="mt-1 text-xs text-gray-400">
                    Severity: {err.severity}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </SheetWrapper>
  );
};

export default ValidationErrorSheet;
