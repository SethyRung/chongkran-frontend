import type { H3Event } from "h3";
import type { NitroFetchRequest, NitroFetchOptions } from "nitropack";

export function proxy<T>(
  event: H3Event,
  req: NitroFetchRequest,
  opts: NitroFetchOptions<
    NitroFetchRequest,
    "get" | "post" | "put" | "delete" | "patch" | "options" | "head"
  > = {},
) {
  const config = useRuntimeConfig();

  const token = getCookie(event, CookieName.AccessToken);

  try {
    return $fetch<ApiResponse<T>>(req, {
      ...opts,
      baseURL: config.public.baseURL,
      headers: {
        ...opts.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  } catch {
    return Promise.resolve(
      createResponse<T>(
        {
          code: ApiResponseCode.InternalError,
          message: "An error occurred while processing the request.",
        },
        null as any,
      ),
    );
  }
}
