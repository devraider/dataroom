export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  picture?: string;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  READER = "reader",
}
