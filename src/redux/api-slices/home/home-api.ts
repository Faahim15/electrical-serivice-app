import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  GetGuideByIdResponse,
  GetGuidesResponse,
  GetRecentActivityResponse,
  GetSavedGuidesResponse,
  SaveGuideResponse,
} from "@/src/types/guides.api.types";
import { GetProfileResponse } from "@/src/types/home.api.types";
import {
  GetNotificationsParams,
  GetNotificationsResponse,
  MarkAsReadResponse,
} from "@/src/types/notification.api.types";
import { SearchQuotesResponse } from "@/src/types/search.api.types";

const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: [TagTypes.Profile],
    }),

    getNotifications: builder.query<
      GetNotificationsResponse,
      GetNotificationsParams
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/notifications?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: [TagTypes.Notification],
    }),

    markNotificationAsRead: builder.mutation<MarkAsReadResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: [TagTypes.Notification],
    }),

    markAllNotificationsAsRead: builder.mutation<MarkAsReadResponse, void>({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: [TagTypes.Notification],
    }),

    searchQuotes: builder.query<SearchQuotesResponse, string>({
      query: (searchQuery) => ({
        url: `/quotes/search?searchQuery=${encodeURIComponent(searchQuery)}`,
        method: "GET",
      }),
    }),

    // ─── Get All Guides ──────────────────────────────────────────────────────
    getGuides: builder.query<
      GetGuidesResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/guides?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: [TagTypes.Guide],
    }),

    // ─── Get Guide By ID ─────────────────────────────────────────────────────
    getGuideById: builder.query<GetGuideByIdResponse, string>({
      query: (guideId) => ({
        url: `/guides/${guideId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.Guide],
    }),

    // ─── Save Guide (POST) ──────────────────────────────────────────────────
    saveGuide: builder.mutation<SaveGuideResponse, string>({
      query: (guideId) => ({
        url: `/guides/${guideId}/save`,
        method: "POST",
      }),
      invalidatesTags: [TagTypes.Guide],
    }),

    // ─── Unsave Guide (DELETE) ──────────────────────────────────────────────
    unsaveGuide: builder.mutation<SaveGuideResponse, string>({
      query: (guideId) => ({
        url: `/guides/${guideId}/save`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.Guide],
    }),

    // ─── Get Saved Guides ────────────────────────────────────────────────────
    getSavedGuides: builder.query<
      GetSavedGuidesResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/guides/saved?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: [TagTypes.Guide],
    }),

    // ─── Get Recent Activity ─────────────────────────────────────────────────────
    getRecentActivity: builder.query<GetRecentActivityResponse, void>({
      query: () => ({
        url: "/quotes/recent-activity",
        method: "GET",
      }),
      providesTags: [TagTypes.Quote],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useSearchQuotesQuery,
  useGetGuidesQuery,
  useGetGuideByIdQuery,
  useSaveGuideMutation,
  useUnsaveGuideMutation,
  useGetSavedGuidesQuery,
  useGetRecentActivityQuery,
} = homeApi;
