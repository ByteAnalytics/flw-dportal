import { useState, useCallback } from "react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { useDynamicDelete } from "@/hooks/use-queries";
import { useRiskOverviewStore } from "@/stores/risk-overview-store";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@/types";
import { CaseItem } from "@/types/risk-overview";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { buildTableRows } from "@/lib/build-table-rows";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface UseCaseTableProps {
  casesData: { data?: CaseItem[]; pages?: number } | undefined;
  onDeleteSuccess?: () => void;
}

export function useCaseTable({
  casesData,
  onDeleteSuccess,
}: UseCaseTableProps) {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const { user } = useAuthStore((s) => s);
  const isValidValidator = user?.role === UserRole?.["SUPER USER"];

  const {
    isSheetOpen,
    activeDetailsSheet,
    selectedCaseId,
    setIsSheetOpen,
    setActiveDetailsSheet,
    setSelectedCaseId,
  } = useRiskOverviewStore();

  const deleteCase = useDynamicDelete<any>();

  const clearSelection = () => {
    setSelectedRows(new Set());
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      clearSelection();
    } else {
      const allIds = casesData?.data?.map((c) => c.id) ?? [];
      setSelectedRows(new Set(allIds));
      setSelectAll(true);
    }
  };

  const handleRowSelect = (caseId: string) => {
    const updated = new Set(selectedRows);
    if (updated.has(caseId)) updated.delete(caseId);
    else updated.add(caseId);
    setSelectedRows(updated);
    setSelectAll(updated.size === (casesData?.data?.length ?? 0));
  };

  const handleDeleteSelected = async () => {
    const selectedIds = Array.from(selectedRows);
    if (selectedIds.length === 0) {
      toast.error("Please select at least one case to delete");
      return;
    }

    try {
      const isAll =
        selectAll && selectedIds.length === (casesData?.data?.length ?? 0);
      const queryParams = selectedIds.map((id) => `id=${id}`).join("&");
      const url = isAll ? "/crr/cases" : `/crr/cases?${queryParams}`;

      const success = await deleteCase.mutateAsync(url);
      toast.success(
        extractSuccessMessage(
          success,
          isAll
            ? "Successfully deleted all cases"
            : `Successfully deleted ${selectedIds.length} case(s)`,
        ),
      );

      clearSelection();
      onDeleteSuccess?.();
    } catch (error: any) {
      toast.error(
        extractErrorMessage(error, "Failed to delete cases. Please try again."),
      );
    }
  };

  const goToPageIfDraft = useCallback(
    (caseId: string, facilityType: string) => {
      setSelectedCaseId(caseId);
      setIsSheetOpen(true);
      router.push(
        `/dashboard/ccr/overview?step=model_info&caseId=${caseId}&facilityType=${encodeURIComponent(facilityType)}`,
      );
    },
    [setSelectedCaseId, setIsSheetOpen, router],
  );

  const tableRows = buildTableRows(casesData?.data, {
    setSelectedCaseId,
    setActiveDetailsSheet,
    goToPageIfDraft,
    selectedRows,
    handleRowSelect,
    isValidValidator,
  });

  return {
    // store
    isSheetOpen,
    setIsSheetOpen,
    activeDetailsSheet,
    setActiveDetailsSheet,
    selectedCaseId,
    // selection
    selectedRows,
    selectAll,
    hasSelectedRows: selectedRows.size > 0,
    clearSelection,
    handleSelectAll,
    handleRowSelect,
    // delete
    handleDeleteSelected,
    isDeleting: deleteCase.isPending,
    // table
    tableRows,
    isValidValidator,
  };
}
