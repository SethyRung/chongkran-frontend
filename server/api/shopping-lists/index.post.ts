import type { CreateShoppingListDto, ShoppingListResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateShoppingListDto>(event);

  return proxy<ShoppingListResponse>(event, "/shopping-lists", {
    method: "post",
    body,
  });
});
