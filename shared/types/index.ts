// Base User Profile Type
export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  role: "user" | "author" | "admin";
};

// Author Type (extends UserProfile)
export interface Author extends UserProfile {
  role: "author";
  bio?: string;
  expertise?: string[];
  avatar?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  followersCount?: number;
  followingCount?: number;
  recipesCount?: number;
  totalViews?: number;
  totalLikes?: number;
  isFollowing?: boolean;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}

// Recipe Types
export type Recipe = {
  id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  steps: string[];
  author: string | Author;
  tags: string[];
  image: string;
  cookTime: number;
  likes: number;
  views: number;
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "approved" | "rejected";
  category: string;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
};

export type Ingredient = {
  name: string;
  quantity: string;
};

// Author Statistics
export interface AuthorStats {
  authorId: string;
  followersCount: number;
  followingCount: number;
  recipesCount: number;
  totalViews: number;
  totalLikes: number;
  averageDifficulty: number;
  engagementRate?: number;
  recentViews?: number;
  recentLikes?: number;
}

// Follow System Types
export interface Follow {
  id: string;
  follower: string | Author;
  following: string | Author;
  createdAt: string;
}

export interface FollowStats {
  followersCount: number;
  followingCount: number;
}

export interface FollowRequest {
  id: string;
  requester: string | Author;
  target: string | Author;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

// Category Type
export type Category = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Pagination Type
export type Paginated<T> = {
  content: T[];
  total: number;
  page: number;
  lastPage: number;
};

// Response Type
export type Response<T> = {
  status: {
    code: string;
    message: string;
    requestId: string;
    requestTime: number;
  };
  data: T;
};

// Type alias for backward compatibility
export type PaginatedResponse<T> = Paginated<T>;
