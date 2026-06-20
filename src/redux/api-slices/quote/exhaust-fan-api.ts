import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  ExhaustFanResponse,
  GetExhaustFanByIdResponse,
  GetMyExhaustFansResponse,
} from "@/src/types/quotes/exhaust-fan.api.types";

const exhaustFanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Exhaust Fan ──────────────────────────────────────────────────
    createExhaustFan: builder.mutation<ExhaustFanResponse, FormData>({
      query: (formData) => ({
        url: "/exhaust-fans",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.ExhaustFan],
    }),

    // ─── Update Exhaust Fan ──────────────────────────────────────────────────
    updateExhaustFan: builder.mutation<
      ExhaustFanResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/exhaust-fans/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.ExhaustFan],
    }),

    // ─── Get My Exhaust Fans ─────────────────────────────────────────────────
    getMyExhaustFans: builder.query<GetMyExhaustFansResponse, void>({
      query: () => ({
        url: "/exhaust-fans/my",
        method: "GET",
      }),
      providesTags: [TagTypes.ExhaustFan],
    }),

    // ─── Get Exhaust Fan By ID ───────────────────────────────────────────────
    getExhaustFanById: builder.query<GetExhaustFanByIdResponse, string>({
      query: (recordId) => ({
        url: `/exhaust-fans/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.ExhaustFan],
    }),

    // ─── Delete Exhaust Fan ──────────────────────────────────────────────────
    deleteExhaustFan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exhaust-fans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.ExhaustFan],
    }),
  }),
});

export const {
  useCreateExhaustFanMutation,
  useUpdateExhaustFanMutation,
  useGetMyExhaustFansQuery,
  useGetExhaustFanByIdQuery,
  useDeleteExhaustFanMutation,
} = exhaustFanApi;
