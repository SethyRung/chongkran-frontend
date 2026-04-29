import type { UserResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const offset = Number(query.offset) || 0;
  const limit = Number(query.limit) || 10;

  return proxy<UserResponse[]>(event, "/users", {
    query: { offset, limit },
  });
});
