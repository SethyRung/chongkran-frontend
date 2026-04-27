import type { UserResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const q = query.q as string;
  const limit = Number(query.limit) || 20;

  if (!q) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Query parameter 'q' is required",
      },
      null,
    );
  }

  return proxy<UserResponse[]>(event, "/users/authors/search", {
    query: { q, limit },
  });
});
