import type { H3Event } from "h3";
import type { AuthResponse } from "#server/types";

export async function refreshToken(event: H3Event) {
  const config = useRuntimeConfig();
  const refreshToken = getCookie(event, CookieName.RefreshToken);

  if (!refreshToken) {
    return createResponse(
      { code: ApiResponseCode.Unauthorized, message: "No refresh token" },
      null,
    );
  }

  try {
    const res = await $fetch<ApiResponse<AuthResponse>>("/auth/refresh", {
      method: "post",
      baseURL: config.baseURL,
      body: { refreshToken },
    });

    if (res.status.code === ApiResponseCode.Success && res.data) {
      const isProduction = !import.meta.dev;

      setCookie(event, CookieName.AccessToken, res.data.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: expiresInToSeconds(config.jwt.access.expiresIn),
      });

      setCookie(event, CookieName.RefreshToken, res.data.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: expiresInToSeconds(config.jwt.refresh.expiresIn),
      });
    } else {
      deleteCookie(event, CookieName.AccessToken);
      deleteCookie(event, CookieName.RefreshToken);
    }

    return res;
  } catch {
    return createResponse(
      { code: ApiResponseCode.InternalError, message: "Failed to refresh token" },
      null,
    );
  }
}
