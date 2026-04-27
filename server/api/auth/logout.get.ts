export default defineEventHandler(async (event) => {
  const res = await proxy<string>(event, "/auth/logout", {
    method: "post",
    body: {
      refreshToken: getCookie(event, CookieName.RefreshToken) || "",
    },
  });

  if (res.status.code === ApiResponseCode.Success) {
    deleteCookie(event, CookieName.AccessToken);
    deleteCookie(event, CookieName.RefreshToken);
  }

  return res;
});
