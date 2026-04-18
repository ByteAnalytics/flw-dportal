import { Process } from "./processes";

export interface Team {
  id: string;
  name: string;
  description?: string;
  member_count: number;
  process_count: number;
  //   color: string;
  //   bg_color: string;
  //   processes_count: number;
  //   members_count: number;
  api_connections_count?: number;
  processes?: Process[];
}

export type TeamsResponse = Team[];

export interface SingleTeamResponse {
  data: Team;
  message: string;
}

export interface OnboardUserPayload {
  full_name: string;
  email: string;
  username: string;
  role: string;
  team_ids: string[];
}

export interface UserWithTeams {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  last_login: string;
  teams: { id: string; name: string; color: string }[];
}

export interface UsersWithTeamsResponse {
  data: UserWithTeams[];
  message: string;
}
