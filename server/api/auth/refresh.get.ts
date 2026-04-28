export default defineEventHandler(async (event) => {
  const res = await refreshToken(event);

  return { ...res, data: null } as ApiResponse<null>;
});
