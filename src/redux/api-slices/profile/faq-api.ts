import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import { FAQResponse } from "@/src/types/faq.types";

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFAQs: builder.query<FAQResponse, void>({
      query: () => ({
        url: "/faqs",
        method: "GET",
      }),
      providesTags: [TagTypes.FAQ],
    }),
  }),
});

export const { useGetFAQsQuery } = faqApi;
export default faqApi;
