"use client";

import React, { useState } from "react";
import { MoreVertical, Save, Trash2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import CustomTable, { TableRowData } from "@/components/ui/custom-table";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import CustomButton from "@/components/ui/custom-button";
import StatusBadge from "./StatusBadge";
import { formatDate, getModelLabel, getModelTypeFromTab } from "@/lib/utils";
import { useFileDownload } from "@/hooks/us-file-download";
import { useDelete } from "@/hooks/use-queries";
import { ReportData, ReportTableProps } from "@/types/reporting";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface DeleteModelsPayload {
  model_execution_ids: string[];
}

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
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();
  const { downloadFile, isDownloading } = useFileDownload();
  const deleteModels = useDelete<any, DeleteModelsPayload>(
    "/reporting/models",
    ["execution-models"],
  );

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      setSelectedRows(new Set(data.map((_, i) => i)));
      setSelectAll(true);
    }
  };

  const handleRowSelect = (index: number) => {
    const updated = new Set(selectedRows);
    if (updated.has(index)) updated.delete(index);
    else updated.add(index);
    setSelectedRows(updated);
    setSelectAll(updated.size === data.length);
  };

  const getSelectedModelIds = (): string[] => {
    return Array.from(selectedRows)
      .map((index) => data[index]?.id)
      .filter(Boolean) as string[];
  };

  const handleDeleteSelected = async () => {
    const selectedIds = getSelectedModelIds();

    if (selectedIds.length === 0) {
      toast.error("Please select at least one model to delete");
      return;
    }

    try {
      await deleteModels.mutateAsync({
        model_execution_ids: selectedIds,
      });

      toast.success(`Successfully deleted ${selectedIds.length} model(s)`);

      setSelectedRows(new Set());
      setSelectAll(false);
    } catch (error: any) {
      toast.error("Failed to delete models. Please try again.");
      console.error("Delete error:", error);
    }
  };

  const handleViewDetails = (item: ReportData) => {
    let categorySlug =
      currentTab === "all"
        ? item.modelCategory.toLowerCase().replace(/\s+/g, "-")
        : currentTab;

    const isJointModel = categorySlug.includes("joint");

    if (isJointModel) {
      categorySlug = "ecl-model";
    }

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
    index: number,
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
    {
      key: "checkbox",
      label: (
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
          className="w-4 h-4 rounded border-gray-300 text-[#006F37] focus:ring-[#006F37] cursor-pointer"
        />
      ),
      width: "w-12",
    },
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
      checkbox: createClickableCell(
        <input
          type="checkbox"
          checked={selectedRows.has(index)}
          onChange={() => handleRowSelect(index)}
          className="w-4 h-4 rounded border-gray-300 text-[#006F37] focus:ring-[#006F37] cursor-pointer"
        />,
        item,
        index,
        true,
      ),
      dataName: createClickableCell(
        <span className="text-[#003A1B] font-medium">{item.fileName}</span>,
        item,
        index,
      ),
      date: createClickableCell(
        <span className="text-[#444846]">{item.date}</span>,
        item,
        index,
      ),
      timeStamp: createClickableCell(
        <span className="text-[#444846]">{item.timeStamp}</span>,
        item,
        index,
      ),
      createdBy: createClickableCell(
        <div className="flex flex-col">
          <span className="text-[#003A1B] font-medium">
            {item.createdBy.name}
          </span>
          <span className="text-xs text-[#5B5F5E]">{item.createdBy.email}</span>
        </div>,
        item,
        index,
      ),
      status: createClickableCell(
        <StatusBadge
          status={item.status}
          executionStatus={item.executionStatus}
        />,
        item,
        index,
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
        index,
        false,
        true, // isActions
      ),
    };

    if (showModelCategory) {
      baseRow.modelCategory = createClickableCell(
        <ModelCategoryBadge category={item.modelCategory} />,
        item,
        index,
      );
    }

    return baseRow;
  });

  const hasSelectedRows = selectedRows.size > 0;

  return (
    <div className="space-y-4">
      {/* Delete Button - Only shown when rows are selected */}
      {hasSelectedRows && (
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-blue-800">
            <span className="font-medium">{selectedRows.size}</span> model(s)
            selected
          </div>
          <CustomButton
            title={deleteModels.isPending ? "Deleting..." : "Delete Selected"}
            onClick={handleDeleteSelected}
            variant="outline"
            disabled={deleteModels.isPending}
            isLoading={deleteModels.isPending}
            icon={<Trash2 className="w-4 h-4" />}
            className="text-white !h-[43px] hover:bg-red-50 hover:text-red-700"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <CustomTable
          columns={columns}
          rows={rows}
          tableHeaderClassName="bg-white"
        />
      </div>
    </div>
  );
};

export default ReportTable;
