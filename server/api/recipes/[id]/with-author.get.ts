import type { RecipeResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Recipe ID is required",
      },
      null,
    );
  }

  return proxy<RecipeResponse>(event, `/recipes/${id}/with-author`);
});
