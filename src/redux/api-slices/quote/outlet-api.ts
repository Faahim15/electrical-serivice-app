import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  GetMyOutletsResponse,
  GetOutletByIdResponse,
  OutletResponse,
} from "@/src/types/quotes/outlet.api.types";

const outletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Outlet ───────────────────────────────────────────────────────
    createOutlet: builder.mutation<OutletResponse, FormData>({
      query: (formData) => ({
        url: "/outlets",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Outlet, TagTypes.Draft],
    }),

    // ─── Update Outlet ───────────────────────────────────────────────────────
    updateOutlet: builder.mutation<
      OutletResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/outlets/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Outlet, TagTypes.Draft],
    }),

    // ─── Get My Outlets ──────────────────────────────────────────────────────
    getMyOutlets: builder.query<GetMyOutletsResponse, void>({
      query: () => ({
        url: "/outlets/my",
        method: "GET",
      }),
      providesTags: [TagTypes.Outlet],
    }),

    // ─── Get Outlet By ID ────────────────────────────────────────────────────
    getOutletById: builder.query<GetOutletByIdResponse, string>({
      query: (recordId) => ({
        url: `/outlets/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.Outlet],
    }),

    // ─── Delete Outlet ───────────────────────────────────────────────────────
    deleteOutlet: builder.mutation<void, string>({
      query: (id) => ({
        url: `/outlets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.Outlet, TagTypes.Draft],
    }),
  }),
});

export const {
  useCreateOutletMutation,
  useUpdateOutletMutation,
  useGetMyOutletsQuery,
  useGetOutletByIdQuery,
  useDeleteOutletMutation,
} = outletApi;
