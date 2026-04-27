export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Recipe ID is required",
      },
      null,
    );
  }

  return proxy<string>(event, `/recipes/${id}/view`, {
    method: "put",
  });
});
