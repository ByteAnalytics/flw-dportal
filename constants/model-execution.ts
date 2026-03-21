import { ExecutableModels } from "@/types/model-execution";

export const models = [
  // {
  //   id: ExecutableModels.CCF,
  //   title: "Credit Conversion Factor",
  //   description:
  //     "The percentage of an unused credit loan that is likely to be drawn down if the borrower defaults",
  // },
  {
    id: ExecutableModels.EAD,
    title: "Exposure at Default",
    description:
      "The total amount the bank is exposed to if a borrower defaults on their credit obligations.",
  },
  {
    id: ExecutableModels.LGD,
    title: "Loss Given Default (LGD)",
    description:
      "The percentage of loss likely to occur if a borrower defaults.",
  },
  {
    id: ExecutableModels.ECL,
    title: "Expected Credit Loss (ECL)",
    description:
      "The estimated amount of loss the bank expects to incur if the borrower fails on their credit obligation.",
  },
];
