import type { ReviewResponse } from "#server/types";

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

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  return proxy<ReviewResponse[]>(event, `/reviews/recipe/${recipeId}`, {
    query: { page, limit },
  });
});
