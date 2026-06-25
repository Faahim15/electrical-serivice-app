import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import type {
  QuoteDetailsApiResponse,
  QuotesApiResponse,
} from "@/src/types/quotes.types";

const quotesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyQuotes: builder.query<QuotesApiResponse, void>({
      query: () => ({
        url: "/quotes",
        method: "GET",
      }),
      providesTags: [TagTypes.QUOTES],
    }),

    getQuoteDetails: builder.query<QuoteDetailsApiResponse, string>({
      query: (id) => ({
        url: `/quotes/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: TagTypes.QUOTES, id }],
    }),
  }),
});

export const { useGetMyQuotesQuery, useGetQuoteDetailsQuery } = quotesApi;
export default quotesApi;
