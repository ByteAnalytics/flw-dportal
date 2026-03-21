"use client";

import { memo, type ReactNode } from "react";
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
  headerClassName?: string;
  titleClassName?: string;
  SheetContentClassName?:string;
  descriptionClassName?: string;
}

export const SheetWrapper: React.FC<SheetWrapperProps> = ({
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
  headerClassName,
  titleClassName,
  SheetContentClassName,
  descriptionClassName,
}) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

      <SheetContent
        side={side}
        className={cn(
          "p-6 overflow-y-auto max-h-[100vh] custom-scroll sm:max-w-[400px] w-full",
          width,
          bg,
          SheetContentClassName,
        )}
      >
        <SheetHeader
          className={cn("mb-4 p-0", title && "block", headerClassName)}
        >
          {title && (
            <SheetTitle
              className={cn(
                "text-start mb-2",
                isAlert && "text-center",
                titleClassName,
              )}
            >
              {title}
            </SheetTitle>
          )}
          {description && (
            <SheetDescription className={cn(descriptionClassName)}>
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        {children}

        <SheetFooter className="sm:justify-start hidden">
          <SheetClose asChild>
            <Button variant="secondary">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
