export interface SignupRequest {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface VerifyOtpRequest {
  userEmail: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
}

export interface ResendOtpRequest {
  userEmail: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  role: string;
}

export interface SigninResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

export interface ResendForgotPasswordOtpRequest {
  token: string;
}

export interface ResendForgotPasswordOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyForgotPasswordOtpRequest {
  token: string;
  otp: string;
}

export interface VerifyForgotPasswordOtpResponse {
  success: boolean;
  message: string;
  data: {
    resetPasswordToken: string;
  };
}
export interface ResetPasswordRequest {
  resetPasswordToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
