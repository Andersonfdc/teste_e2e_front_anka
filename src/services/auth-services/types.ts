import { z } from "zod/v4";
import { tokenModel } from "./schemas";

// Token model type inferred from Zod
export type TokenModel = z.infer<typeof tokenModel>;
// Login
export interface LoginResponse {
  status: true;
  message: string;
  challengeId: number;
}

// Verify OTP
export interface VerifyOtpResponse {
  status: true;
  message: string;
  user: TokenModel;
  accessToken: string;
  refreshToken: string;
}

// Resend OTP
export interface ResendOtpResponse {
  status: true;
  message: string;
}

// Forgot Password
export interface ForgotPasswordResponse {
  status: true;
  message: string;
}

// Validate Token
export interface ValidateTokenResponse {
  status: true;
  message: string;
}
// Reset Password
export interface ResetPasswordResponse {
  status: true;
  message: string;
}

// Me
export interface MeResponse {
  status: true;
  message: string;
  user: TokenModel;
}
