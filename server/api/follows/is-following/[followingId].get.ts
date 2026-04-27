import type { IsFollowingResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const followingId = getRouterParam(event, "followingId");

  if (!followingId) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Following ID is required",
      },
      null,
    );
  }

  return proxy<IsFollowingResponse>(event, `/follows/is-following/${followingId}`);
});
