export interface ApiStatus {
  code: string;
  message: string;
  requestId: string;
  requestTime: number;
}

export interface ApiResponse<T> {
  status: ApiStatus;
  data: T;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "author" | "user";
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  recipesCount?: number;
  followersCount?: number;
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  author: string | Author;
  tags: string[];
  image: string;
  cookTime: number;
  likes: string[];
  views: number;
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "approved" | "rejected";
  category: string | Category;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeWithAuthor extends Omit<Recipe, "author" | "category"> {
  author: Author;
  category: Category;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: string | User;
  recipe: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
