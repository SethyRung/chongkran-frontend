import { Role } from "#shared/types";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};
