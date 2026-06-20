import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  GetMySwitchesResponse,
  GetSwitchesByIdResponse,
  SwitchesResponse,
} from "@/src/types/quotes/switches.api.types";

const switchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Switches ─────────────────────────────────────────────────────
    createSwitches: builder.mutation<SwitchesResponse, FormData>({
      query: (formData) => ({
        url: "/switches",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Switches],
    }),

    // ─── Update Switches ─────────────────────────────────────────────────────
    updateSwitches: builder.mutation<
      SwitchesResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/switches/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.Switches],
    }),

    // ─── Get My Switches ─────────────────────────────────────────────────────
    getMySwitches: builder.query<GetMySwitchesResponse, void>({
      query: () => ({
        url: "/switches/my",
        method: "GET",
      }),
      providesTags: [TagTypes.Switches],
    }),

    // ─── Get Switches By ID ──────────────────────────────────────────────────
    getSwitchesById: builder.query<GetSwitchesByIdResponse, string>({
      query: (recordId) => ({
        url: `/switches/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.Switches],
    }),

    // ─── Delete Switches ─────────────────────────────────────────────────────
    deleteSwitches: builder.mutation<void, string>({
      query: (id) => ({
        url: `/switches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.Switches],
    }),
  }),
});

export const {
  useCreateSwitchesMutation,
  useUpdateSwitchesMutation,
  useGetMySwitchesQuery,
  useGetSwitchesByIdQuery,
  useDeleteSwitchesMutation,
} = switchesApi;
