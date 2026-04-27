import type { UserResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = Number(query.limit) || 10;

  return proxy<UserResponse[]>(event, "/users/authors/popular", {
    query: { limit },
  });
});
