"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import apiClient from "@/api/client";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";

<<<<<<< HEAD
=======
interface DownloadOptions {
  method?: "get" | "post";
  data?: any;
}

>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
export function useFileDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = useCallback(
<<<<<<< HEAD
    async (url: string, customFileName?: string) => {
      try {
        setIsDownloading(true);

        const response = await apiClient.get(url, {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        });
=======
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
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f

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
<<<<<<< HEAD

=======
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
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
