"use client";

import React, { memo, type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SheetWrapperProps {
  children: ReactNode;
  width?: string;
  title?: string;
  description?: string;
  trigger?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  open?: boolean;
  setOpen?: (open: boolean) => void;
  bg?: string;
  isAlert?: boolean;
}

export const SheetWrapper = memo<SheetWrapperProps>(
  ({
    children,
    width,
    title,
    description,
    trigger,
    side = "right",
    open,
    setOpen,
    bg,
    isAlert = false,
  }) => {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {/* Trigger */}
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

        {/* Content */}
        <SheetContent
          side={side}
          className={cn(
            "p-6  overflow-y-auto max-h-[100vh] custom-scroll sm:max-w-[400px] w-full",
            width && width,
            bg
          )}
        >
          <SheetHeader className={cn("mb-4 p-0", title && "block")}>
            {title && (
              <SheetTitle
                className={cn("text-start mb-2", isAlert && "text-center")}
              >
                {title}
              </SheetTitle>
            )}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>

          {children}

          {/* Optional footer (hidden by default) */}
          <SheetFooter className="sm:justify-start hidden">
            <SheetClose asChild>
              <Button variant="secondary">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
);

SheetWrapper.displayName = "SheetWrapper";
