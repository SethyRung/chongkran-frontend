import type { FollowDto } from "#server/types";

export default defineEventHandler(async (event) => {
  const body = await readBody<FollowDto>(event);

  return proxy(event, "/follows", {
    method: "delete",
    body,
  });
});
