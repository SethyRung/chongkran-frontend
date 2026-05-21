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

export interface PaginationQuery {
  offset: number;
  limit: number;
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
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "author" | "user";
  avatar?: string;
  bio?: string;
  gender?: string;
  dateOfBirth?: string;
  expertise?: string[];
  followersCount?: number;
  followingCount?: number;
  recipesCount?: number;
  totalViews?: number;
  totalLikes?: number;
  favoriteRecipes?: string[];
  authorRequestStatus?: "pending" | "approved" | "rejected";
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  expertise?: string[];
  followersCount?: number;
  recipesCount?: number;
}

export interface AuthorRequestUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface AuthorRequest {
  id: string;
  user: AuthorRequestUser;
  status: "pending" | "approved" | "rejected";
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  steps: string[];
  author: string | Author;
  authorName?: string;
  authorAvatar?: string;
  authorBio?: string;
  tags: string[];
  image: string;
  cookTime: number;
  likes?: number;
  views?: number;
  difficulty: "easy" | "medium" | "hard";
  status?: "pending" | "approved" | "rejected";
  category: string | Category;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeWithAuthor extends Omit<Recipe, "author" | "category"> {
  author: Author;
  category: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowStats {
  followersCount: number;
  followingCount: number;
}

export interface MealPlanRecipeEntry {
  recipeId: string;
  day: string;
  mealType: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  title: string;
  recipes: MealPlanRecipeEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingItem {
  name: string;
  quantity: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  userId: string;
  items: ShoppingItem[];
  createdAt: string;
}

export interface AdminStatsSummary {
  totalUsers: number;
  totalRecipes: number;
  totalPendingRecipes: number;
  totalPendingAuthorRequests: number;
  totalReviews: number;
}

export interface AdminRoleCount {
  role: string;
  count: number;
}

export interface AdminDailyCount {
  date: string;
  count: number;
}

export interface AdminPopularRecipe {
  id: string;
  title: string;
  image?: string;
  views: number;
  likes: number;
}

export interface AdminActivityItem {
  type: "user" | "recipe" | "review";
  description: string;
  timestamp?: string;
}

export interface AdminRecentAuthorRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface AdminRecentPendingRecipe {
  id: string;
  title: string;
  image?: string;
  authorName?: string;
  createdAt: string;
}

export interface AdminStatsResponse {
  totalUsers: number;
  totalRecipes: number;
  totalPendingRecipes: number;
  totalPendingAuthorRequests: number;
  totalReviews: number;
  recentPendingRecipes: AdminRecentPendingRecipe[];
  recentPendingAuthorRequests: AdminRecentAuthorRequest[];
  usersByRole: AdminRoleCount[];
  userTrendSeries: AdminDailyCount[];
  recipeTrendSeries: AdminDailyCount[];
  popularRecipes: AdminPopularRecipe[];
  recentActivity: AdminActivityItem[];
}
