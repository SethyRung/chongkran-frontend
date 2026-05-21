export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Shopping list ID is required",
      },
      null,
    );
  }

  return proxy<string>(event, `/shopping-lists/${id}`, {
    method: "delete",
  });
});
