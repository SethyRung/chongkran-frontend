import type { ReviewResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const offset = Number(query.offset) || 0;
  const limit = Number(query.limit) || 10;
  const search = query.search as string | undefined;
  const ratingMin = query.ratingMin ? Number(query.ratingMin) : undefined;
  const ratingMax = query.ratingMax ? Number(query.ratingMax) : undefined;

  return proxy<ReviewResponse[]>(event, "/reviews", {
    query: { offset, limit, search, ratingMin, ratingMax },
  });
});
