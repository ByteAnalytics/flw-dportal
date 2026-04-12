"use client";

import React from "react";
import CustomAvatar from "@/components/ui/custom-avatar";
import { Mail, Calendar, LogOut } from "lucide-react";
import { getRoleBadge, getStatusBadge } from "@/components/shared/Badge";
import { useGet, usePost } from "@/hooks/use-queries";
import { TeamUserResponse } from "@/types/team-management";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { ApiResponse } from "@/types";
import AlertModal from "@/components/shared/AlertModal";

const ProfileDetails = () => {
  const router = useRouter();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const { logout } = useAuthStore((s) => s);
  const logoutApi = usePost<ApiResponse<string>, null>("/auth/logout");

  const { data, isLoading } = useGet<TeamUserResponse>(
    ["user-profile-me"],
    "/users/me",
    {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
      placeholderData: undefined,
    },
  );

  const userProfile = data?.data;

  const handleLogout = async () => {
    try {
      await logoutApi.mutateAsync(null);
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      logout();
      router.push("/auth/sign-in");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#6B7280] text-[14px]">
          Unable to load profile information
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-[1.4rem] font-[700] text-[#111827]">
            My Profile
          </h2>
          <p className="font-[600] text-base text-[#5B5F5E] mt-1">
            View and manage your profile information
          </p>
        </div>
      </div>

      <div className="bg-white md:p-8 p-4 rounded-[20px]">
        <div className="-mx-4 md:-mx-8 flex flex-wrap items-start gap-6 pb-8 border-b border-[#F3F4F6] px-4 md:px-8">
          <CustomAvatar
            name={`${userProfile.first_name} ${userProfile.last_name}`}
            imageSrc=""
            className="w-[104px] h-[104px]"
          />

          <div className="flex-1">
            <div className="flex gap-4 flex-wrap items-start justify-between mb-8">
              <div>
                <h3 className="md:text-[20px] text-[18px] font-[700] mb-3">
                  {userProfile.first_name} {userProfile.last_name}
                </h3>
                <div className="flex items-center gap-2 capitalize">
                  {getRoleBadge(userProfile.role ?? "")}
                  {getStatusBadge(userProfile.status ?? "")}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[14px]">
                <Mail size={16} className="text-[#6B7280]" />
                <span className="text-[#5B5F5E] font-[500]">
                  {userProfile.email}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[14px]">
                <Calendar size={16} className="text-[#6B7280]" />
                <span className="text-[#5B5F5E] font-[500]">
                  Last Logged in {formatDate(userProfile?.last_login)}
                </span>
              </div>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex md:hidden items-center gap-2 text-[14px] mt-4"
              >
                <LogOut className="text-[#6B7280]" size={16} />
                <span className="text-[#5B5F5E] font-[500]">Logout</span>
              </button>
            </div>
          </div>
        </div>
        <AlertModal
          isOpen={isLogoutModalOpen}
          setIsOpen={setIsLogoutModalOpen}
          description="Are you sure you want to logout?"
          leftAction={{
            label: "Cancel",
            onClick: () => setIsLogoutModalOpen(false),
            className: "border-[#E5E7EB]",
          }}
          rightAction={{
            label: "Logout",
            isLoading: logoutApi.isPending,
            disabled: logoutApi.isPending,
            onClick: async () => await handleLogout(),
            className: "bg-[#FF5C5C] hover:bg-[#E04B4B] text-white",
          }}
        />
      </div>
    </div>
  );
};

export default ProfileDetails;
