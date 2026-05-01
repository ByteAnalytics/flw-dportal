<<<<<<< HEAD
import { useGet, usePost, usePut, useDynamicDelete } from "@/hooks/use-queries";
=======
import {
  useGet,
  usePost,
  usePut,
  useDelete,
} from "@/hooks/use-queries";
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
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

<<<<<<< HEAD
export const useDeleteTeam = () => useDynamicDelete<ApiResponse<null>>();
=======
export const useDeleteTeam = () =>
  useDelete<ApiResponse<null>, { team_ids: string[] }>(`/teams`, ["teams"]);
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f

export const useOnboardUser = () =>
  usePost<ApiResponse<null>, OnboardUserFormData>("/users", ["users"]);

<<<<<<< HEAD
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
=======
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
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
