"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { UploadIcon } from "@/svg";
import { Link2 } from "lucide-react";

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
  onLinkSubmit?: (link: string) => void;
  acceptedFormats?: string;
  maxSize?: number;
  enableLink?: boolean;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onFileSelect,
  onLinkSubmit,
  maxSize = 25,
  enableLink = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkInput(e.target.value);
  };

  const handleLinkKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && linkInput.trim() && onLinkSubmit) {
      onLinkSubmit(linkInput.trim());
      setLinkInput("");
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "border-2 border-dashed bg-white rounded-lg md:p-[16px] p-4 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-[#006D37] bg-[#F0F9F4]"
            : "border-gray-300 bg-white hover:border-[#006D37]",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          // accept={acceptedFormats}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <UploadIcon />
          <div>
            <span className="text-[#009254] md:text-[14px] text-[12px] font-[500]">
              Click to Upload
            </span>
            <span className="text-[#5B5F5E] md:text-[14px] text-[12px] font-[500]">
              {" "}
              or drag and drop
            </span>
          </div>
          <p className="md:text-[14px] text-[12px] font-[500] text-[#5B5F5E]">
            (Max. File size: {maxSize} MB)
          </p>
        </div>
      </div>

      {enableLink && (
        <>
          <div className=" md:text-[14px] text-[12px] font-[600] my-8 text-center">
            OR INPUT A LINK
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Link2 className="w-4 h-4 text-[#5B5F5E]" />
            </div>
            <input
              type="url"
              value={linkInput}
              onChange={handleLinkChange}
              onKeyDown={handleLinkKeyDown}
              onClick={(e) => e.stopPropagation()}
              placeholder="https://www.statinsights/annual povertyNigeria00087"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-[20px] md:text-[14px] text-[12px] font-[500] text-[#5B5F5E] placeholder:text-[#5B5F5E] focus:outline-none focus:border-[#006D37] focus:ring-1 focus:ring-[#006D37] bg-[#F4FBF6]"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploadArea;
