"use client";

import React from "react";
import CustomTable, { TableRowData } from "@/components/ui/custom-table";
import { getStatusColor } from "@/constants/risk-overview-constants";

interface Showstopper {
  id: number;
  criteria: string;
  status: string;
}

interface ShowstoppersTableProps {
  showstoppers: Showstopper[];
}

const ShowstoppersTable: React.FC<ShowstoppersTableProps> = ({
  showstoppers,
}) => {
  if (!showstoppers.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No showstoppers identified
      </div>
    );
  }

  const columns = [
    { key: "sn", label: "S/N", width: "w-[80px]" },
    { key: "criteria", label: "Criteria", width: "w-[300px]" },
    { key: "status", label: "Status" },
  ];

  const rows: TableRowData[] = showstoppers.map((item) => ({
    sn: <span className="text-gray-500">{item.id}</span>,
    criteria: (
      <span className="text-gray-800 font-medium">{item.criteria}</span>
    ),
    status: (
      <span className={`text-sm ${getStatusColor(item.status)}`}>
        {item.status}
      </span>
    ),
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <CustomTable
        columns={columns}
        rows={rows}
        tableHeaderClassName="bg-[#F3F3F3]"
        isActionOnRow={false}
      />
    </div>
  );
};

export default ShowstoppersTable;
