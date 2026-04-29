import type { FollowingResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "userId");
  const query = getQuery(event);
  const offset = Number(query.offset) || 0;
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

  return proxy<FollowingResponse>(event, `/follows/following/${userId}`, {
    query: { offset, limit },
  });
});
