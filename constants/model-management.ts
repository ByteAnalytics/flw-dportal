import { ExecutableModels } from "@/types/model-execution";

export const models = [
  {
    type: ExecutableModels.PD,
    id: ExecutableModels.PD,
    title: "Probability of Default(PD)",
    description:
      "The percentage of loss likely to occur if a borrower defaults.",
  },
  {
    type: ExecutableModels.FLI,
    id: ExecutableModels.FLI,
    title: "FLI Scalar",
    description: "The FLI scalar measurement for PD calculation",
  },
];

export const CCR_BASE = "/dashboard/ccr";
