import { appendResponseHeader } from "h3";
import type { NitroFetchRequest, NitroFetchOptions } from "nitropack";

export function useApi<T>(
  req: NitroFetchRequest,
  opts: NitroFetchOptions<
    NitroFetchRequest,
    "get" | "post" | "put" | "delete" | "patch" | "options" | "head"
  > = {},
) {
  const event = useRequestEvent();
  const headers = useRequestHeaders(["cookie"]);

  return $fetch<ApiResponse<T>>(req, {
    ...opts,
    headers: { ...headers, ...opts.headers },
    onResponse(context) {
      if (!event) return;
      const cookies = context.response.headers.getSetCookie();
      for (const cookie of cookies) {
        appendResponseHeader(event, "set-cookie", cookie);
      }
    },
  });
}
