"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import apiClient from "@/api/client";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";

interface DownloadOptions {
  method?: "get" | "post";
  data?: any;
}

export function useFileDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = useCallback(
    async (
      url: string,
      customFileName?: string,
      options: DownloadOptions = {},
    ) => {
      const { method = "get", data } = options;

      try {
        setIsDownloading(true);

        const response =
          method === "post"
            ? await apiClient.post(url, data, {
                responseType: "blob",
                headers: {
                  Accept:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                },
              })
            : await apiClient.get(url, {
                responseType: "blob",
                headers: {
                  Accept:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                },
              });

        const contentDisposition = response.headers["content-disposition"];
        const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
        const extractedName = fileNameMatch ? fileNameMatch[1] : "export.xlsx";
        const fileName = customFileName
          ? `${customFileName}.xlsx`
          : extractedName;

        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error: any) {
        toast.error(extractErrorMessage(error));
        console.error("Error downloading file:", error);
        throw error;
      } finally {
        setIsDownloading(false);
      }
    },
    [],
  );

  return { isDownloading, downloadFile };
}
