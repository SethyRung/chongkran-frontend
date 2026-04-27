import type { MealPlanResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  return proxy<MealPlanResponse[]>(event, "/meal-plans", {
    query: { page, limit },
  });
});
