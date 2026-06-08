import { baseApi } from "@/src/redux/services/base-api";
import { SignupRequest, SignupResponse } from "@/src/types/auth.api.types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (body) => ({
        url: "/api/v1/user/signup",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSignupMutation } = authApi;
