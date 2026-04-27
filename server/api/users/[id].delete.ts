export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "User ID is required",
      },
      null,
    );
  }

  return proxy<string>(event, `/users/${id}`, {
    method: "delete",
  });
});
