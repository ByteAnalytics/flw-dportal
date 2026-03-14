"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomButton from "@/components/ui/custom-button";
import {
  AddAsEmailReceipient,
  ApiResponse,
  FormFieldType,
  User,
  UserRole,
} from "@/types";
import CustomInputField from "@/components/ui/custom-input-field";
import { Form } from "@/components/ui/form";
import { usePost, usePut } from "@/hooks/use-queries";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { UserFormData, UserFormSchema } from "@/schema/profile";
import { receipientOptions, roleOptions } from "@/constants/team-management";
import { useQueryClient } from "@tanstack/react-query";

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
      addAsEmailReceipient: user?.is_email_recipient
        ? AddAsEmailReceipient.YES
        : AddAsEmailReceipient.NO,
      role: (user?.role?.toUpperCase() as UserRole) ?? UserRole.USER,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const createUser = usePost<ApiResponse<null>, UserFormData>("/auth/", [
    "users",
  ]);

  const updateUser = usePut<ApiResponse<null>, UserFormData>(
    `/users/${user?.id}`,
    ["users"],
  );

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
        is_email_recipient:
          data.addAsEmailReceipient === AddAsEmailReceipient.YES,
      };

      // if (canEditRole) {
        payload.role = data.role;
      // }

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

            {/* {canEditRole && ( */}
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
          

            <CustomInputField
              control={control}
              fieldType={FormFieldType.SELECT}
              name="addAsEmailReceipient"
              label="Add as Email Recipient"
              placeholder="Select choice"
              className="bg-InfraBorder rounded-[20px] sm:h-[45px] h-[45px]"
              options={receipientOptions}
              disabled={isLoading}
            />
          </div>

          <div className="pt-6">
            <CustomButton
              type="submit"
              title={formConfig.buttonText}
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full  hover:bg-[#005a2d] text-white rounded-[8px]"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserSheet;
