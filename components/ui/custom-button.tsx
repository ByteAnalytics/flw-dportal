"use client";

import * as React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomButtonProps extends React.ComponentProps<typeof ShadcnButton> {
  title?: string;
  icon?: React.ReactNode;
  sideIcon?: React.ReactNode;
  withSideIcon?: boolean;
  iconPosition?: "left" | "right" | "center";
  isLoading?: boolean;
  showIcon?: boolean;
  textClassName?: string;
  onPress?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      title,
      icon,
      sideIcon,
      withSideIcon = false,
      iconPosition = "left",
      isLoading = false,
      showIcon = false,
      textClassName,
      onPress,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <ShadcnButton
        ref={ref}
        onClick={onPress}
        disabled={isLoading || props.disabled}
        className={cn(
          "flex items-center gap-2 h-[45px] md:text-sm text-[12px] bg-[#E8A020] cursor-pointer",
          iconPosition === "right" && "flex-row-reverse",
          iconPosition === "center" && "justify-center",
          withSideIcon && "pl-4 border w-fit",
          className,
        )}
        {...props}
      >
        {/* Left side icon (optional) */}
        {withSideIcon && (
          <span className="transition-transform group-hover:scale-110 group-hover:rotate-6">
            {sideIcon}
          </span>
        )}

        {/* Loader or icon */}
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-black rounded-full animate-spin" />
        ) : (
          showIcon && icon
        )}

        {/* Title or children */}
        {title ? (
          <span className={cn("font-medium text-base", textClassName)}>
            {title}
          </span>
        ) : (
          children
        )}
      </ShadcnButton>
    );
  },
);

Button.displayName = "Button";

export default React.memo(Button);
