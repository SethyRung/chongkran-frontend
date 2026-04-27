export enum ApiResponseCode {
  Success = "SUCCESS",
  Error = "ERROR",
  NotFound = "NOT_FOUND",
  ValidationError = "VALIDATION_ERROR",
  Unauthorized = "UNAUTHORIZED",
  Forbidden = "FORBIDDEN",
  InvalidRequest = "INVALID_REQUEST",
  InternalError = "INTERNAL_ERROR",
}

export interface ApiResponse<T> {
  status: {
    code: ApiResponseCode;
    message: string;
    requestId: string;
    requestTime: number;
  };
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

export enum CookieName {
  AccessToken = "access_token",
  RefreshToken = "refresh_token",
}

export enum Role {
  Admin = "admin",
  Author = "author",
  User = "user",
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
