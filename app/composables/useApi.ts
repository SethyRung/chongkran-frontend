import { appendResponseHeader } from "h3";

export async function useApi<T>(url: string) {
  const event = useRequestEvent();
  const headers = useRequestHeaders(["cookie"]);

  const res = await $fetch.raw<T>(url, { headers });

  if (event) {
    const cookies = res.headers.getSetCookie();

    for (const cookie of cookies) {
      appendResponseHeader(event, "set-cookie", cookie);
    }
  }

  return res._data;
}
