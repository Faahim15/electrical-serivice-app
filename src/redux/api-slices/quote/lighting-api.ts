import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  GetLightingByIdResponse,
  GetMyLightingsResponse,
  LightingResponse,
} from "@/src/types/quotes/lighting.api.types";

const lightingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Lighting ─────────────────────────────────────────────────────
    createLighting: builder.mutation<LightingResponse, FormData>({
      query: (formData) => ({
        url: "/lighting",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Lighting],
    }),

    // ─── Update Lighting ─────────────────────────────────────────────────────
    updateLighting: builder.mutation<
      LightingResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/lighting/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Lighting],
    }),

    // ─── Get My Lightings ────────────────────────────────────────────────────
    getMyLightings: builder.query<GetMyLightingsResponse, void>({
      query: () => ({
        url: "/lighting/my",
        method: "GET",
      }),
      providesTags: [TagTypes.Lighting],
    }),

    // ─── Get Lighting By ID ──────────────────────────────────────────────────
    getLightingById: builder.query<GetLightingByIdResponse, string>({
      query: (recordId) => ({
        url: `/lighting/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.Lighting],
    }),

    // ─── Delete Lighting ─────────────────────────────────────────────────────
    deleteLighting: builder.mutation<void, string>({
      query: (id) => ({
        url: `/lighting/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.Lighting],
    }),
  }),
});

export const {
  useCreateLightingMutation,
  useUpdateLightingMutation,
  useGetMyLightingsQuery,
  useGetLightingByIdQuery,
  useDeleteLightingMutation,
} = lightingApi;
