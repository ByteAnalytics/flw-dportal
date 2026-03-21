"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomButton from "@/components/ui/custom-button";
import { useState } from "react";
import { PF_NON_FINANCIALS_SECTIONS } from "@/constants/risk-cases";
import { Button } from "@/components/ui/button";

export type PFNonFinancialsData = Record<string, string>;

interface PFNonFinancialsTabProps {
  onClose: () => void;
  onNext: (data: PFNonFinancialsData) => void;
  onSaveAsDraft: (data: PFNonFinancialsData) => void;
}

export default function PFNonFinancialsTab({
  onClose,
  onNext,
  onSaveAsDraft,
}: PFNonFinancialsTabProps) {
  const [values, setValues] = useState<PFNonFinancialsData>({});

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-8 pb-6">
      {PF_NON_FINANCIALS_SECTIONS.map((section) => (
        <div key={section.title}>
          <h3 className="text-[14px] font-bold text-InfraSoftBlack tracking-wide mb-4">
            {section.title}
          </h3>

          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {section.fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label className="text-[14px] font-[500] text-InfraSoftBlack">
                  {field.label}
                </label>
                <Select
                  value={values[field.key] ?? ""}
                  onValueChange={(val) => handleChange(field.key, val)}
                >
                  <SelectTrigger className="h-[45px] bg-[#F3F3F3] italic rounded-[10px] w-full border border-[#e5e5e5] bg-InfraBorder text-[#A3A3A3] text-[12px]">
                    <SelectValue placeholder="select answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((v) => (
                      <SelectItem key={v} value={String(v)}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => onSaveAsDraft(values)}
          className="text-[13px] font-semibold text-gray-600 hover:text-gray-800 px-3 py-2 bg-white cursor-pointer rounded-[8px] h-[40px]"
        >
          Save as draft
        </button>
        <Button
          type="button"
          onClick={() => onNext(values)}
          className="h-[40px] px-6 bg-gradient-to-r from-[#1E6FB8] to-[#49A85ACC] hover:opacity-90 text-white text-[14px] font-semibold rounded-[8px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
