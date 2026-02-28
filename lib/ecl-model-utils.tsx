import { formatNumber, formatPercentage } from "./utils";
import { CustomerSvg, EadSvg, EclSvg, LGDSvg, NPLSvg } from "@/svg";


export const createStatsData = (
  totalECL: number,
  stage1ECL: number,
  stage2ECL: number,
  stage3ECL: number,
  npl:number
) => [
  {
    title: "Total ECL",
    value: formatNumber(totalECL ?? 0),
    icon:<CustomerSvg/>
  },
  {
    title: "Stage 1",
    value: formatNumber(stage1ECL ?? 0),
    icon: <EadSvg/>
  },
  {
    title: "Stage 2",
    value: formatNumber(stage2ECL ?? 0),
    icon: <EclSvg/>
  },
  {
    title: "Stage 3",
    value: formatNumber(stage3ECL ?? 0),
    icon: <LGDSvg/>
  },
  {
    title: "NPL",
    value: formatNumber(npl ?? 0),
    icon: <NPLSvg/>
  },
];
