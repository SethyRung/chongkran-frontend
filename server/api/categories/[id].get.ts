import type { CategoryResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Category ID is required",
      },
      null,
    );
  }

  return proxy<CategoryResponse>(event, `/categories/${id}`);
});
