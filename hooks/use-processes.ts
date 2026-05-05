import { useGet, usePost, usePut, useDynamicDelete } from "@/hooks/use-queries";
import { buildQueryString } from "@/lib/utils";
import { ProcessFormData } from "@/schema/process";
import { ApiResponse } from "@/types";
import { ProcessesResponse, SingleProcessResponse } from "@/types/processes";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useTeams } from "@/hooks/use-teams";
import {
  Process,
  ProcessStatus,
  DataSourceType,
  PanelStep,
  ExecPhase,
  ProcessCategory,
} from "@/types/processes";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
export const useProcessManagement = (
  options: { withRunFlow?: boolean } = {},
) => {
  const { withRunFlow = false } = options;

  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = withRunFlow ? searchParams.get("id") : null;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [effortFilter, setEffortFilter] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // run flow state — only active when withRunFlow=true
  const [step, setStep] = useState<PanelStep>("datasource");
  const [dataSource, setDataSource] = useState<DataSourceType>(null);
  const [execPhase, setExecPhase] = useState<ExecPhase>("idle");
  const [selectedStatus, setSelectedStatus] = useState<ProcessStatus>("all");
  const [selectedCategory, setSelectedCategory] =
    useState<ProcessCategory>("all");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, refetch } = useProcesses({
    process_name: debouncedSearch,
    team_id: teamFilter,
    effort: effortFilter,
    frequency: frequencyFilter,
    status:
      withRunFlow && selectedStatus !== "all" ? selectedStatus : undefined,
  });

  const { data: teamsData } = useTeams();

  const processes = useMemo(() => data?.data ?? [], [data?.data]);

  const teamFilterOptions = useMemo(
    () => [
      { label: "All Teams", value: "" },
      ...(teamsData?.data.map((t) => ({ label: t.name, value: t.id })) ?? []),
    ],
    [teamsData],
  );

  const hasActiveFilters = withRunFlow
    ? !!search || selectedCategory !== "all" || selectedStatus !== "all"
    : !!search || !!teamFilter || !!effortFilter || !!frequencyFilter;

  const resetFilters = () => {
    setSearch("");
    setTeamFilter("");
    setEffortFilter("");
    setFrequencyFilter("");
    setSelectedStatus("all");
    setSelectedCategory("all");
  };

  // process management handlers
  const handleAddProcess = () => {
    setSelectedProcess(null);
    setIsSheetOpen(true);
  };

  const handleEditProcess = (process: Process) => {
    setSelectedProcess(process);
    setIsSheetOpen(true);
  };

  // run flow handlers
  const openRunSheet = (process: Process) => {
    setSelectedProcess(process);
    setStep("datasource");
    setDataSource(null);
    setExecPhase("idle");
    setIsSheetOpen(true);
  };

  const handleRun = (id?: string) => {
    const found = processes.find((p) => p.id === id);
    if (!found) return;
    openRunSheet(found);
    router.push(`/dashboard/run-process?id=${id}`, { scroll: false });
  };

  const handleSheetClose = useCallback(
    (open: boolean) => {
      setIsSheetOpen(open);
      if (!open && withRunFlow)
        router.push("/dashboard/run-process", { scroll: false });
    },
    [router, withRunFlow],
  );

  const startExecute = useCallback(() => {
    setStep("execute");
    setExecPhase("running");
    setTimeout(() => setExecPhase("done"), 3200);
  }, []);

  const handleRunAnother = () => {
    setStep("datasource");
    setDataSource(null);
    setExecPhase("idle");
    setIsSheetOpen(false);
    router.push("/dashboard/run-process", { scroll: false });
  };

  const handleDashboard = () => {
    setIsSheetOpen(false);
    router.push("/dashboard");
  };

  useEffect(() => {
    if (!withRunFlow || !idParam || processes.length === 0) return;
    const found = processes.find((p) => p.id === idParam);
    if (found) setTimeout(() => openRunSheet(found), 0);
  }, [idParam, processes, withRunFlow, openRunSheet]);

  return {
    // shared state
    isSheetOpen,
    setIsSheetOpen,
    selectedProcess,
    setSelectedProcess,
    selectedProcessId,
    setSelectedProcessId,
    search,
    setSearch,
    teamFilter,
    setTeamFilter,
    effortFilter,
    setEffortFilter,
    frequencyFilter,
    setFrequencyFilter,
    viewMode,
    setViewMode,
    // data
    data,
    processes,
    isLoading,
    refetch,
    teamFilterOptions,
    // derived
    hasActiveFilters,
    // shared handlers
    resetFilters,
    handleAddProcess,
    handleEditProcess,
    // run flow state
    step,
    setStep,
    dataSource,
    setDataSource,
    execPhase,
    selectedStatus,
    setSelectedStatus,
    selectedCategory,
    setSelectedCategory,
    // run flow handlers
    handleRun,
    handleSheetClose,
    startExecute,
    handleRunAnother,
    handleDashboard,
  };
};

export const useProcesses = (filters?: {
  team_id?: string;
  effort?: string;
  frequency?: string;
  process_name?: string;
  status?: string;
}) => {
  const queryString = buildQueryString(filters);
  return useGet<ProcessesResponse>(
    ["processes", JSON.stringify(filters ?? {})],
    `/processes/${queryString}`,
  );
};

export const useProcessById = (id: string) =>
  useGet<SingleProcessResponse>(["processes", id], `/processes/${id}/`);

export const useCreateProcess = () =>
  usePost<ApiResponse<null>, ProcessFormData>("/processes/", ["processes"]);

export const useUpdateProcess = (id: string) =>
  usePut<ApiResponse<null>, ProcessFormData>(`/processes/${id}`, [
    "processes",
    id,
  ]);

export const useAssignProcessToTeam = (processId: string) =>
  usePut<ApiResponse<null>, { team_id: string }>(`/processes/${processId}/`, [
    "processes",
    processId,
  ]);

export const useDeleteProcess = () => useDynamicDelete<ApiResponse<null>>();
