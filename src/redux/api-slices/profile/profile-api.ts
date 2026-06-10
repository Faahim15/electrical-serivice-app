import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/src/types/profile.api.types";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<
      { success: boolean; message: string },
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/api/v1/user/change-password",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [TagTypes.User],
    }),

    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (body) => ({
        url: "/api/v1/user/update-user-data",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [TagTypes.Profile],
    }),
  }),
});

export const { useChangePasswordMutation, useUpdateProfileMutation } =
  profileApi;
