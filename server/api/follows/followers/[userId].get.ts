import type { FollowersResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "userId");
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  if (!userId) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "User ID is required",
      },
      null,
    );
  }

  return proxy<FollowersResponse>(event, `/follows/followers/${userId}`, {
    query: { page, limit },
  });
});
