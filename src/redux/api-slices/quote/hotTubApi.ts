import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  GetHotTubByIdResponse,
  GetMyHotTubsResponse,
  HotTubResponse,
} from "@/src/types/quotes/hot-tub.api.types";

const hotTubApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Hot Tub Installation ─────────────────────────────────────────
    createHotTub: builder.mutation<HotTubResponse, FormData>({
      query: (formData) => ({
        url: "/hot-tub-installations",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.HotTub],
    }),

    // ─── Update Hot Tub Installation ─────────────────────────────────────────
    updateHotTub: builder.mutation<
      HotTubResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/hot-tub-installations/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.HotTub],
    }),

    // ─── Get My Hot Tub Installations ────────────────────────────────────────
    getMyHotTubs: builder.query<GetMyHotTubsResponse, void>({
      query: () => ({
        url: "/hot-tub-installations/my",
        method: "GET",
      }),
      providesTags: [TagTypes.HotTub],
    }),

    // ─── Get Hot Tub Installation By ID ──────────────────────────────────────
    getHotTubById: builder.query<GetHotTubByIdResponse, string>({
      query: (recordId) => ({
        url: `/hot-tub-installations/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.HotTub],
    }),

    // ─── Delete Hot Tub Installation ─────────────────────────────────────────
    deleteHotTub: builder.mutation<void, string>({
      query: (id) => ({
        url: `/hot-tub-installations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.HotTub],
    }),
  }),
});

export const {
  useCreateHotTubMutation,
  useUpdateHotTubMutation,
  useGetMyHotTubsQuery,
  useGetHotTubByIdQuery,
  useDeleteHotTubMutation,
} = hotTubApi;
