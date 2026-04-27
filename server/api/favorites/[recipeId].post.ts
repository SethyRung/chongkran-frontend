import type { FavoriteResponse } from "#server/types";

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

  return proxy<FavoriteResponse>(event, `/favorites/${recipeId}`, {
    method: "post",
  });
});
