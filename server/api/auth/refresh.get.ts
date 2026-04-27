import { AuthResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const res = await proxy<AuthResponse>(event, "/auth/refresh", {
    method: "post",
    body: {
      refreshToken: getCookie(event, CookieName.RefreshToken) || "",
    },
  });

  const isProduction = !import.meta.dev;

  if (res.status.code === ApiResponseCode.Success) {
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

    return {
      ...res,
      data: null,
    };
  }

  return res;
});
