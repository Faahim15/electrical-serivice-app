import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import type {
  AddFavoriteResponse,
  PartnerCategoriesResponse,
  PartnersResponse,
} from "@/src/types/partners.types";

const partnersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPartnerCategories: builder.query<PartnerCategoriesResponse, void>({
      query: () => ({
        url: "/quotes/categories",
        method: "GET",
      }),
      providesTags: [TagTypes.Partner],
    }),

    // ── New ───────────────────────────────────────────────────────────────
    getPartnersByCategory: builder.query<PartnersResponse, string>({
      query: (categoryId) => ({
        url: `/quotes/categories/${categoryId}/partners`,
        method: "GET",
      }),
      providesTags: (result, error, categoryId) => [
        { type: TagTypes.Partner, id: categoryId },
      ],
    }),

    addFavoritePartner: builder.mutation<
      AddFavoriteResponse,
      { partnerId: string; isFavourite: boolean }
    >({
      query: ({ partnerId, isFavourite }) => ({
        url: `/quotes/favorites/${partnerId}?isFavourite=${isFavourite}`,
        method: "POST",
      }),
      invalidatesTags: [TagTypes.Partner],
    }),
  }),
});

export const {
  useGetPartnerCategoriesQuery,
  useGetPartnersByCategoryQuery,
  useAddFavoritePartnerMutation,
} = partnersApi;

export default partnersApi;
