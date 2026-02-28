"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  keepPreviousData,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import apiClient from "@/api/client";
import { ApiError, ApiPaginatedResponse, PaginationParams } from "@/types";

type QueryKey = (string | Record<string, any>)[];

type UseApiOptions<TQueryFnData, TData = TQueryFnData> = Omit<
  UseQueryOptions<TQueryFnData, ApiError, TData, QueryKey>,
  "queryKey" | "queryFn"
>;

function useGet<T>(key: QueryKey, url: string, options?: UseApiOptions<T>) {
  return useQuery<T, ApiError, T, QueryKey>({
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient.get<T>(url);
      return response.data;
    },
    ...options,
  });
}

function useGetPaginated<T>(
  key: QueryKey,
  url: string,
  params: PaginationParams = {},
  options?: UseApiOptions<ApiPaginatedResponse<T>>,
) {
  const { page = 1, limit = 25, ...restParams } = params;

  return useQuery<
    ApiPaginatedResponse<T>,
    ApiError,
    ApiPaginatedResponse<T>,
    QueryKey
  >({
    queryKey: [...key, { page, limit, ...restParams }],
    queryFn: async () => {
      const response = await apiClient.get<ApiPaginatedResponse<T>>(url, {
        params: { page, limit, ...restParams },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
    ...options,
  });
}

function useInfinitePaginated<T>(
  key: QueryKey,
  url: string,
  params: Omit<PaginationParams, "page"> = {},
  options?: Omit<
    UseInfiniteQueryOptions<
      ApiPaginatedResponse<T>,
      ApiError,
      { pages: ApiPaginatedResponse<T>[]; pageParams: number[] },
      QueryKey,
      number
    >,
    "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
  >,
) {
  return useInfiniteQuery({
    queryKey: [...key, params],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const response = await apiClient.get<ApiPaginatedResponse<T>>(url, {
        params: { page: pageParam, ...params },
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, page_size, total } = lastPage.data;
      const totalPages = Math.ceil(total / page_size);
      return page < totalPages ? page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) =>
      firstPage.data.page > 1 ? firstPage.data.page - 1 : undefined,
    ...options,
  });
}

function useApiMutation<TData, TVariables>(
  method: "post" | "put" | "patch" | "delete",
  url: string,
  invalidateKey?: QueryKey,
) {
  const queryClient = useQueryClient();

  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      let response;

      if (method === "delete") {
        response = await apiClient.delete<TData>(url, {
          data: variables,
        });
      } else {
        response = await apiClient[method]<TData>(url, variables);
      }
      return response.data;
    },
    onSuccess: () => {
      const key = invalidateKey ?? [url.split("/")[1]];
      queryClient.invalidateQueries({ queryKey: key, exact: false });
    },
  });
}

function usePost<TData, TVariables = unknown>(
  url: string,
  invalidateKey?: QueryKey,
) {
  return useApiMutation<TData, TVariables>("post", url, invalidateKey);
}

function usePut<TData, TVariables = unknown>(
  url: string,
  invalidateKey?: QueryKey,
) {
  return useApiMutation<TData, TVariables>("put", url, invalidateKey);
}

function usePatch<TData, TVariables = unknown>(
  url: string,
  invalidateKey?: QueryKey,
) {
  return useApiMutation<TData, TVariables>("patch", url, invalidateKey);
}

function useDelete<TData, TVariables = unknown>(
  url: string,
  invalidateKey?: QueryKey,
) {
  return useApiMutation<TData, TVariables>("delete", url, invalidateKey);
}

function useDynamicDelete<TData>() {
  const queryClient = useQueryClient();

  return useMutation<TData, ApiError, string>({
    mutationFn: async (url: string) => {
      const response = await apiClient.delete<TData>(url);
      return response.data;
    },
    onSuccess: (_, url) => {
      const segments = url.split("/").filter(Boolean);
      const mainKey = [segments[0]];
      queryClient.invalidateQueries({ queryKey: mainKey, exact: false });
    },
  });
}

export {
  useGet,
  useGetPaginated,
  useInfinitePaginated,
  usePost,
  usePut,
  usePatch,
  useDelete,
  useDynamicDelete,
};
