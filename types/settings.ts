export type IntegrationStatus = "active" | "inactive";

export interface ApiIntegration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  icon: string;
  last_sync?: string;
  processes_count: number;
  teams_count: number;
  bg_color: string;
}

export interface ApiIntegrationsResponse {
  data: ApiIntegration[];
  message: string;
}

export interface AddIntegrationPayload {
  name: string;
  description: string;
  api_key: string;
  icon: string;
  team_ids: string[];
  enable_immediately: boolean;
}

export interface NotificationSettings {
  process_completion: boolean;
  process_failure: boolean;
  daily_email_summary: boolean;
  api_integration_offline: boolean;
  new_user_onboarded: boolean;
  default_slack_channel: string;
}

export interface GeneralSettings {
  application_name: string;
  timezone: string;
  session_timeout: number;
  max_upload_size: number;
  audit_logging: boolean;
}

export interface NotificationSettingsResponse {
  data: NotificationSettings;
  message: string;
}

export interface GeneralSettingsResponse {
  data: GeneralSettings;
  message: string;
}
