import { ExecutableModels } from "@/types/model-execution";

export const getFilterValue = (tabValue: string): string | null => {
  const filterMap: { [key: string]: string } = {
    "pd-model": ExecutableModels.PD,
    "lgd-model": ExecutableModels.LGD,
    "ead-model": ExecutableModels.EAD,
    "ccf-model": ExecutableModels.CCF,
    "fli-model": ExecutableModels.FLI,
    "ecl-model": ExecutableModels.ECL,
    "joint-model": ExecutableModels.ECL,
  };
  return filterMap[tabValue] || null;
};
