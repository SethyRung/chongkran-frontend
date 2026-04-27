import type { CreateRecipeDto, RecipeResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateRecipeDto>(event);

  return proxy<RecipeResponse>(event, "/recipes", {
    method: "post",
    body,
  });
});
