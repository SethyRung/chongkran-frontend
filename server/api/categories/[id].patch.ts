import type { UpdateCategoryDto, CategoryResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody<UpdateCategoryDto>(event);

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Category ID is required",
      },
      null,
    );
  }

  return proxy<CategoryResponse>(event, `/categories/${id}`, {
    method: "patch",
    body,
  });
});
