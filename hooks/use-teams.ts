import {
  useGet,
  usePost,
  usePut,
  useDynamicDelete,
  useDelete,
} from "@/hooks/use-queries";
import { ApiResponse } from "@/types";
import { TeamsResponse, SingleTeamResponse } from "@/types/teams";
import { OnboardUserFormData } from "@/schema/settings";
import { TeamFormData } from "@/schema/teams";

export const useTeams = () =>
  useGet<ApiResponse<TeamsResponse>>(["teams"], "/teams/");

export const useTeamById = (id: string) =>
  useGet<SingleTeamResponse>(["teams", id], `/teams/${id}/`);

export const useCreateTeam = () =>
  usePost<ApiResponse<null>, TeamFormData>("/teams/", ["teams"]);

export const useUpdateTeam = (id: string) =>
  usePut<ApiResponse<null>, TeamFormData>(`/teams/${id}`, ["teams", id]);

export const useDeleteTeam = () =>
  useDelete<ApiResponse<null>, { team_ids: string[] }>(`/teams`, ["teams"]);

export const useOnboardUser = () =>
  usePost<ApiResponse<null>, OnboardUserFormData>("/users", ["users"]);

export const useAddUserToTeam = (teamId: string) =>
  usePost<ApiResponse<null>, { user_ids: string[] }>(
    `/teams/${teamId}/add-users`,
    ["teams"],
  );

export const useRemoveUserFromTeam = (teamId: string) =>
  useDelete<ApiResponse<null>, { user_ids: string[] }>(
    `/teams/${teamId}/remove-users`,
    ["teams", teamId],
  );
