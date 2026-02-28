"use client";

import React, { memo } from "react";
import {
  Avatar as ShadcnAvatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useAvatar } from "@/hooks/use-avatar";

interface AvatarProps {
  imageSrc?: string;
  name?: string;
  size?: number;
  radius?: string | number;
  className?: string;
  textCount?: number;
  bgColor?: string;
  count?: number;
  fit?: "contain" | "cover";
}

const CustomAvatar: React.FC<AvatarProps> = ({
  imageSrc,
  name = "",
  textCount = 2,
  className,
}) => {
  const { validImageSrc, getInitials } = useAvatar({
    imageSrc,
    name,
    textCount,
  });

  return (
    <ShadcnAvatar className={className}>
      {validImageSrc ? (
        <AvatarImage src={validImageSrc} />
      ) : (
        <AvatarFallback className="uppercase">{getInitials()}</AvatarFallback>
      )}
    </ShadcnAvatar>
  );
};

export default memo(CustomAvatar);
