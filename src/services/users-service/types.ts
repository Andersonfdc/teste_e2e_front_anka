import { User, UserPasswordConfig, UserRole } from "@/types/user";

export interface CreateUserRequest {
  name: string;
  email: string;
  role: UserRole;
  passwordConfig?: UserPasswordConfig;
}

export interface CreateUserResponse {
  status: true;
  message: string;
  data: User;
}

export interface FetchUsersRequest {
  page: number;
  limit: number;
}

export interface FetchUsersResponse {
  status: true;
  message: string;
  data: User[];
}

export interface EditUserRequest {
  name?: string;
  email?: string;
  toggleStatus?: boolean;
  role?: UserRole;
  passwordConfig?: UserPasswordConfig;
}

export interface EditUserResponse {
  status: true;
  message: string;
  data: User;
}

export interface ChangeUserRoleResponse {
  status: true;
  message: string;
}

export interface ToggleUserStatusResponse {
  status: true;
  message: string;
}

export interface ErrorResponse {
  status: boolean;
  message: string;
  code?: string;
}
