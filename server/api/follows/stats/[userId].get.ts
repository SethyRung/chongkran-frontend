import type { FollowStatsResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "userId");

  if (!userId) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "User ID is required",
      },
      null,
    );
  }

  return proxy<FollowStatsResponse>(event, `/follows/stats/${userId}`);
});
