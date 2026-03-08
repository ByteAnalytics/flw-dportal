"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface TableColumn {
  key: string;
  label?: any;
  width?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface TableRowData {
  [key: string]: React.ReactNode | any;
  rawData?: any;
}

export interface TableAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: TableRowData, rowIndex: number) => void;
  variant?: "default" | "outline" | "ghost" | "destructive";
}

export interface CustomTableProps {
  caption?: string;
  columns: TableColumn[];
  rows: TableRowData[];
  actions?: TableAction[];
  className?: string;
  tableHeaderClassName?: string;
  emptyMessage?: string;
  loading?: boolean;
  skeletonRowCount?: number;
}

const CustomTable: React.FC<CustomTableProps> = ({
  caption,
  columns,
  rows,
  actions = [],
  className,
  tableHeaderClassName,
  emptyMessage = "No records found.",
  loading = false,
  skeletonRowCount = 5,
}) => {
  const hasActions = actions.length > 0;

  return (
    <Table className={cn("w-full custom-scroll", className)}>
      {caption && <TableCaption>{caption}</TableCaption>}

      <TableHeader className={cn("bg-[#F3F3F3]", tableHeaderClassName)}>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead
              key={i}
              className={cn(
                "font-[700] sm:text-[14px] text-[13px] text-[#003A1B] py-5 pl-4 !min-w-[180px]",
                col.width,
                col.align === "right" && "text-right",
                col.align === "center" && "text-center",
                col.className,
              )}
            >
              {col.label}
            </TableHead>
          ))}
          {hasActions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          Array.from({ length: skeletonRowCount }).map((_, i) => (
            <TableRow key={`skeleton-${i}`}>
              {columns.map((col, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-[80%]" />
                </TableCell>
              ))}
              {hasActions && (
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-[60px] ml-auto" />
                </TableCell>
              )}
            </TableRow>
          ))
        ) : rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + (hasActions ? 1 : 0)}
              className="text-center text-muted-foreground py-6"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={cn(
                rowIndex % 2 === 0 ? "bg-white" : "bg-[#FFF8FD]",
                "transition-colors",
              )}
            >
              {columns.map((col, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={cn(
                    "text-[#444846] font-[500] sm:text-[14px] text-[13px] py-5 pl-4",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                  )}
                >
                  {row[col.key]}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell className="flex justify-end gap-2">
                  {actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant={action.variant || "ghost"}
                      size="sm"
                      onClick={() => action.onClick(row, rowIndex)}
                      className="flex items-center gap-1"
                    >
                      {action.icon && <span>{action.icon}</span>}
                      {action.label}
                    </Button>
                  ))}
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default React.memo(CustomTable);
