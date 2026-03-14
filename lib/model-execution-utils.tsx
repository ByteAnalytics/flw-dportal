import { ThreeFileSet } from "@/types/model-execution";
import { format } from "date-fns";

export const buildModelPayload = (data: ThreeFileSet): FormData => {
  const fd = new FormData();
  fd.append("exposure_date", format(data.exposure_date, "yyyy-MM-dd"));
  if (data.amortization_file)
    fd.append("amortization_file", data.amortization_file);
  if (data.asset_information_file)
    fd.append("asset_information_file", data.asset_information_file);
  if (data.collateral_file) fd.append("collateral_file", data.collateral_file);
  return fd;
};

export const extractModelType = (value: string): string => {
  return value.replace(/^guarantees_/, "");
};