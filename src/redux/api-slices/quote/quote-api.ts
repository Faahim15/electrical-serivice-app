import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  CreateServiceCallPayload,
  CreateServiceCallResponse,
  GetServiceCallsResponse,
} from "@/src/types/quotes.api.types";

// ─── API ──────────────────────────────────────────────────────────────────────

const quoteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceCalls: builder.query<GetServiceCallsResponse, void>({
      query: () => ({
        url: "/service-calls/my",
        method: "GET",
      }),
      providesTags: [TagTypes.User],
    }),

    createServiceCall: builder.mutation<
      CreateServiceCallResponse,
      CreateServiceCallPayload
    >({
      query: (body) => ({
        url: "/service-calls",
        method: "POST",
        body,
      }),
      invalidatesTags: [TagTypes.User],
    }),
  }),
});

export const { useGetServiceCallsQuery, useCreateServiceCallMutation } =
  quoteApi;
