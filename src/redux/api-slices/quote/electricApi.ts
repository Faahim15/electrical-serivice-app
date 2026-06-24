import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  ElectricResponse,
  GetElectricByIdResponse,
  GetMyElectricsResponse,
} from "@/src/types/quotes/electric.api.types";

const electricApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Electric ─────────────────────────────────────────────────────
    createElectric: builder.mutation<ElectricResponse, FormData>({
      query: (formData) => ({
        url: "/electrics",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Electric, TagTypes.Draft],
    }),

    // ─── Update Electric ─────────────────────────────────────────────────────
    updateElectric: builder.mutation<
      ElectricResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/electrics/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Electric, TagTypes.Draft],
    }),

    // ─── Get My Electrics ────────────────────────────────────────────────────
    getMyElectrics: builder.query<GetMyElectricsResponse, void>({
      query: () => ({
        url: "/electrics/my",
        method: "GET",
      }),
      providesTags: [TagTypes.Electric],
    }),

    // ─── Get Electric By ID ──────────────────────────────────────────────────
    getElectricById: builder.query<GetElectricByIdResponse, string>({
      query: (recordId) => ({
        url: `/electrics/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.Electric],
    }),

    // ─── Delete Electric ─────────────────────────────────────────────────────
    deleteElectric: builder.mutation<void, string>({
      query: (id) => ({
        url: `/electrics/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.Electric, TagTypes.Draft],
    }),
  }),
});

export const {
  useCreateElectricMutation,
  useUpdateElectricMutation,
  useGetMyElectricsQuery,
  useGetElectricByIdQuery,
  useDeleteElectricMutation,
} = electricApi;
