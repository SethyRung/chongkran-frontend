import type { RecipeResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string;
  const status = query.status as string;

  if (!id || !status) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Recipe ID and status are required",
      },
      null,
    );
  }

  return proxy<RecipeResponse>(event, "/recipes/update-status", {
    method: "put",
    query: { id, status },
  });
});
