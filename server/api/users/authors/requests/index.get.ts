import type { AuthorRequest } from "#shared/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const offset = Number(query.offset) || 0;
  const limit = Number(query.limit) || 10;
  const rawStatus = query.status as string | undefined;
  const status =
    rawStatus && rawStatus !== "all"
      ? (rawStatus as "pending" | "approved" | "rejected")
      : undefined;

  return proxy<AuthorRequest[]>(event, "/users/authors/requests", {
    query: { offset, limit, status },
  });
});
