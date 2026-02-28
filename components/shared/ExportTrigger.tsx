"use client";

import React from "react";
import { Download } from "lucide-react";
import CustomButton from "@/components/ui/custom-button";
import CustomDropdown, { DropdownItem } from "@/components/ui/custom-dropdown";
import { ExportToEmail } from "../shared/ExportToEmail";
import { useFileDownload } from "@/hooks/us-file-download";

interface ExportTriggerProps {
  trigger?: React.ReactNode;
  exportApiUrl: string;
  emailExportApiUrl: string;
  exportFileName?: string;
}

const ExportTrigger: React.FC<ExportTriggerProps> = ({
  trigger,
  exportApiUrl = "/reporting/exports/password_changes?page_size=1000",
  exportFileName,
  emailExportApiUrl,
}) => {
  const [isEmailPromptOpen, setIsEmailPromptOpen] = React.useState(false);
  const { isDownloading, downloadFile } = useFileDownload();

  const dropdownItems: DropdownItem[] = [
    {
      label: isDownloading ? "Downloading..." : "Download File",
      onClick: () => downloadFile(exportApiUrl, exportFileName),
      disabled: isDownloading,
    },
    {
      label: "Send to Email",
      onClick: () => setIsEmailPromptOpen(true),
    },
  ];

  return (
    <>
      <CustomDropdown
        trigger={
          trigger || (
            <CustomButton
              title={isDownloading ? "Exporting..." : "Export"}
              iconPosition="right"
              withSideIcon
              sideIcon={<Download className="w-5 h-5 text-white" />}
              textClassName="text-xs md:text-[13px] font-semibold"
              className="ms-auto min-w-[98px] flex-1 rounded-[12px] border  h-[37px]"
              disabled={isDownloading}
            />
          )
        }
        items={dropdownItems}
      />

      <ExportToEmail
        emailExportApiUrl={emailExportApiUrl}
        isEmailPromptOpen={isEmailPromptOpen}
        setIsEmailPromptOpen={setIsEmailPromptOpen}
      />
    </>
  );
};

export default ExportTrigger;
