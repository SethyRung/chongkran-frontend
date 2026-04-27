import type { CreateReviewDto, ReviewResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const recipeId = getRouterParam(event, "recipeId");

  if (!recipeId) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Recipe ID is required",
      },
      null,
    );
  }

  const body = await readBody<CreateReviewDto>(event);

  return proxy<ReviewResponse>(event, `/reviews/${recipeId}`, {
    method: "post",
    body,
  });
});
