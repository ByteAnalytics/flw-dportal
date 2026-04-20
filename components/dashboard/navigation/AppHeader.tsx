"use client";

import * as React from "react";
import CustomAvatar from "@/components/ui/custom-avatar";
import { useRouter } from "nextjs-toploader/app";
import { ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { navItems } from "@/constants/navigation";
import { usePathname } from "next/navigation";

const AppHeader: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore((s) => s);
  const pathname = usePathname();
  const activeItem = navItems.find((item) => pathname === item.url);

  return (
    <header className="w-full h-16 md:h-18 bg-[#F3F3F3] flex items-center pe-4 md:pe-10 md:ps-0 ps-4">
      {activeItem ? (
        <h1 className="text-md md:text-lg font-[700] text-gray-800">
          {activeItem.title}
        </h1>
      ) : (
        <Link
          href="#"
          onClick={() => router.back()}
          className="me-auto flex items-center justify-center text-sm text-[#667085]"
        >
          <ChevronLeft className="mr-[0.25rem] inline w-4 h-4" />
          Back
        </Link>
      )}

      <div className="flex items-center gap-6 ml-auto">
        <div
          onClick={() => router.push("/dashboard/profile")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <CustomAvatar
            name={`${user?.first_name} ${user?.last_name}` || "NA"}
            size={36}
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-xs text-[#5B5F5E] font-normal">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
