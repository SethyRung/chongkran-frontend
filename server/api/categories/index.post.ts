import type { CreateCategoryDto, CategoryResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateCategoryDto>(event);

  return proxy<CategoryResponse>(event, "/categories", {
    method: "post",
    body,
  });
});
