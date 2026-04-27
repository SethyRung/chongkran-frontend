import type { AuthorRequest } from "#server/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const status = query.status as "pending" | "approved" | "rejected" | undefined;

  return proxy<AuthorRequest[]>(event, "/users/authors/requests", {
    query: { page, limit, status },
  });
});
