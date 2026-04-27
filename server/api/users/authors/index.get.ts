import type { UserResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search as string | undefined;
  const expertise = query.expertise as string | undefined;

  return proxy<UserResponse[]>(event, "/users/authors", {
    query: { page, limit, search, expertise },
  });
});
