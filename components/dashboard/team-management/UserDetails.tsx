"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import CustomButton from "@/components/ui/custom-button";
import CustomAvatar from "@/components/ui/custom-avatar";
import { Mail, Calendar } from "lucide-react";
import AlertModal from "@/components/shared/AlertModal";
import { getRoleBadge, getStatusBadge } from "@/components/shared/Badge";
import UserSheet from "./UserSheet";
import UserActivitySheet from "./UserActivities";
import { SheetWrapper } from "@/components/ui/custom-sheet";
import {
  useGet,
  useDynamicDelete,
  usePut,
  usePatch,
} from "@/hooks/use-queries";
import { TeamUserResponse } from "@/types/team-management";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ApiResponse } from "@/types";
import {
  extractErrorMessage,
  extractSuccessMessage,
  formatDate,
} from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/api/auth-service";

const UserDetails = () => {
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isActivitySheetOpen, setIsActivitySheetOpen] = useState(false);
  const [isResseting, setIsResseting] = useState(false);
  const queryClient = useQueryClient();

  const params = useParams();
  const router = useRouter();
  const id = params?.slug as string;

  const { data, isLoading, refetch } = useGet<TeamUserResponse>(
    ["users", id],
    `/users/?user_id=${id}`,
  );

  const userDetails = data?.data;

  const deleteUserMutation = useDynamicDelete<ApiResponse<null>>();

  const activateUserMutation = usePatch<ApiResponse<null>, null>(
    `/users/${id}/status?user_status=active`,
    ["users", id],
  );
  const deactivateUserMutation = usePatch<ApiResponse<null>, null>(
    `/users/${id}/status?user_status=inactive`,
    ["users", id],
  );

  const updateUserMutation = usePut<
    ApiResponse<null>,
    { is_email_recipient: boolean }
  >(`/users/${id}`, ["users", id]);

  const handleDeactivate = async () => {
    try {
      const response = await deactivateUserMutation.mutateAsync(null);
      toast.success(extractSuccessMessage(response));
      refetch();
      setIsDeactivateModalOpen(false);
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleActivate = async () => {
    try {
      const response = await activateUserMutation.mutateAsync(null);
      toast.success(extractSuccessMessage(response));
      refetch();
      setIsActivateModalOpen(false);
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleReset = async () => {
    try {
      setIsResseting(true);
      const response = await authService.forgetPassword(
        userDetails?.email ?? "",
      );
      toast.success(extractSuccessMessage(response));
      setIsResetModalOpen(false);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsResseting(false);
    }
  };

  const refreshUsers = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["users"],
      exact: false,
      refetchType: "all",
    });
  };

  const handleDelete = async () => {
    try {
      const response = await deleteUserMutation.mutateAsync(`/users/${id}`);
      toast.success(extractSuccessMessage(response));
      setIsDeleteModalOpen(false);
      await refreshUsers();
      router.push("/dashboard/team-management");
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleEditSuccess = async () => {
    refetch();
    await refreshUsers();
    setIsEditSheetOpen(false);
  };

  // const handleToggleEmailRecipient = async (checked: boolean) => {
  //   try {
  //     const response = await updateUserMutation.mutateAsync({
  //       is_email_recipient: checked,
  //     });
  //     toast.success(extractSuccessMessage(response));
  //     refetch();
  //   } catch (error: any) {
  //     toast.error(extractErrorMessage(error));
  //   }
  // };

  const isUserActive = userDetails?.status?.toLowerCase() === "active";
  const isActionLoading =
    deleteUserMutation.isPending ||
    activateUserMutation.isPending ||
    deactivateUserMutation.isPending ||
    isResseting ||
    updateUserMutation.isPending;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-[1.4rem] font-[700] text-[#111827]">
            User Information
          </h2>
          <p className="font-[600] text-base text-InfraMuted mt-1">
            Manage system users and admins
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap ms-auto">
          <CustomButton
            iconPosition="left"
            withSideIcon
            sideIcon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.33334 15.8335L15.8333 15.8336V14.167L10 14.1669L9.99992 5.69037L13.2913 8.98179L14.4699 7.8033L9.16659 2.5L3.86328 7.8033L5.0418 8.98179L8.33326 5.69033L8.33334 15.8335Z"
                  fill="#1E6FB8"
                />
              </svg>
            }
            title="View Activity Log"
            onClick={() => setIsActivitySheetOpen(true)}
            textClassName="!text-[13px] font-[600] text-[#1E6FB8]"
            className="ms-auto md:min-w-[160px] min-w-[120px] md:h-[43px] h-[40px] flex-1 rounded-[20px] border-none bg-white"
          />
        </div>
      </div>

      <div className="bg-white md:p-8 p-4 rounded-[20px]">
        <div className="-mx-4 md:-mx-8 flex flex-wrap items-start gap-6 pb-8 border-b border-[#F3F4F6] px-4 md:px-8">
          <div className="flex-1">
            <div className="flex gap-4 flex-wrap items-start justify-between mb-8">
              <div>
                <CustomAvatar
                  name={`${userDetails?.first_name} ${userDetails?.last_name}`}
                  imageSrc=""
                  className="w-[48px] h-[48px]"
                />
                <h3 className="md:text-[20px] text-[18px] font-[700] mb-3">
                  {userDetails?.first_name} {userDetails?.last_name}
                </h3>
                <div className="flex items-center gap-2 capitalize">
                  {getRoleBadge(userDetails?.role ?? "")}
                  {getStatusBadge(userDetails?.status ?? "")}
                </div>
              </div>

              <CustomButton
                title="Edit Details"
                onClick={() => setIsEditSheetOpen(true)}
                disabled={isActionLoading}
                textClassName="!text-[13px] font-[500] text-InfraMuted"
                className="ms-auto min-w-[97px] md:h-[43px] h-[40px] rounded-[8px] border border-[#E5E7EB] bg-white hover:bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[14px]">
                <Mail size={16} className="text-[#6B7280]" />
                <span className="text-InfraMuted font-[500]">
                  {userDetails?.email}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[14px]">
                <Calendar size={16} className="text-[#6B7280]" />
                <span className="text-InfraMuted font-[500]">
                  Last Logged in {formatDate(userDetails?.last_login)}
                </span>
              </div>

              {/* <div className="flex items-center gap-2 mt-4">
                <Switch
                  checked={isEmailRecipient}
                  onCheckedChange={handleToggleEmailRecipient}
                  disabled={updateUserMutation.isPending}
                />
                <span className="text-[14px] font-[500] text-InfraMuted">
                  Email Recipient
                </span>
              </div> */}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between flex-wrap gap-4 pt-6">
          <CustomButton
            title="Delete User"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isActionLoading}
            textClassName="!text-[13px] font-[600] text-[#DC2626]"
            className="rounded-[8px] border border-[#FEE2E2] bg-white hover:bg-[#FEF2F2]  min-w-[98px] md:h-[43px] h-[40px]"
          />
          <div className="flex flex-wrap items-center flex-wrap gap-4 ">
            <CustomButton
              title="Reset Password"
              onClick={() => setIsResetModalOpen(true)}
              disabled={isActionLoading}
              textClassName="!text-[13px] font-[600] text-InfraSoftBlack"
              className="rounded-[8px] border border-[#E5E7EB] bg-InfraBorder hover:bg-gray-50  min-w-[120px] md:h-[43px] h-[40px]"
            />
            {isUserActive ? (
              <CustomButton
                title="Deactivate User"
                onClick={() => setIsDeactivateModalOpen(true)}
                disabled={isActionLoading}
                isLoading={deactivateUserMutation.isPending}
                textClassName="!text-[13px] font-[600] text-white"
                className="rounded-[8px] bg-[#DC2626] hover:bg-[#B91C1C]  min-w-[133px] md:h-[43px] h-[40px]"
              />
            ) : (
              <CustomButton
                title="Activate User"
                onClick={() => setIsActivateModalOpen(true)}
                disabled={isActionLoading}
                isLoading={activateUserMutation.isPending}
                textClassName="!text-[13px] font-[600] text-white"
                className="rounded-[8px] bg-[#006F37] hover:bg-[#005a2d]  min-w-[133px] md:h-[43px] h-[40px]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Sheets and Modals */}
      <SheetWrapper
        description={
          isEditSheetOpen
            ? "Edit user details. The system will send them a message to notify them of changes you have made."
            : "Edit the details of user. The system will send them a message to complete setting up."
        }
        title="Edit User"
        open={isEditSheetOpen}
        setOpen={setIsEditSheetOpen}
      >
        <UserSheet
          user={userDetails}
          onClose={() => setIsEditSheetOpen(false)}
          onSuccess={handleEditSuccess}
        />
      </SheetWrapper>

      <SheetWrapper
        title="User Activity"
        open={isActivitySheetOpen}
        setOpen={setIsActivitySheetOpen}
      >
        <UserActivitySheet
          userId={id}
          userName={`${userDetails?.first_name} ${userDetails?.last_name}`}
        />
      </SheetWrapper>

      {/* Confirmation Modals */}
      <AlertModal
        displayIcon
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        description="Are you sure you want to delete this user? "
        leftAction={{
          label: "Cancel",
          onClick: () => setIsDeleteModalOpen(false),
          className: "border-[#E5E7EB]",
        }}
        rightAction={{
          label: "Delete",
          onClick: handleDelete,
          isLoading: deleteUserMutation.isPending,
          className: "bg-[#DC2626] hover:bg-[#B91C1C] text-white",
        }}
      />

      <AlertModal
        isOpen={isResetModalOpen}
        setIsOpen={setIsResetModalOpen}
        description="Are you sure you want to reset this user's password?"
        leftAction={{
          label: "Cancel",
          onClick: () => setIsResetModalOpen(false),
          className: "border-[#E5E7EB]",
        }}
        rightAction={{
          label: "Reset",
          onClick: handleReset,
          isLoading: isResseting,
          className: "bg-[#006F37] hover:bg-[#005a2d] text-white",
        }}
      />

      <AlertModal
        isOpen={isDeactivateModalOpen}
        setIsOpen={setIsDeactivateModalOpen}
        description="Are you sure you want to deactivate this user?"
        leftAction={{
          label: "Cancel",
          onClick: () => setIsDeactivateModalOpen(false),
          className: "border-[#E5E7EB]",
        }}
        rightAction={{
          label: "Deactivate",
          onClick: handleDeactivate,
          isLoading: deactivateUserMutation.isPending,
          className: "bg-[#DC2626] hover:bg-[#B91C1C] text-white",
        }}
      />

      <AlertModal
        isOpen={isActivateModalOpen}
        setIsOpen={setIsActivateModalOpen}
        description="Are you sure you want to activate this user?"
        leftAction={{
          label: "Cancel",
          onClick: () => setIsActivateModalOpen(false),
          className: "border-[#E5E7EB]",
        }}
        rightAction={{
          label: "Activate",
          onClick: handleActivate,
          isLoading: activateUserMutation.isPending,
          className: "bg-[#006F37] hover:bg-[#005a2d] text-white",
        }}
      />
    </div>
  );
};

export default UserDetails;
