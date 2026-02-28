"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import CustomTable from "@/components/ui/custom-table";
import ExportTrigger from "@/components/shared/ExportTrigger";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useGet } from "@/hooks/use-queries";
import { formatDate, formatNumber, formatPercentage } from "@/lib/utils";
import {
  LGDApiItem,
  LGDFileContent,
  LGDOutputApiResponse,
} from "@/types/reporting";
import { formatCellValue } from "@/lib/lgd-model-utils";
import { COLUMN_CONFIG, DEFAULT_COLUMNS } from "@/constants/lgd-model-config";
import { StatCard } from "../../shared/StatCard";
import { CustomerSvg, EadSvg, EclSvg, LGDSvg, NPLSvg } from "@/svg";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const LGDModelOutput = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.slug as string;
  const timeStamp = searchParams.get("time");
  const dataName = searchParams.get("name");

  const itemsPerPage = 10;

  const [pageNumber, setPageNumber] = useState(1);

  // API endpoints
  const fileUrl = `/models/${id}/output?model_type=LGD`;
  const emailExportApiUrl = `/reporting/email/models/lge?model_execution_id=${id}`;

  // Fetch data
  const { data, isLoading } = useGet<LGDOutputApiResponse>(
    ["lgd-model-output", id, pageNumber.toString()],
    `/reporting/models/lgd?model_execution_id=${id}&page=${pageNumber}&page_size=${itemsPerPage}`,
  );

  // Flatten the file_content arrays from all items
  const flattenedData = useMemo(() => {
    if (!data?.data || data.data.length === 0) return [];

    const allFileContents: LGDFileContent[] = [];
    data.data.forEach((item: LGDApiItem) => {
      if (item.file_content && Array.isArray(item.file_content)) {
        allFileContents.push(...item.file_content);
      }
    });

    return allFileContents;
  }, [data]);

  // Transform flattened data to table format
  const transformedData = useMemo(() => {
    if (flattenedData.length === 0) return [];

    return flattenedData.map((item: LGDFileContent) => {
      const row: { [key: string]: React.ReactNode } = {};

      // Create table cells for each field (including ID columns now)
      Object.keys(item).forEach((key) => {
        row[key] = formatCellValue(key, item[key]);
      });

      return row;
    });
  }, [flattenedData]);

  const columns = useMemo(() => {
    if (flattenedData.length === 0) {
      return DEFAULT_COLUMNS;
    }

    const firstItem = flattenedData[0];
    const columnKeys = Object.keys(firstItem);

    return columnKeys.map((key) => ({
      key,
      label: COLUMN_CONFIG[key]?.label || key.replace(/_/g, " "),
      width: COLUMN_CONFIG[key]?.width || "w-[200px]",
    }));
  }, [flattenedData]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Link
        href="#"
        onClick={() => router.back()}
        className="me-auto rounded-md border flex items-center  justify-center w-[28px] h-[28px] text-sm text-[#667085]"
      >
        <ChevronLeft className=" w-5 h-5" />
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.4rem] text-[#111827] font-[700]">
            LGD Model Report - File6765
          </h1>
          <p className="font-[600] text-base text-[#5B5F5E] mt-1">
            View full LGD report
          </p>
        </div>

        <ExportTrigger
          exportApiUrl={fileUrl}
          emailExportApiUrl={emailExportApiUrl}
          exportFileName={`${dataName}_${formatDate(timeStamp)}_LGD_Model`}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <StatCard
          title="Average Final LGD"
          icon={<CustomerSvg />}
          value={formatPercentage(10)}
        />
        <StatCard
          icon={<EadSvg />}
          title="Average Recovery Rate"
          value={formatPercentage(0)}
        />
        <StatCard
          icon={<EclSvg />}
          title="Weighted Final LGD"
          value={formatPercentage(0)}
        />
        <StatCard
          icon={<LGDSvg />}
          title="Unsecured Recovery Rate"
          value={formatPercentage(0)}
        />
        <StatCard
          icon={<NPLSvg />}
          title="Unsecured LGD"
          value={formatPercentage(0)}
        />
      </div>
      {/* Content Section */}
      {isLoading ? (
        <LoadingSpinner loadingText="Loading LGD Data..." />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <CustomTable
              columns={columns}
              rows={transformedData}
              tableHeaderClassName="bg-[#F9FAFB]"
              emptyMessage="No LGD data available"
            />
          </div>

          {flattenedData.length > 0 && (
            <div className="mt-6">
              <Pagination
                totalCount={data?.total_count || 1}
                activePage={String(data?.page || 1)}
                setPageNumber={setPageNumber}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LGDModelOutput;
