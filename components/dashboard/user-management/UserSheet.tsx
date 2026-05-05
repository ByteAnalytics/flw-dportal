"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomButton from "@/components/ui/custom-button";
import { FormFieldType, User, UserRole } from "@/types";
import CustomInputField from "@/components/ui/custom-input-field";
import { Form } from "@/components/ui/form";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { UserFormData, UserFormSchema } from "@/schema/profile";
import { roleOptions } from "@/constants/team-management";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import { statusOptions } from "@/constants/team-management-extended";

interface UserSheetProps {
  user?: User | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const UserSheet: React.FC<UserSheetProps> = ({ user, onClose, onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      email: user?.email ?? "",
      role: (user?.role as UserRole) ?? UserRole.USER,
      is_active: user?.is_active ? "active" : "inactive",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const createUser = useCreateUser();
  const updateUser = useUpdateUser(user?.id || "");

  const refreshUsers = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["users"],
      exact: false,
      refetchType: "all",
    });
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      const payload: any = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      };

      if (user?.id) {
        payload.role = data.role;
        payload.status = data.is_active === "active" || data.is_active === true;
      } else {
        payload.role = data.role;
      }

      let response;
      if (user?.id) {
        response = await updateUser.mutateAsync(payload);
      } else {
        response = await createUser.mutateAsync(payload);
      }

      toast.success(extractSuccessMessage(response));
      await refreshUsers();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  const formConfig = {
    buttonText: user?.id ? "Save Changes" : "Add User",
    title: user?.id ? "Edit User" : "Add New User",
  };

  const isLoading =
    createUser.isPending || updateUser.isPending || isSubmitting;

  return (
    <div className="flex flex-col gap-6 h-[85%] pb-6">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col overflow-y-auto"
        >
          <div className="h-full space-y-4 overflow-y-auto">
            <CustomInputField
              control={control}
              fieldType={FormFieldType.INPUT}
              name="first_name"
              label="First Name"
              placeholder="Enter first name"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.INPUT}
              name="last_name"
              label="Last Name"
              placeholder="Enter last name"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.EMAIL}
              name="email"
              label="Email"
              placeholder="example@email.com"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              disabled={isLoading}
            />

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="role"
              label="Role"
              placeholder="Select role"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              options={roleOptions}
              disabled={isLoading}
            />

            {/* Status field - only show for edit mode */}
            {user?.id && (
              <CustomInputField
                control={control}
                fieldType={FormFieldType.SELECT}
                name="is_active"
                label="Status"
                placeholder="Select status"
                className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
                options={statusOptions}
                disabled={isLoading}
              />
            )}
          </div>

          <div className="pt-6">
            <CustomButton
              type="submit"
              title={formConfig.buttonText}
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full hover:bg-[#005a2d] text-white rounded-[8px]"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserSheet;
