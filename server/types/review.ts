export type ReviewResponse = {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateReviewDto = {
  rating: number;
  comment: string;
};

export type UpdateReviewDto = {
  rating?: number;
  comment?: string;
};
