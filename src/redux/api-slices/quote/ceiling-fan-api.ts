import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  CeilingFanResponse,
  GetCeilingFanByIdResponse,
  GetMyCeilingFansResponse,
} from "@/src/types/quotes/ceiling-fan.api.types";

const ceilingFanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Ceiling Fan ──────────────────────────────────────────────────
    createCeilingFan: builder.mutation<CeilingFanResponse, FormData>({
      query: (formData) => ({
        url: "/ceiling-fans",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.CeilingFan],
    }),

    // ─── Update Ceiling Fan ──────────────────────────────────────────────────
    updateCeilingFan: builder.mutation<
      CeilingFanResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/ceiling-fans/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.CeilingFan],
    }),

    // ─── Get My Ceiling Fans ─────────────────────────────────────────────────
    getMyCeilingFans: builder.query<GetMyCeilingFansResponse, void>({
      query: () => ({
        url: "/ceiling-fans/my",
        method: "GET",
      }),
      providesTags: [TagTypes.CeilingFan],
    }),

    // ─── Get Ceiling Fan By ID ───────────────────────────────────────────────
    getCeilingFanById: builder.query<GetCeilingFanByIdResponse, string>({
      query: (recordId) => ({
        url: `/ceiling-fans/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.CeilingFan],
    }),

    // ─── Delete Ceiling Fan ──────────────────────────────────────────────────
    deleteCeilingFan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ceiling-fans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.CeilingFan],
    }),
  }),
});

export const {
  useCreateCeilingFanMutation,
  useUpdateCeilingFanMutation,
  useGetMyCeilingFansQuery,
  useGetCeilingFanByIdQuery,
  useDeleteCeilingFanMutation,
} = ceilingFanApi;
