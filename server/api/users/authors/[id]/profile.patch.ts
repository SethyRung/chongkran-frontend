import type { UpdateAuthorProfileDto, UserResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody<UpdateAuthorProfileDto>(event);

  if (!id) {
    return createResponse(
      {
        code: ApiResponseCode.ValidationError,
        message: "Author ID is required",
      },
      null,
    );
  }

  return proxy<UserResponse>(event, `/users/authors/${id}/profile`, {
    method: "patch",
    body,
  });
});
