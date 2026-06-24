import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  GetMyStarlinksResponse,
  GetStarlinkByIdResponse,
  StarlinkResponse,
} from "@/src/types/quotes/starlink.api.types";

const starlinkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Starlink ─────────────────────────────────────────────────────
    createStarlink: builder.mutation<StarlinkResponse, FormData>({
      query: (formData) => ({
        url: "/starlinks",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Starlink, TagTypes.Draft],
    }),

    // ─── Update Starlink ─────────────────────────────────────────────────────
    updateStarlink: builder.mutation<
      StarlinkResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/starlinks/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Starlink, TagTypes.Draft],
    }),

    // ─── Get My Starlinks ────────────────────────────────────────────────────
    getMyStarlinks: builder.query<GetMyStarlinksResponse, void>({
      query: () => ({
        url: "/starlinks/my",
        method: "GET",
      }),
      providesTags: [TagTypes.Starlink],
    }),

    // ─── Get Starlink By ID ──────────────────────────────────────────────────
    getStarlinkById: builder.query<GetStarlinkByIdResponse, string>({
      query: (recordId) => ({
        url: `/starlinks/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.Starlink],
    }),

    // ─── Delete Starlink ─────────────────────────────────────────────────────
    deleteStarlink: builder.mutation<void, string>({
      query: (id) => ({
        url: `/starlinks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.Starlink, TagTypes.Draft],
    }),
  }),
});

export const {
  useCreateStarlinkMutation,
  useUpdateStarlinkMutation,
  useGetMyStarlinksQuery,
  useGetStarlinkByIdQuery,
  useDeleteStarlinkMutation,
} = starlinkApi;
