import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  GetHomeSurgeProtectionByIdResponse,
  GetMyHomeSurgeProtectionsResponse,
  HomeSurgeProtectionResponse,
} from "@/src/types/quotes/home-surge-protection.api.types";

const homeSurgeProtectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Home Surge Protection ────────────────────────────────────────
    createHomeSurgeProtection: builder.mutation<
      HomeSurgeProtectionResponse,
      FormData
    >({
      query: (formData) => ({
        url: "/home-surge-protections",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.HomeSurgeProtection, TagTypes.Draft],
    }),

    // ─── Update Home Surge Protection ────────────────────────────────────────
    updateHomeSurgeProtection: builder.mutation<
      HomeSurgeProtectionResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/home-surge-protections/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.HomeSurgeProtection, TagTypes.Draft],
    }),

    // ─── Get My Home Surge Protections ───────────────────────────────────────
    getMyHomeSurgeProtections: builder.query<
      GetMyHomeSurgeProtectionsResponse,
      void
    >({
      query: () => ({
        url: "/home-surge-protections/my",
        method: "GET",
      }),
      providesTags: [TagTypes.HomeSurgeProtection],
    }),

    // ─── Get Home Surge Protection By ID ─────────────────────────────────────
    getHomeSurgeProtectionById: builder.query<
      GetHomeSurgeProtectionByIdResponse,
      string
    >({
      query: (recordId) => ({
        url: `/home-surge-protections/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.HomeSurgeProtection],
    }),

    // ─── Delete Home Surge Protection ────────────────────────────────────────
    deleteHomeSurgeProtection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/home-surge-protections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.HomeSurgeProtection, TagTypes.Draft],
    }),
  }),
});

export const {
  useCreateHomeSurgeProtectionMutation,
  useUpdateHomeSurgeProtectionMutation,
  useGetMyHomeSurgeProtectionsQuery,
  useGetHomeSurgeProtectionByIdQuery,
  useDeleteHomeSurgeProtectionMutation,
} = homeSurgeProtectionApi;
