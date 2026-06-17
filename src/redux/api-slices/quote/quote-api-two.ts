import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  GetMyPanelUpgradesResponse,
  GetPanelUpgradeByIdResponse,
  PanelUpgradeResponse,
} from "@/src/types/quotes/panel.upgrader.api.types";

const quoteApiTwo = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Panel Upgrade ────────────────────────────────────────────────
    createPanelUpgrade: builder.mutation<PanelUpgradeResponse, FormData>({
      query: (formData) => ({
        url: "/panel-upgrade-replacements",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.PanelUpgrade],
    }),

    // ─── Update Panel Upgrade ────────────────────────────────────────────────
    updatePanelUpgrade: builder.mutation<
      PanelUpgradeResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/panel-upgrade-replacements/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.PanelUpgrade],
    }),

    // ─── Get My Panel Upgrades ───────────────────────────────────────────────
    getMyPanelUpgrades: builder.query<GetMyPanelUpgradesResponse, void>({
      query: () => ({
        url: "/panel-upgrade-replacements/my",
        method: "GET",
      }),
      providesTags: [TagTypes.PanelUpgrade],
    }),

    // ─── Get Panel Upgrade By ID ─────────────────────────────────────────────
    getPanelUpgradeById: builder.query<GetPanelUpgradeByIdResponse, string>({
      query: (recordId) => ({
        url: `/panel-upgrade-replacements/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.PanelUpgrade],
    }),
    deletePanelUpgradeReplacement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/panel-upgrade-replacements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.PanelUpgrade],
    }),
  }),
});

export const {
  useCreatePanelUpgradeMutation,
  useUpdatePanelUpgradeMutation,
  useGetMyPanelUpgradesQuery,
  useGetPanelUpgradeByIdQuery,
  useDeletePanelUpgradeReplacementMutation,
} = quoteApiTwo;
