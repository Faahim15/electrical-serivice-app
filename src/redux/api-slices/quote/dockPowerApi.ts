import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  DockPowerResponse,
  GetDockPowerByIdResponse,
  GetMyDockPowersResponse,
} from "@/src/types/quotes/dock-power.api.types";

const dockPowerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Dock Power ───────────────────────────────────────────────────
    createDockPower: builder.mutation<DockPowerResponse, FormData>({
      query: (formData) => ({
        url: "/dock-powers",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.DockPower, TagTypes.Draft],
    }),

    // ─── Update Dock Power ───────────────────────────────────────────────────
    updateDockPower: builder.mutation<
      DockPowerResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/dock-powers/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.DockPower, TagTypes.Draft],
    }),

    // ─── Get My Dock Powers ──────────────────────────────────────────────────
    getMyDockPowers: builder.query<GetMyDockPowersResponse, void>({
      query: () => ({
        url: "/dock-powers/my",
        method: "GET",
      }),
      providesTags: [TagTypes.DockPower],
    }),

    // ─── Get Dock Power By ID ────────────────────────────────────────────────
    getDockPowerById: builder.query<GetDockPowerByIdResponse, string>({
      query: (recordId) => ({
        url: `/dock-powers/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.DockPower],
    }),

    // ─── Delete Dock Power ───────────────────────────────────────────────────
    deleteDockPower: builder.mutation<void, string>({
      query: (id) => ({
        url: `/dock-powers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.DockPower, TagTypes.Draft],
    }),
  }),
});

export const {
  useCreateDockPowerMutation,
  useUpdateDockPowerMutation,
  useGetMyDockPowersQuery,
  useGetDockPowerByIdQuery,
  useDeleteDockPowerMutation,
} = dockPowerApi;
