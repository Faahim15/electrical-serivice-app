import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  DedicatedCircuitResponse,
  GetDedicatedCircuitByIdResponse,
  GetMyDedicatedCircuitsResponse,
} from "@/src/types/quotes/dedicated-circuit.api.types";

const dedicatedCircuitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Dedicated Circuit ────────────────────────────────────────────
    createDedicatedCircuit: builder.mutation<
      DedicatedCircuitResponse,
      FormData
    >({
      query: (formData) => ({
        url: "/dedicated-circuits",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.DedicatedCircuit],
    }),

    // ─── Update Dedicated Circuit ────────────────────────────────────────────
    updateDedicatedCircuit: builder.mutation<
      DedicatedCircuitResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/dedicated-circuits/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.DedicatedCircuit],
    }),

    // ─── Get My Dedicated Circuits ───────────────────────────────────────────
    getMyDedicatedCircuits: builder.query<GetMyDedicatedCircuitsResponse, void>(
      {
        query: () => ({
          url: "/dedicated-circuits/my",
          method: "GET",
        }),
        providesTags: [TagTypes.DedicatedCircuit],
      },
    ),

    // ─── Get Dedicated Circuit By ID ─────────────────────────────────────────
    getDedicatedCircuitById: builder.query<
      GetDedicatedCircuitByIdResponse,
      string
    >({
      query: (recordId) => ({
        url: `/dedicated-circuits/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.DedicatedCircuit],
    }),

    // ─── Delete Dedicated Circuit ────────────────────────────────────────────
    deleteDedicatedCircuit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/dedicated-circuits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.DedicatedCircuit],
    }),
  }),
});

export const {
  useCreateDedicatedCircuitMutation,
  useUpdateDedicatedCircuitMutation,
  useGetMyDedicatedCircuitsQuery,
  useGetDedicatedCircuitByIdQuery,
  useDeleteDedicatedCircuitMutation,
} = dedicatedCircuitApi;
