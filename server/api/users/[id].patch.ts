import type { UpdateUserDto } from "#server/types";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody<UpdateUserDto>(event);

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
    method: "patch",
    body,
  });
});
