"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import CustomTable from "@/components/ui/custom-table";
import ExportTrigger from "@/components/shared/ExportTrigger";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useGet } from "@/hooks/use-queries";
import { formatDate, formatNumber } from "@/lib/utils";
import { LGDApiItem } from "@/types/reporting";
import { StatCard } from "../../shared/StatCard";
import { CustomerSvg, EadSvg, EclSvg, LGDSvg, NPLSvg } from "@/svg";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ApiResponse } from "@/types";
import { LGD_COLUMNS } from "@/constants/lgd-model-config";
import { extractModelType } from "@/lib/model-execution-utils";

const ITEMS_PER_PAGE = 10;

const LGDModelOutput = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.slug as string;
  const timeStamp = searchParams.get("time");
  const dataName = searchParams.get("name");

  const [pageNumber, setPageNumber] = useState(1);

  const fileUrl = `/crr/${id}/output`;

  const { data, isLoading } = useGet<ApiResponse<LGDApiItem>>(
    ["lgd-model-output", id, pageNumber.toString()],
    `/guarantees/runs/${id}/result?page=${pageNumber}&page_size=${ITEMS_PER_PAGE}`,
  );

  const emailExportApiUrl = `/guarantees/email?model_name=${extractModelType(data?.data?.model_type ?? "")}&model_execution_id=${id}`;

  const lgdItem = data?.data;
  const lgdDf = lgdItem?.lgd_df;
  const lgdRows = lgdDf?.data ?? [];
  const lgdSummary = lgdItem?.lgd_summary ?? null;

  const tableRows = useMemo(() => {
    return lgdRows.map((item) => ({
      "Asset Description": (
        <span className="text-[#003A1B] font-medium">
          {item["Asset Description"]}
        </span>
      ),
      "Total Exposure": (
        <span className="font-medium">
          {formatNumber(item["Total Exposure"] ?? 0)}
        </span>
      ),
      "Adjusted Collateral": (
        <span className="font-medium">
          {formatNumber(item["Adjusted Collateral"] ?? 0)}
        </span>
      ),
      "Secured Recovery": (
        <span className="font-medium">
          {item["Secured Recovery"].toLocaleString()}
        </span>
      ),
      "Secured LGD": item["Secured LGD"]?.toFixed(4),
      "Unsecured LGD": item["Unsecured LGD"]?.toFixed(4),
      "Final LGD": item["Final LGD"]?.toFixed(4),
    }));
  }, [lgdRows]);

  return (
    <div className="space-y-6">
      <Link
        href="#"
        onClick={() => router.back()}
        className="me-auto rounded-md border flex items-center justify-center w-[28px] h-[28px] text-sm text-[#667085]"
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.4rem] text-[#111827] font-[700]">
            LGD Model Report - {dataName ?? id}
          </h1>
          <p className="font-[600] text-base text-[#5B5F5E] mt-1">
            View full LGD report
          </p>
        </div>
        <div className="ms-auto">
          <ExportTrigger
            exportApiUrl={fileUrl}
            emailExportApiUrl={emailExportApiUrl}
            exportFileName={`${dataName}_${formatDate(timeStamp)}_LGD_Model`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <StatCard
          title="Average Final LGD"
          icon={<CustomerSvg />}
          value={
            lgdSummary?.KPMG_Average_Final_LGD?.toFixed(4)?.toString() ?? ""
          }
        />
        <StatCard
          title="Average Recovery Rate"
          icon={<EadSvg />}
          value={
            lgdSummary?.Average_Final_Recovery_Rate?.toFixed(4)?.toString() ??
            ""
          }
        />
        <StatCard
          title="Weighted Final LGD"
          icon={<EclSvg />}
          value={
            lgdSummary?.KPMG_Weighted_Average_Final_LGD?.toFixed(
              4,
            )?.toString() ?? ""
          }
        />
        <StatCard
          title="Unsecured Recovery Rate"
          icon={<LGDSvg />}
          value={
            lgdSummary?.Moody_Senior_Unsecured_Recovery?.toFixed(
              4,
            )?.toString() ?? ""
          }
        />
        <StatCard
          title="Unsecured LGD"
          icon={<NPLSvg />}
          value={
            lgdSummary?.Moody_Senior_Unsecured_LGD?.toFixed(4)?.toString() ?? ""
          }
        />
      </div>

      {isLoading ? (
        <LoadingSpinner loadingText="Loading LGD Data..." />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <CustomTable
              columns={LGD_COLUMNS}
              rows={tableRows}
              tableHeaderClassName="bg-[#F9FAFB]"
              emptyMessage="No LGD data available"
            />
          </div>

          {(lgdDf?.total_logs ?? 0) > 0 && (
            <div className="mt-6">
              <Pagination
                totalCount={lgdDf?.total_logs ?? 0}
                activePage={String(lgdDf?.current_page ?? 1)}
                setPageNumber={setPageNumber}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LGDModelOutput;
