import { useGet, usePost, usePut, useDynamicDelete } from "@/hooks/use-queries";
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

export const useDeleteTeam = () => useDynamicDelete<ApiResponse<null>>();

export const useOnboardUser = () =>
  usePost<ApiResponse<null>, OnboardUserFormData>("/users", ["users"]);

export const useAddUserToTeam = (teamId: string, userId: string) =>
  usePost<ApiResponse<null>, null>(`/teams/${teamId}/add-user/${userId}`, [
    "teams",
    teamId,
  ]);

  export const useRemoveUserFromTeam = (teamId: string, userId: string) =>
    usePost<ApiResponse<null>, null>(`/teams/${teamId}/remove-user/${userId}`, [
      "teams",
      teamId,
    ]);
