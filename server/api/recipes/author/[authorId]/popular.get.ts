import type { RecipeResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const authorId = getRouterParam(event, "authorId");
  const query = getQuery(event);
  const limit = Number(query.limit) || 5;

  if (!authorId) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Author ID is required",
      },
      null,
    );
  }

  return proxy<RecipeResponse[]>(event, `/recipes/author/${authorId}/popular`, {
    query: { limit },
  });
});
