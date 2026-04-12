"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "nextjs-toploader/app";
import { CustomImage } from "../ui/custom-image";
import { EnvironmentHelper } from "@/lib/environment-utils";
import { StaticImageData } from "next/image";

interface BrandProps {
  style?: string;
  src?: StaticImageData;
}

export const Brand: React.FC<BrandProps> = ({ style, src }) => {
  const router = useRouter();
  const navigateToHome = () => router.push("/");
  const isByte = EnvironmentHelper.isDemo();
  return (
    <CustomImage
      src={src ?? EnvironmentHelper.getBrandLogo()}
      priority
      style={cn("w-[100px] h-[61px]", style, isByte && "w-[126px] h-[90px]")}
      clickFunc={navigateToHome}
    />
  );
};
