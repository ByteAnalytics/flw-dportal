"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const AccordionSection = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-[10px] overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white text-[14px] font-semibold text-gray-800"
      >
        {title}
        {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
      {open && children && (
        <div className="border-t border-gray-100">{children}</div>
      )}
    </div>
  );
};

export default AccordionSection;
