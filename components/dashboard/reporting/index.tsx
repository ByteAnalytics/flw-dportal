"use client";

import React, { useState, useMemo } from "react";
import { CustomTabs } from "@/components/shared/CustomTab";
import ReportTable from "./ReportTable";
import { useGet } from "@/hooks/use-queries";
import { Pagination } from "@/components/shared/Pagination";
import { ApiResponse } from "@/types";
import {
  ExecutableModels,
  ExecutionModelsResponse,
  ReportData,
} from "@/types/model-execution";
import {
  formatDate,
  formatDateOnly,
  transformExecutionModelsResponse,
} from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSearchParams } from "next/navigation";
import { getFilterValue } from "@/lib/reporting-utils";

const Reporting = () => {
  const params = useSearchParams();
  const model_execution_id = params.get("model_execution_id");
  const [activeTab, setActiveTab] = useState("all");
  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = 10;

  const buildApiUrl = () => {
    let baseUrl = `/crr/logs/?page=${pageNumber}&page_size=${itemsPerPage}`;
    const filterValue = getFilterValue(activeTab);

    if (model_execution_id) {
      baseUrl += `&model_execution_id=${model_execution_id}`;
    }

    if (activeTab !== "all" && filterValue) {
      return `${baseUrl}&model_type=${filterValue}`;
    }
    return baseUrl;
  };

  const { data, isLoading } = useGet<ApiResponse<ExecutionModelsResponse>>(
    ["execution-models", pageNumber?.toString(), activeTab],
    buildApiUrl(),
    {
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      staleTime: 0,
    },
  );

  const transformedData = useMemo(() => {
    if (data?.data) {
      return transformExecutionModelsResponse(data.data);
    }
    return {
      page: 1,
      page_size: 10,
      total: 0,
      pages: 1,
      data: [],
    };
  }, [data]);

  const transformApiDataToReports = (): ReportData[] => {
    if (!transformedData.data || transformedData.data.length === 0) return [];

    return transformedData.data.map((model): ReportData => {
      const getStatus = ():
        | "Completed"
        | "Pending"
        | "Queued"
        | "Failed"
        | "Running" => {
        const status = model.execution_status?.toLowerCase();
        if (status === "completed") return "Completed";
        if (status === "queued") return "Queued";
        if (status === "failed") return "Failed";
        if (status === "running") return "Running";
        return "Pending";
      };

      const getModelCategory = (): string => {
        const modelType = model.executed_model_type?.toLowerCase();
        switch (modelType) {
          case ExecutableModels.PD:
            return "PD Model";
          case ExecutableModels.LGD:
            return "LGD Model";
          case ExecutableModels.EAD:
            return "EAD Model";
          case ExecutableModels.CCF:
            return "CCF Model";
          case ExecutableModels.FLI:
            return "FLI Scalar";
          case ExecutableModels.ECL:
            return "ECL Model";
          default:
            return model.executed_model_type || "Unknown Model";
        }
      };

      return {
        fileName: model.file_name,
        date: formatDateOnly(model.created_at),
        timeStamp: formatDate(model.timestamp),
        createdBy: {
          name: model?.user_name || "Unknown User",
          email: model?.user_email || "user@system.com",
        },
        executedModelType: model.executed_model_type,
        modelCategory: getModelCategory(),
        status: getStatus(),
        executionStatus: model.execution_status,
        id: model.id,
      };
    });
  };

  const reports = transformApiDataToReports();
  const totalPages = transformedData.pages;
  const currentPage = transformedData.page;

  const getFilteredData = () => {
    return reports;
  };

  const renderTabContent = (content: React.ReactNode) => {
    if (isLoading) {
      return <LoadingSpinner loadingText="Fetching Reports..." />;
    }
    return content;
  };

  const tabOptions = [
    {
      value: "all",
      label: "All Models",
      content: renderTabContent(
        <>
          <ReportTable
            data={getFilteredData()}
            showModelCategory={true}
            currentTab="all"
          />
          {getFilteredData().length > 0 && (
            <div className="mt-6">
              <Pagination
                totalPageNumber={totalPages}
                activePage={String(currentPage)}
                setPageNumber={setPageNumber}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </>,
      ),
    },
    {
      value: "pd-model",
      label: "PD Model",
      content: renderTabContent(
        <>
          <ReportTable
            data={getFilteredData()}
            showModelCategory={false}
            currentTab="pd-model"
          />
          {getFilteredData().length > 0 && (
            <div className="mt-6">
              <Pagination
                totalPageNumber={totalPages}
                activePage={String(currentPage)}
                setPageNumber={setPageNumber}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </>,
      ),
    },
    {
      value: "fli-model",
      label: "FLI Scalar",
      content: renderTabContent(
        <>
          <ReportTable
            data={getFilteredData()}
            showModelCategory={false}
            currentTab="fli-scalar"
          />
          {getFilteredData().length > 0 && (
            <div className="mt-6">
              <Pagination
                totalPageNumber={totalPages}
                activePage={String(currentPage)}
                setPageNumber={setPageNumber}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </>,
      ),
    },
    {
      value: "lgd-model",
      label: "LGD Model",
      content: renderTabContent(
        <>
          <ReportTable
            data={getFilteredData()}
            showModelCategory={false}
            currentTab="lgd-model"
          />
          {getFilteredData().length > 0 && (
            <div className="mt-6">
              <Pagination
                totalPageNumber={totalPages}
                activePage={String(currentPage)}
                setPageNumber={setPageNumber}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </>,
      ),
    },
    {
      value: "ead-model",
      label: "EAD Model",
      content: renderTabContent(
        <>
          <ReportTable
            data={getFilteredData()}
            showModelCategory={false}
            currentTab="ead-model"
          />
          {getFilteredData().length > 0 && (
            <div className="mt-6">
              <Pagination
                totalPageNumber={totalPages}
                activePage={String(currentPage)}
                setPageNumber={setPageNumber}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </>,
      ),
    },
    {
      value: "ecl-model",
      label: "ECL Model",
      content: renderTabContent(
        <>
          <ReportTable
            data={getFilteredData()}
            showModelCategory={false}
            currentTab="ecl-model"
          />
          {getFilteredData().length > 0 && (
            <div className="mt-6">
              <Pagination
                totalPageNumber={totalPages}
                activePage={String(currentPage)}
                setPageNumber={setPageNumber}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </>,
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[1.4rem] text-[#111827] font-[700] mb-2">
            Reporting
          </h1>
          <h1 className="text-base text-[#5B5F5E] font-[600]">
            View reports and system output
          </h1>
        </div>{" "}
        {/* <ExportTrigger /> */}
      </div>

      <CustomTabs
        defaultValue="all"
        options={tabOptions}
        onValueChange={(value) => {
          setActiveTab(value);
          setPageNumber(1);
        }}
        className="border-none"
        triggerClassName="max-w-fit"
      />
    </div>
  );
};

export default Reporting;
