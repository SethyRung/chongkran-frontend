import type { ShoppingListResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  return proxy<ShoppingListResponse>(event, "/shopping-lists");
});
