import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  GetMyNewConstructionsResponse,
  GetNewConstructionByIdResponse,
  NewConstructionResponse,
} from "@/src/types/quotes/new-construction.api.types";

const newConstructionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create New Construction ─────────────────────────────────────────────
    createNewConstruction: builder.mutation<NewConstructionResponse, FormData>({
      query: (formData) => ({
        url: "/new-constructions",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.NewConstruction],
    }),

    // ─── Update New Construction ─────────────────────────────────────────────
    updateNewConstruction: builder.mutation<
      NewConstructionResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/new-constructions/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.NewConstruction],
    }),

    // ─── Get My New Constructions ────────────────────────────────────────────
    getMyNewConstructions: builder.query<GetMyNewConstructionsResponse, void>({
      query: () => ({
        url: "/new-constructions/my",
        method: "GET",
      }),
      providesTags: [TagTypes.NewConstruction],
    }),

    // ─── Get New Construction By ID ──────────────────────────────────────────
    getNewConstructionById: builder.query<
      GetNewConstructionByIdResponse,
      string
    >({
      query: (recordId) => ({
        url: `/new-constructions/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.NewConstruction],
    }),

    // ─── Delete New Construction ─────────────────────────────────────────────
    deleteNewConstruction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/new-constructions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.NewConstruction],
    }),
  }),
});

export const {
  useCreateNewConstructionMutation,
  useUpdateNewConstructionMutation,
  useGetMyNewConstructionsQuery,
  useGetNewConstructionByIdQuery,
  useDeleteNewConstructionMutation,
} = newConstructionApi;
