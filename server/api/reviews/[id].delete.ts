export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Review ID is required",
      },
      null,
    );
  }

  return proxy<string>(event, `/reviews/${id}`, {
    method: "delete",
  });
});
