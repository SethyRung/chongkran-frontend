export type IngredientDto = {
  name: string;
  quantity: string;
};

export type RecipeResponse = {
  id: string;
  title: string;
  description?: string;
  ingredients: IngredientDto[];
  steps: string[];
  author: string;
  tags: string[];
  image: string;
  cookTime: number;
  likes?: number;
  views?: number;
  difficulty: "easy" | "medium" | "hard";
  status?: "pending" | "approved" | "rejected";
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateRecipeDto = {
  title: string;
  description?: string;
  ingredients: IngredientDto[];
  steps: string[];
  tags: string[];
  image: string;
  cookTime: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
};

export type UpdateRecipeDto = {
  title?: string;
  description?: string;
  ingredients?: IngredientDto[];
  steps?: string[];
  tags?: string[];
  image?: string;
  cookTime?: number;
  difficulty?: "easy" | "medium" | "hard";
  category?: string;
};
