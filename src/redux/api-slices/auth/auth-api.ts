import { baseApi } from "@/src/redux/services/base-api";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResendForgotPasswordOtpRequest,
  ResendForgotPasswordOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SigninRequest,
  SigninResponse,
  SignupRequest,
  SignupResponse,
  VerifyForgotPasswordOtpRequest,
  VerifyForgotPasswordOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/src/types/auth.api.types";
import * as SecureStore from "expo-secure-store";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (body) => ({
        url: "/api/v1/user/signup",
        method: "POST",
        body,
      }),
    }),

    signin: builder.mutation<SigninResponse, SigninRequest>({
      query: (body) => ({
        url: "/api/v1/user/signin",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          await SecureStore.setItemAsync("token", data.data.accessToken);
          await SecureStore.setItemAsync(
            "refreshToken",
            data.data.refreshToken,
          );
        } catch {
          // signin failed — nothing to store
        }
      },
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/api/v1/user/verify-signup-otp",
        method: "POST",
        body,
      }),
    }),

    resendOtp: builder.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: (body) => ({
        url: "/api/v1/user/send-signup-otp-again",
        method: "POST",
        body,
      }),
    }),

    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/api/v1/user/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resendForgotPasswordOtp: builder.mutation<
      ResendForgotPasswordOtpResponse,
      ResendForgotPasswordOtpRequest
    >({
      query: (body) => ({
        url: "/api/v1/user/send-forgot-password-otp-again",
        method: "POST",
        body,
      }),
    }),

    verifyForgotPasswordOtp: builder.mutation<
      VerifyForgotPasswordOtpResponse,
      VerifyForgotPasswordOtpRequest
    >({
      query: (body) => ({
        url: "/api/v1/user/verify-forgot-password-otp",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: "/api/v1/user/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResendForgotPasswordOtpMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
} = authApi;
