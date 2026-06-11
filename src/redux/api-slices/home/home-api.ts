import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import { GetProfileResponse } from "@/src/types/home.api.types";

const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: [TagTypes.Profile],
    }),
  }),
});

export const { useGetProfileQuery } = homeApi;
