"use client";

import { Validator } from "@/hooks/use-risk-overview";
import { ChevronDown, Search, UserCheck, X } from "lucide-react";
import { useMemo, useState } from "react";

interface ValidatorPickerProps {
  validators: Validator[];
  isLoading: boolean;
  selected: Validator | null;
  onSelect: (v: Validator) => void;
}

const ValidatorPicker: React.FC<ValidatorPickerProps> = ({
  validators,
  isLoading,
  selected,
  onSelect,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      validators.filter((v) => {
        const full = `${v.first_name} ${v.last_name} ${v.email}`.toLowerCase();
        return full.includes(search.toLowerCase());
      }),
    [validators, search],
  );

  const handleSelect = (v: Validator) => {
    onSelect(v);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-gray-700 flex items-center gap-1.5">
        <UserCheck size={14} className="text-teal-600" />
        Assign Validator
        <span className="text-red-500">*</span>
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-[8px] border border-gray-300 bg-white px-3 py-2.5 text-[13px] text-left hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-colors"
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-[11px] font-bold text-teal-700 shrink-0">
              {selected.first_name[0]}
              {selected.last_name[0]}
            </span>
            <span className="font-medium text-gray-800">
              {selected.first_name} {selected.last_name}
            </span>
            <span className="text-gray-400 text-[12px]">{selected.email}</span>
          </span>
        ) : (
          <span className="text-gray-400">Select a validator…</span>
        )}
        <ChevronDown
          size={15}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="rounded-[10px] border border-gray-200 bg-white shadow-lg overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search size={13} className="text-gray-400 shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-[13px] outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[220px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-[13px] text-gray-400">
                Loading validators…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center py-6 text-[13px] text-gray-400">
                No validators found
              </div>
            ) : (
              filtered.map((v) => {
                const isSelected = selected?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleSelect(v)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                      isSelected ? "bg-teal-50" : ""
                    }`}
                  >
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold shrink-0 ${
                        isSelected
                          ? "bg-teal-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {v.first_name[0]}
                      {v.last_name[0]}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-gray-800 truncate">
                        {v.first_name} {v.last_name}
                      </span>
                      <span className="text-[11px] text-gray-400 truncate">
                        {v.email}
                      </span>
                    </div>
                    {isSelected && (
                      <UserCheck
                        size={14}
                        className="ml-auto shrink-0 text-teal-600"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default ValidatorPicker;