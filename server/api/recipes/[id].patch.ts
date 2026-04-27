import type { UpdateRecipeDto, RecipeResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody<UpdateRecipeDto>(event);

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Recipe ID is required",
      },
      null,
    );
  }

  return proxy<RecipeResponse>(event, `/recipes/${id}`, {
    method: "patch",
    body,
  });
});
