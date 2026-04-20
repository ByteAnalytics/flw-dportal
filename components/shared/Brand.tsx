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

export const FlwLogo = () => {
  return (
    <div className="mb-6 select-none">
      <p className="text-[1.6rem] font-black tracking-tight leading-none">
        <span className="text-gray-900">flw</span>
        <span className="relative inline-block ml-1">
          {/* Gradient text */}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #006D37 0%, #00A854 60%, #00C96A 100%)",
            }}
          >
            dportal
          </span>
          {/* Underline accent */}
          <span
            className="absolute -bottom-1 left-0 h-[2.5px] w-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #006D37, #00C96A)",
              opacity: 0.45,
            }}
          />
        </span>
      </p>
      {/* Subtle tagline (optional — remove if not needed) */}
      <p className="text-[11px] font-semibold tracking-[0.18em] text-gray-400 uppercase mt-1 ml-0.5">
        Data Portal
      </p>
    </div>
  );
};
