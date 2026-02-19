import api, { publicApi } from "@/services/api";
import type {
  LoginResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
  ForgotPasswordResponse,
  ValidateTokenResponse,
  ResetPasswordResponse,
  MeResponse,
} from "./types";
import { HandleApiErrors } from "@/services/api/error-decorator";

class AuthRoutes {
  @HandleApiErrors
  async login(payload: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    const res = await publicApi.post<LoginResponse>("/auth/login", payload);
    return res.data;
  }

  @HandleApiErrors
  async verifyOtp(payload: {
    challengeId: number;
    code: string;
    rememberMe?: boolean;
  }): Promise<VerifyOtpResponse> {
    const res = await publicApi.post<VerifyOtpResponse>(
      "/auth/otp/verify",
      payload,
    );
    return res.data;
  }

  @HandleApiErrors
  async resendOtp(payload: {
    challengeId: number;
  }): Promise<ResendOtpResponse> {
    const res = await publicApi.post<ResendOtpResponse>(
      "/auth/otp/resend",
      payload,
    );
    return res.data;
  }

  @HandleApiErrors
  async forgotPassword(payload: {
    email: string;
  }): Promise<ForgotPasswordResponse> {
    const res = await publicApi.post<ForgotPasswordResponse>(
      "/auth/password/forgot",
      payload,
    );
    return res.data;
  }

  @HandleApiErrors
  async validateResetToken(params: {
    token: string;
  }): Promise<ValidateTokenResponse> {
    const res = await publicApi.get<ValidateTokenResponse>(
      "/auth/password/validate",
      { params },
    );
    return res.data;
  }

  @HandleApiErrors
  async resetPassword(payload: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ResetPasswordResponse> {
    const res = await publicApi.post<ResetPasswordResponse>(
      "/auth/password/reset",
      payload,
    );
    return res.data;
  }

  @HandleApiErrors
  async me(): Promise<MeResponse> {
    try {
      const res = await api.get<MeResponse>("/auth/me");
      return res.data;
    } catch (error) {
      console.log("❌ me: API call failed", error);
      throw error;
    }
  }
}

const authRoutes = new AuthRoutes();
export default authRoutes;
