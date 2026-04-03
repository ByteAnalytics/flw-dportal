"use client";

import { cleanCfLabel } from "@/lib/risk-overview-utils";
import CFInputRow from "./CFInputRow";
import { CF_OTHER_INPUT_ROWS } from "@/constants/risk-overview";

interface CFOtherInputTabProps {
  currentValues: Record<string, string>;
  onCurrentChange: (key: string, value: string) => void;
}

export default function CFOtherInputTab({
  currentValues,
  onCurrentChange,
}: CFOtherInputTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-md">
        <h3 className="text-[14px] text-InfraSoftBlack font-bold mb-3">
          OTHER INPUTS
        </h3>
        {CF_OTHER_INPUT_ROWS.map((r) => (
          <CFInputRow
            key={r.key}
            label={cleanCfLabel(r?.label ?? "")}
            value={currentValues[r.key] ?? ""}
            onChange={(v) => onCurrentChange(r.key, v)}
          />
        ))}
      </div>
    </div>
  );
}
