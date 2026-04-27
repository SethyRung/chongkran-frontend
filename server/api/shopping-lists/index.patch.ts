import type { UpdateShoppingListDto, ShoppingListResponse } from "#server/types";

export default defineEventHandler(async (event) => {
  const body = await readBody<UpdateShoppingListDto>(event);

  return proxy<ShoppingListResponse>(event, "/shopping-lists", {
    method: "patch",
    body,
  });
});
