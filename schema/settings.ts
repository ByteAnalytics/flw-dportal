import { z } from "zod";

export const AddIntegrationSchema = z.object({
  name: z.string().min(1, "Integration name is required"),
  description: z.string().optional(),
  api_key: z.string().min(1, "API key or connection string is required"),
  icon: z.string().min(1, "Icon is required"),
  team_ids: z.array(z.string()).min(1, "At least one team is required"),
  enable_immediately: z.boolean(),
});

export type AddIntegrationFormData = z.infer<typeof AddIntegrationSchema>;

export const OnboardUserSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.string().min(1, "Role is required"),
});

export type OnboardUserFormData = z.infer<typeof OnboardUserSchema>;

export const NotificationSettingsSchema = z.object({
  process_completion: z.boolean(),
  process_failure: z.boolean(),
  daily_email_summary: z.boolean(),
  api_integration_offline: z.boolean(),
  new_user_onboarded: z.boolean(),
  default_slack_channel: z.string().min(1, "Slack channel is required"),
});

export type NotificationSettingsFormData = z.infer<
  typeof NotificationSettingsSchema
>;

export const GeneralSettingsSchema = z.object({
  application_name: z.string().min(1, "Application name is required"),
  timezone: z.string().min(1, "Timezone is required"),
  session_timeout: z.number().min(1, "Session timeout must be at least 1 minute"),
  max_upload_size: z.number().min(1, "Maximum upload size must be at least 1"),
  audit_logging: z.boolean(),
});

export type GeneralSettingsFormData = z.infer<typeof GeneralSettingsSchema>;
