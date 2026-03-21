import React from "react";

export default function CFNonFinancialsTab({ values, onChange }: any) {
  const sections = [
    {
      title: "MANAGEMENT",
      fields: [
        { key: "experienceOfManagement", label: "Experience of Management" },
        { key: "integrityCredentials", label: "Integrity Credentials" },
      ],
    },
    {
      title: "BUSINESS",
      fields: [
        { key: "marketShare", label: "Market Share" },
        { key: "financialFlexibility", label: "Financial Flexibility" },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {sections.map((s) => (
        <div key={s.title}>
          <h3 className="text-[11px] font-bold text-gray-500 mb-3">
            {s.title}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {s.fields.map((f) => (
              <select
                key={f.key}
                value={values[f.key] ?? ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                className="h-[38px] border rounded px-3"
              >
                <option value="">select</option>
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
