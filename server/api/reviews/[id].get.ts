import type { ReviewResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Review ID is required",
      },
      null,
    );
  }

  return proxy<ReviewResponse>(event, `/reviews/${id}`);
});
