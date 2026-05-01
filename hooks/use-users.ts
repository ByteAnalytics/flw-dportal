<<<<<<< HEAD
// hooks/use-users.ts
=======
>>>>>>> 589c80b46b3158aadaf075bdb5e445eca870f91f
import { useGet, usePost, usePut, useDynamicDelete } from "@/hooks/use-queries";
import { buildQueryString } from "@/lib/utils";
import { UserFormData } from "@/schema/profile";
import { ApiResponse } from "@/types";
import { UsersWithTeamsResponse, UserWithTeams } from "@/types/teams";

export const useUsers = (filters?: {
  team_name?: string;
  team_id?: string;
  is_active?: boolean;
}) => {
  const queryString = buildQueryString(filters);
  return useGet<UsersWithTeamsResponse>(
    ["users", JSON.stringify(filters ?? {})],
    `/users/${queryString}`,
  );
};

export const useUserById = (id: string) =>
  useGet<UserWithTeams>(["users", id], `/users/${id}`);

export const useCreateUser = () =>
  usePost<ApiResponse<null>, UserFormData>("/users", ["users"]);

export const useUpdateUser = (id: string) =>
  usePut<ApiResponse<null>, UserFormData>(`/users/${id}`, ["users", id]);

export const useDeleteUser = () => useDynamicDelete<ApiResponse<null>>();

export const useUserTeams = (userId: string) =>
  useGet<{ data: { id: string; name: string }[] }>(
    ["users", userId, "teams"],
    `/users/${userId}/teams/`,
  );

export const useAssignUserToTeam = () =>
  usePost<ApiResponse<null>, { user_id: string; team_id: string }>(
    "/users/assign-team/",
    ["users"],
  );

export const useRemoveUserFromTeam = () =>
  useDynamicDelete<ApiResponse<null>>();
