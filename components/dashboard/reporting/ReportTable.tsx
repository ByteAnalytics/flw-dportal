"use client";

import React, { useState } from "react";
import { MoreVertical, Save, Trash2, FileWarning } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import CustomTable, { TableRowData } from "@/components/ui/custom-table";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import CustomButton from "@/components/ui/custom-button";
import StatusBadge from "./StatusBadge";
import {
  extractErrorMessage,
  extractSuccessMessage,
  formatDate,
  getModelLabel,
  getModelTypeFromTab,
} from "@/lib/utils";
import { useFileDownload } from "@/hooks/us-file-download";
import { useDynamicDelete } from "@/hooks/use-queries";
import { ReportData, reportStatus, ReportTableProps } from "@/types/reporting";
import { extractModelType } from "@/lib/model-execution-utils";

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
  onDeleteSuccess,
}: ReportTableProps & { onDeleteSuccess?: () => void }) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();
  const { downloadFile, isDownloading } = useFileDownload();
  const deleteModel = useDynamicDelete<any>();

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
      let url = "/guarantees/runs";

      // If not deleting all, add id query parameters
      if (!(selectAll && selectedIds.length === data.length)) {
        const queryParams = selectedIds.map((id) => `id=${id}`).join("&");
        url = `/guarantees/runs${queryParams ? `?${queryParams}` : ""}`;
      }

      const success = await deleteModel.mutateAsync(url);

      toast.success(
        extractSuccessMessage(
          success,
          selectAll && selectedIds.length === data.length
            ? "Successfully deleted all models"
            : `Successfully deleted ${selectedIds.length} model(s)`,
        ),
      );

      setSelectedRows(new Set());
      setSelectAll(false);

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error: any) {
      toast.error(
        extractErrorMessage(
          error,
          "Failed to delete models. Please try again.",
        ),
      );
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
    const fileUrl = `/crr/${item.id}/output`;

    const filename = `${item.fileName}_${formatDate(item.timeStamp)}`;

    try {
      await downloadFile(fileUrl, filename);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleViewErrorLog = (item: ReportData) => {
    if (item.errorUser) {
      toast.error("Execution Error", {
        description: item.errorUser,
        duration: 6000,
        position: "top-right",
      });
    } else {
      toast.error("No Error Log Available", {
        description: "No error details were found for this execution.",
        duration: 4000,
        position: "top-right",
      });
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

  const isDropdownDisabled = (item: ReportData): boolean => {
    if (item.status === "Failed") return false;
    if (item.status === "Completed") return false;
    return true;
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
    const isFailed = item.status === "Failed";
    const isCompleted = item.status === "Completed";
    const viewDetailsDisabled = isViewDetailsDisabled(item);
    const dropdownDisabled = isDropdownDisabled(item);

    const dropdownItems: DropdownItem[] = [
      {
        label: "View Details",
        onClick: () => handleViewDetails(item),
        disabled: viewDetailsDisabled,
      },
      ...(isFailed
        ? [
            {
              label: "Display Error Log",
              icon: <FileWarning className="w-4 h-4" />,
              onClick: () => handleViewErrorLog(item),
              disabled: false,
            },
          ]
        : []),
      ...(item?.modelCategory?.toLowerCase()?.includes("fli") || isFailed
        ? []
        : [
            {
              label: isDownloading ? "Downloading..." : "Download",
              icon: <Save className="w-4 h-4" />,
              onClick: () => handleDownload(item),
              disabled: viewDetailsDisabled || !isCompleted || isDownloading,
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
          modelType={item.executedModelType}
          executionStatus={item.executionStatus as reportStatus}
          reportId={item.id}
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
        true,
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
      {hasSelectedRows && (
        <div className="flex justify-between items-center bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-red-800">
            <span className="font-medium">{selectedRows.size}</span> model(s)
            selected
          </div>
          <CustomButton
            title={deleteModel.isPending ? "Deleting..." : "Delete Selected"}
            onClick={handleDeleteSelected}
            variant="outline"
            disabled={deleteModel.isPending}
            isLoading={deleteModel.isPending}
            icon={<Trash2 className="w-4 h-4" />}
            className="!h-[43px] bg-red-600 hover:bg-red-700 text-white border-none"
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <CustomTable
          columns={columns}
          hasCheckbox
          isActionOnRow
          rows={rows}
          tableHeaderClassName="bg-white"
        />
      </div>
    </div>
  );
};

export default ReportTable;
