export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Category ID is required",
      },
      null,
    );
  }

  return proxy<string>(event, `/categories/${id}`, {
    method: "delete",
  });
});
