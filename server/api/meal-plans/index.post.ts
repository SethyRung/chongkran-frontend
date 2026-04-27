import type { CreateMealPlanDto, MealPlanResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateMealPlanDto>(event);

  return proxy<MealPlanResponse>(event, "/meal-plans", {
    method: "post",
    body,
  });
});
