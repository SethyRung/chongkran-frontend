export type ShoppingItem = {
  name: string;
  quantity: string;
  checked: boolean;
};

export type ShoppingListResponse = {
  id: string;
  userId: string;
  items: ShoppingItem[];
  createdAt: string;
};

export type CreateShoppingListDto = {
  items: ShoppingItem[];
};

export type UpdateShoppingListDto = {
  items?: ShoppingItem[];
};
