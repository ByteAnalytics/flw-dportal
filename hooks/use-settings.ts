import {
  useGet,
  usePost,
  usePut,
  usePatch,
  useDynamicDelete,
} from "@/hooks/use-queries";
import { ApiResponse } from "@/types";
import {
  ApiIntegrationsResponse,
  NotificationSettingsResponse,
  GeneralSettingsResponse,
} from "@/types/settings";
import {
  AddIntegrationFormData,
  NotificationSettingsFormData,
  GeneralSettingsFormData,
} from "@/schema/settings";

export const useApiIntegrations = () =>
  useGet<ApiIntegrationsResponse>(["api-integrations"], "/integrations/");

export const useAddIntegration = () =>
  usePost<ApiResponse<null>, AddIntegrationFormData>("/integrations/", [
    "api-integrations",
  ]);

export const useToggleIntegration = (id: string) =>
  usePatch<ApiResponse<null>, { status: string }>(
    `/integrations/${id}/toggle`,
    ["api-integrations"],
  );

export const useDeleteIntegration = () => useDynamicDelete<ApiResponse<null>>();

export const useNotificationSettings = () =>
  useGet<NotificationSettingsResponse>(
    ["notification-settings"],
    "/settings/notifications/",
  );

export const useSaveNotificationSettings = () =>
  usePut<ApiResponse<null>, NotificationSettingsFormData>(
    "/settings/notifications/",
    ["notification-settings"],
  );

export const useGeneralSettings = () =>
  useGet<GeneralSettingsResponse>(["general-settings"], "/settings/general/");

export const useSaveGeneralSettings = () =>
  usePut<ApiResponse<null>, GeneralSettingsFormData>("/settings/general/", [
    "general-settings",
  ]);
