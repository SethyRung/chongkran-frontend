import type { UpdateReviewDto, RecipeResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody<UpdateReviewDto>(event);

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Review ID is required",
      },
      null,
    );
  }

  return proxy<RecipeResponse>(event, `/reviews/${id}`, {
    method: "patch",
    body,
  });
});
