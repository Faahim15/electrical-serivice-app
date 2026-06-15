import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  CreateEvChargerInstallationPayload,
  CreateEvChargerInstallationResponse,
  GetEvChargerInstallationsResponse,
  UpdateEvChargerInstallationPayload,
  UpdateEvChargerInstallationResponse,
} from "@/src/types/evCharger.api.types";
import {
  CreateServiceCallPayload,
  CreateServiceCallResponse,
  DeleteImagePayload,
  DeleteImageResponse,
  GetDraftsResponse,
  GetServiceCallsResponse,
  UpdateProfilePhotoResponse,
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
    // ─── Upload Image (form-data, PUT) ──────────────────────────────────────

    updateProfilePhoto: builder.mutation<UpdateProfilePhotoResponse, FormData>({
      query: (formData) => ({
        url: "/user/update-profile-photo",
        method: "PUT",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [TagTypes.User],
    }),

    deleteImage: builder.mutation<DeleteImageResponse, DeleteImagePayload>({
      query: (body) => ({
        url: "/user/delete-image",
        method: "DELETE",
        body,
      }),
      invalidatesTags: [TagTypes.User],
    }),

    getServiceCallById: builder.query<CreateServiceCallResponse, string>({
      query: (id) => ({
        url: `/service-calls/${id}`,
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

    // ─── Update (PATCH) — Service Call ─────────────────────────────────────

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

    // ─── EV Charger Installation ────────────────────────────────────────────

    getEvChargerInstallations: builder.query<
      GetEvChargerInstallationsResponse,
      void
    >({
      query: () => ({
        url: "/ev-charger-installations/my",
        method: "GET",
      }),
      providesTags: [TagTypes.User],
    }),

    getEvChargerInstallationById: builder.query<
      CreateEvChargerInstallationResponse,
      string
    >({
      query: (id) => ({
        url: `/ev-charger-installations/${id}`,
        method: "GET",
      }),
      providesTags: [TagTypes.User],
    }),

    createEvChargerInstallation: builder.mutation<
      CreateEvChargerInstallationResponse,
      CreateEvChargerInstallationPayload
    >({
      query: (body) => ({
        url: "/ev-charger-installations",
        method: "POST",
        body,
      }),
      invalidatesTags: [TagTypes.User],
    }),

    updateEvChargerInstallation: builder.mutation<
      UpdateEvChargerInstallationResponse,
      { id: string; body: UpdateEvChargerInstallationPayload }
    >({
      query: ({ id, body }) => ({
        url: `/ev-charger-installations/${id}`,
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
  useGetServiceCallByIdQuery,
  useUpdateProfilePhotoMutation,
  useGetDraftsQuery,
  useCreateServiceCallMutation,
  useUpdateServiceCallMutation,
  useGetEvChargerInstallationsQuery,
  useGetEvChargerInstallationByIdQuery,
  useCreateEvChargerInstallationMutation,
  useUpdateEvChargerInstallationMutation,
  useDeleteServiceCallMutation,
  useDeleteEvChargerInstallationMutation,
  useDeletePanelUpgradeReplacementMutation,
  useDeleteImageMutation,
  useDeleteRemodelingMutation,
  useDeleteAccessoryBuildingPowerMutation,
} = quoteApi;
