import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  GetMyRemodelingResponse,
  GetRemodelingByIdResponse,
  RemodelingResponse,
} from "@/src/types/quotes/remodeling.api.types";

const remodelingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Remodeling ───────────────────────────────────────────────────
    createRemodeling: builder.mutation<RemodelingResponse, FormData>({
      query: (formData) => ({
        url: "/remodelings",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Remodeling],
    }),

    // ─── Update Remodeling ───────────────────────────────────────────────────
    updateRemodeling: builder.mutation<
      RemodelingResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/remodelings/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Remodeling],
    }),

    // ─── Get My Remodelings ──────────────────────────────────────────────────
    getMyRemodelings: builder.query<GetMyRemodelingResponse, void>({
      query: () => ({
        url: "/remodelings/my",
        method: "GET",
      }),
      providesTags: [TagTypes.Remodeling],
    }),

    // ─── Get Remodeling By ID ────────────────────────────────────────────────
    getRemodelingById: builder.query<GetRemodelingByIdResponse, string>({
      query: (recordId) => ({
        url: `/remodelings/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.Remodeling],
    }),

    // ─── Delete Remodeling ───────────────────────────────────────────────────
    deleteRemodeling: builder.mutation<void, string>({
      query: (id) => ({
        url: `/remodelings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.Remodeling],
    }),
  }),
});

export const {
  useCreateRemodelingMutation,
  useUpdateRemodelingMutation,
  useGetMyRemodelingsQuery,
  useGetRemodelingByIdQuery,
  useDeleteRemodelingMutation,
} = remodelingApi;
