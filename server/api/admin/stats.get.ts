import type { AdminStatsResponse } from "~~/shared/types";

export default defineEventHandler(async (event) => {
  return proxy<AdminStatsResponse>(event, "/admin/stats");
});
