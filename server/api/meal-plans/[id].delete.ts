export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Meal plan ID is required",
      },
      null,
    );
  }

  return proxy<string>(event, `/meal-plans/${id}`, {
    method: "delete",
  });
});
