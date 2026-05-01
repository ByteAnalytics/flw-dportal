"use client";

import React, { useRef, useState } from "react";
import { X, FileText, Image, FileSpreadsheet, File } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const ACCEPTED_EXTENSIONS = ".jpeg,.jpg,.png,.pdf,.csv,.xls,.xlsx";

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileIcon = (file: File) => {
  if (file.type.startsWith("image/"))
    return <Image className="w-4 h-4 text-blue-500" />;
  if (file.type === "application/pdf")
    return <FileText className="w-4 h-4 text-red-500" />;
  if (
    file.type.includes("sheet") ||
    file.type.includes("excel") ||
    file.name.endsWith(".csv")
  )
    return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
  return <File className="w-4 h-4 text-gray-400" />;
};

interface FileUploadProps {
  acceptedFormats?: string;
  multiple?: boolean;
  onChange?: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  acceptedFormats = "JPEG, PDF, PNG, CSV, Excel",
  multiple = true,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles = Array.from(incoming).filter(
      (f) =>
        ACCEPTED_MIME_TYPES.includes(f.type) &&
        !files.some(
          (existing) => existing.name === f.name && existing.size === f.size,
        ),
    );
    if (newFiles.length === 0) return;
    const updated = multiple ? [...files, ...newFiles] : [newFiles[0]];
    setFiles(updated);
    onChange?.(updated);
    // Reset input so same file can be re-selected if removed
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange?.(updated);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <p className="text-[14px] font-semibold mb-2.5">Upload Files</p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-[12px] p-7 text-center bg-[#FAFAFA] cursor-pointer transition-colors",
          isDragging
            ? "border-[#EAA945] bg-[#EAA945]/5"
            : "border-[#D1D5DB] hover:border-[#EAA945]/60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={ACCEPTED_EXTENSIONS}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <svg
          className={cn(
            "w-9 h-9 mx-auto mb-2.5 transition-colors",
            isDragging ? "text-[#EAA945]" : "text-[#C0C4C3]",
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="16 16 12 12 8 16" />
          <line x1="12" y1="12" x2="12" y2="21" />
          <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
        </svg>
        <p className="text-[13px] text-[#9A9E9D] mb-3">
          {isDragging
            ? "Drop files here"
            : "Drag and drop files, or click to browse"}
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="bg-white border border-[#E1E3E2] rounded-[8px] px-3.5 py-1.5 text-[12px] font-medium text-[#5B5F5E]">
            Choose Files
          </span>
          <span className="text-[12px] text-[#9A9E9D]">
            {files.length === 0
              ? "No file chosen"
              : `${files.length} file${files.length > 1 ? "s" : ""} selected`}
          </span>
        </div>
        <p className="text-[11px] text-[#9A9E9D] mt-3">
          Accepted: {acceptedFormats}
        </p>
      </div>

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${file.size}`}
              className="flex items-center gap-3 bg-white border border-[#E1E3E2] rounded-[10px] px-3 py-2.5"
            >
              <div className="flex-shrink-0">{getFileIcon(file)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-[#0A0A0A] truncate">
                  {file.name}
                </p>
                <p className="text-[11px] text-[#9A9E9D]">
                  {formatBytes(file.size)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="flex-shrink-0 w-[22px] h-[22px] flex items-center justify-center rounded-full text-[#9A9E9D] hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
