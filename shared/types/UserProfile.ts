export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  role: "user" | "author" | "admin";
};
