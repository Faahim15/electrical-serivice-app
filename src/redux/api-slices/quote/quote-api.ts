import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  CreateServiceCallPayload,
  CreateServiceCallResponse,
  GetDraftsResponse,
  GetServiceCallsResponse,
  UpdateServiceCallPayload,
  UpdateServiceCallResponse,
} from "@/src/types/quotes.api.types";

// ─── API ──────────────────────────────────────────────────────────────────────

const quoteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceCalls: builder.query<GetServiceCallsResponse, void>({
      query: () => ({
        url: "/service-calls/my",
        method: "GET",
      }),
      providesTags: [TagTypes.User],
    }),

    getDrafts: builder.query<GetDraftsResponse, void>({
      query: () => ({
        url: "/drafts",
        method: "GET",
      }),
      providesTags: [TagTypes.User],
    }),

    createServiceCall: builder.mutation<
      CreateServiceCallResponse,
      CreateServiceCallPayload
    >({
      query: (body) => ({
        url: "/service-calls",
        method: "POST",
        body,
      }),
      invalidatesTags: [TagTypes.User],
    }),

    // ─── Update (PATCH) ─────────────────────────────────────────────────────

    updateServiceCall: builder.mutation<
      UpdateServiceCallResponse,
      { id: string; body: UpdateServiceCallPayload }
    >({
      query: ({ id, body }) => ({
        url: `/service-calls/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [TagTypes.User],
    }),

    // ─── Delete mutations per draft type ───────────────────────────────────

    deleteServiceCall: builder.mutation<void, string>({
      query: (id) => ({
        url: `/service-calls/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.User],
    }),

    deleteEvChargerInstallation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ev-charger-installations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.User],
    }),

    deletePanelUpgradeReplacement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/panel-upgrade-replacements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.User],
    }),

    deleteRemodeling: builder.mutation<void, string>({
      query: (id) => ({
        url: `/remodelings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.User],
    }),

    deleteAccessoryBuildingPower: builder.mutation<void, string>({
      query: (id) => ({
        url: `/accessory-building-powers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.User],
    }),
  }),
});

export const {
  useGetServiceCallsQuery,
  useGetDraftsQuery,
  useCreateServiceCallMutation,
  useUpdateServiceCallMutation,
  useDeleteServiceCallMutation,
  useDeleteEvChargerInstallationMutation,
  useDeletePanelUpgradeReplacementMutation,
  useDeleteRemodelingMutation,
  useDeleteAccessoryBuildingPowerMutation,
} = quoteApi;
