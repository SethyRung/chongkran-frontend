import type { H3Event } from "h3";
import type { NitroFetchRequest, NitroFetchOptions } from "nitropack";

export async function proxy<T>(
  event: H3Event,
  req: NitroFetchRequest,
  opts: NitroFetchOptions<
    NitroFetchRequest,
    "get" | "post" | "put" | "delete" | "patch" | "options" | "head"
  > = {},
) {
  const config = useRuntimeConfig();

  function makeRequest(accessToken?: string) {
    const token = accessToken ?? getCookie(event, CookieName.AccessToken);

    return $fetch<ApiResponse<T>>(req, {
      ...opts,
      baseURL: config.baseURL,
      headers: {
        ...opts.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  }

  try {
    const res = await makeRequest();

    if (res.status.code === ApiResponseCode.Unauthorized) {
      const refreshed = await refreshToken(event);

      if (refreshed.status.code === ApiResponseCode.Success) {
        return makeRequest(refreshed.data?.accessToken);
      }
    }

    return res;
  } catch {
    return createResponse<T>(
      {
        code: ApiResponseCode.InternalError,
        message: "An error occurred while processing the request.",
      },
      null as any,
    );
  }
}
