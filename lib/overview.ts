import { ProcessCategory, ProcessStatus } from "@/constants/overview";
import { Process } from "@/types";

export const filterProcesses = (
  processes: Process[],
  searchTerm: string,
  category: ProcessCategory,
  status: ProcessStatus,
): Process[] =>
  processes.filter((process) => {
    const matchesSearch =
      searchTerm === "" ||
      process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = category === "all" || process.category === category;
    const matchesStatus = status === "all" || process.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });
