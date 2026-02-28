import { ModelTypeEnum } from "@/types/model-type-store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ModelTypeStore {
  selectedModel: ModelTypeEnum;
  setSelectedModel: (model: ModelTypeEnum) => void;
}

export const useModelTypeStore = create<ModelTypeStore>()(
  persist(
    (set) => ({
      selectedModel: ModelTypeEnum.ECLGuarantee,
      setSelectedModel: (model) => set({ selectedModel: model }),
    }),
    {
      name: "model-type-storage",
    },
  ),
);
