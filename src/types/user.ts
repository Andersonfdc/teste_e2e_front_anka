export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  GUEST = "GUEST",
}

export const UserRoleNames: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.MEMBER]: "Membro",
  [UserRole.GUEST]: "Convidado",
};

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  isActive: boolean;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserPasswordConfig {
  resetManually?: boolean;
  sendResetEmail?: boolean;
  password?: string;
}

