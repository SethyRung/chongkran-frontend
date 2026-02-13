import type { NitroFetchOptions } from "nitropack";
import type { Response } from "#shared/types";

/**
 * Makes an API call to the backend
 * @param url - The endpoint path (e.g., "/auth/login")
 * @param options - Fetch options including method, body, query, etc.
 * @returns Promise with Response wrapper containing status, data, requestId, requestTime
 *
 * @example
 * ```ts
 * const response = await fetchApi<{ accessToken: string; refreshToken: string }>("/auth/login", {
 *   method: "POST",
 *   body: { email: "user@example.com", password: "secret123" },
 * });
 *
 * if (response.status.code === StatusCode.OK) {
 *   // Access response.data.accessToken and response.data.refreshToken
 * }
 * ```
 */
export const fetchApi = async <T>(
  url: string,
  options: NitroFetchOptions<
    string,
    "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace"
  >,
): Promise<Response<T>> => {
  return useNuxtApp().$api(url, options);
};
