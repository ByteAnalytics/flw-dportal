"use client";

import React from "react";
import { MoreVertical, Save } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import CustomTable, { TableRowData } from "@/components/ui/custom-table";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import StatusBadge from "./StatusBadge";
import { formatDate, getModelLabel, getModelTypeFromTab } from "@/lib/utils";
import { useFileDownload } from "@/hooks/us-file-download";
import { ReportData, reportStatus, ReportTableProps } from "@/types/reporting";

/* eslint-disable @typescript-eslint/no-explicit-any */

const ModelCategoryBadge = ({ category }: { category: string }) => (
  <span className="inline-block px-3 py-1 rounded-md bg-[#F5F7F6] text-[#5B5F5E] text-xs font-medium">
    {getModelLabel(category) || category}
  </span>
);

const ReportTable = ({
  data,
  showModelCategory = true,
  currentTab = "all",
}: ReportTableProps) => {
  const router = useRouter();
  const { downloadFile, isDownloading } = useFileDownload();

  const handleViewDetails = (item: ReportData) => {
    const categorySlug =
      currentTab === "all"
        ? item.modelCategory.toLowerCase().replace(/\s+/g, "-")
        : currentTab;

    router.push(
      `/dashboard/reporting/${categorySlug}/${item.id}?name=${item.fileName}&time=${item.timeStamp}`,
    );
  };

  const handleDownload = async (item: ReportData) => {
    const modelType =
      currentTab === "all"
        ? getModelTypeFromTab(
            item.modelCategory.toLowerCase().replace(/\s+/g, "-"),
          )
        : getModelTypeFromTab(currentTab);

    let fileUrl: string;

    if (modelType !== "pd") {
      fileUrl = `/models/${item.id}/output?model_type=${modelType?.toUpperCase()}`;
    } else {
      fileUrl = `/models/${item.id}/output`;
    }

    const filename = `${item.fileName}_${formatDate(item.timeStamp)}`;

    try {
      await downloadFile(fileUrl, filename);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const isItemClickable = (item: ReportData): boolean => {
    if (item.status !== "Completed") return false;
    return true;
  };

  const isViewDetailsDisabled = (item: ReportData): boolean => {
    if (item.status !== "Completed") return true;
    return false;
  };

  const createClickableCell = (
    content: React.ReactNode,
    item: ReportData,
    isCheckbox = false,
    isActions = false,
  ) => {
    const isClickable = isItemClickable(item) && !isViewDetailsDisabled(item);

    if (isCheckbox || isActions || !isClickable) {
      return content;
    }

    return (
      <div
        className="w-full h-full cursor-pointer"
        onClick={() => handleViewDetails(item)}
      >
        {content}
      </div>
    );
  };

  const columns = [
    { key: "dataName", label: "File Name", width: "w-[200px]" },
    { key: "date", label: "Date", width: "w-[120px]" },
    { key: "timeStamp", label: "Time Stamp", width: "w-[100px]" },
    { key: "createdBy", label: "Created By", width: "w-[200px]" },
    ...(showModelCategory
      ? [{ key: "modelCategory", label: "Model Category", width: "w-[150px]" }]
      : []),
    { key: "status", label: "Status", width: "w-[150px]" },
    { key: "actions", label: "", width: "w-12" },
  ];

  const rows: TableRowData[] = data.map((item, index) => {
    const dropdownDisabled = item.status !== "Completed";
    const viewDetailsDisabled = isViewDetailsDisabled(item);

    const dropdownItems: DropdownItem[] = [
      {
        label: "View Details",
        onClick: () => handleViewDetails(item),
        disabled: viewDetailsDisabled,
      },
      ...(item?.modelCategory?.toLowerCase()?.includes("fli")
        ? []
        : [
            {
              label: isDownloading ? "Downloading..." : "Download",
              icon: <Save className="w-4 h-4" />,
              onClick: () => handleDownload(item),
              disabled:
                viewDetailsDisabled || dropdownDisabled || isDownloading,
            },
          ]),
    ];

    const baseRow: TableRowData = {
      dataName: createClickableCell(
        <span className="text-[#003A1B] font-medium">{item.fileName}</span>,
        item,
      ),
      date: createClickableCell(
        <span className="text-[#444846]">{item.date}</span>,
        item,
      ),
      timeStamp: createClickableCell(
        <span className="text-[#444846]">{item.timeStamp}</span>,
        item,
      ),
      createdBy: createClickableCell(
        <div className="flex flex-col">
          <span className="text-[#003A1B] font-medium">
            {item.createdBy.name}
          </span>
          <span className="text-xs text-[#5B5F5E]">{item.createdBy.email}</span>
        </div>,
        item,
      ),
      status: createClickableCell(
        <StatusBadge
          modelType={item.executedModelType}
          executionStatus={item.executionStatus as reportStatus}
          reportId={item.id}
        />,
        item,
      ),
      actions: createClickableCell(
        <CustomDropdown
          disabled={dropdownDisabled || isDownloading}
          trigger={
            <button
              data-dropdown-trigger
              className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
          }
          items={dropdownItems}
        />,
        item,
        false,
        true, // isActions
      ),
    };

    if (showModelCategory) {
      baseRow.modelCategory = createClickableCell(
        <ModelCategoryBadge category={item.modelCategory} />,
        item,
      );
    }

    return baseRow;
  });

  return (
    <div className="space-y-4">

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <CustomTable
          columns={columns}
          rows={rows}
          tableHeaderClassName="bg-[#F3F3F3]"
          isActionOnRow={true}
        />
      </div>
    </div>
  );
};

export default ReportTable;
