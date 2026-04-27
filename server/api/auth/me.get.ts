import { CurrentUser } from "#server/types";

export default defineEventHandler(async (event) => {
  return proxy<CurrentUser>(event, "/auth/me");
});
