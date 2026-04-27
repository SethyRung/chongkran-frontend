import type { UserResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Author ID is required",
      },
      null,
    );
  }

  return proxy<UserResponse>(event, `/users/authors/${id}`);
});
