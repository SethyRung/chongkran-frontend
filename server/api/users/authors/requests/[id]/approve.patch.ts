export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Request ID is required",
      },
      null,
    );
  }

  return proxy<string>(event, `/users/authors/requests/${id}/approve`, {
    method: "patch",
  });
});
