import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import { TermsAndConditionsResponse } from "@/src/types/terms.types";

const termsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTermsAndConditions: builder.query<TermsAndConditionsResponse, void>({
      query: () => ({
        url: "/app-content/terms-and-conditions",
        method: "GET",
      }),
      providesTags: [TagTypes.Terms],
    }),
  }),
});

export const { useGetTermsAndConditionsQuery } = termsApi;
export default termsApi;
