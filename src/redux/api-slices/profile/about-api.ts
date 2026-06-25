import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import { AboutUsResponse } from "@/src/types/about.types";

const aboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAboutUs: builder.query<AboutUsResponse, void>({
      query: () => ({
        url: "/app-content/about-us",
        method: "GET",
      }),
      providesTags: [TagTypes.AboutUs],
    }),
  }),
});

export const { useGetAboutUsQuery } = aboutApi;
export default aboutApi;
