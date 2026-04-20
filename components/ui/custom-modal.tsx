"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import React, { memo, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface CustomModalProps {
  children: ReactNode;
  width?: string;
  title?: string;
  trigger?: ReactNode;
  description?: string;
  bg?: string;
  open?: boolean;
  isAlert?: boolean;
  setOpen?: (open: boolean) => void;
}

export const CustomModal = memo<CustomModalProps>(
  ({
    children,
    width,
    title,
    isAlert = false,
    trigger,
    description,
    bg,
    open,
    setOpen,
  }) => {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className={cn(
            " m-auto p-[24px] sm:max-w-[400px] max-w-full max-h-[90vh] overflow-y-auto max-h-[90vh] custom-scroll",
            width && width,
            bg && bg
          )}
        >
          <DialogHeader className={cn("hidden", title && "block")}>
            <DialogTitle
              className={cn("text-start ", isAlert && "text-center")}
            >
              {title}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter className="sm:justify-start hidden">
            <DialogClose asChild>
              <Button></Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

CustomModal.displayName = "CustomModal";
