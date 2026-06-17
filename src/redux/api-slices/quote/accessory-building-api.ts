import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  AccessoryBuildingResponse,
  GetAccessoryBuildingByIdResponse,
  GetMyAccessoryBuildingsResponse,
} from "@/src/types/quotes/accessory-building.api.types";

const accessoryBuildingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Create Accessory Building ───────────────────────────────────────────
    createAccessoryBuilding: builder.mutation<
      AccessoryBuildingResponse,
      FormData
    >({
      query: (formData) => ({
        url: "/accessory-building-powers",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.AccessoryBuilding],
    }),

    // ─── Update Accessory Building ───────────────────────────────────────────
    updateAccessoryBuilding: builder.mutation<
      AccessoryBuildingResponse,
      { recordId: string; formData: FormData }
    >({
      query: ({ recordId, formData }) => ({
        url: `/accessory-building-powers/${recordId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [TagTypes.AccessoryBuilding],
    }),

    // ─── Get My Accessory Buildings ──────────────────────────────────────────
    getMyAccessoryBuildings: builder.query<
      GetMyAccessoryBuildingsResponse,
      void
    >({
      query: () => ({
        url: "/accessory-building-powers/my",
        method: "GET",
      }),
      providesTags: [TagTypes.AccessoryBuilding],
    }),

    // ─── Get Accessory Building By ID ────────────────────────────────────────
    getAccessoryBuildingById: builder.query<
      GetAccessoryBuildingByIdResponse,
      string
    >({
      query: (recordId) => ({
        url: `/accessory-building-powers/${recordId}`,
        method: "GET",
      }),
      providesTags: [TagTypes.AccessoryBuilding],
    }),

    // ─── Delete Accessory Building ───────────────────────────────────────────
    deleteAccessoryBuilding: builder.mutation<void, string>({
      query: (id) => ({
        url: `/accessory-building-powers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.AccessoryBuilding],
    }),
  }),
});

export const {
  useCreateAccessoryBuildingMutation,
  useUpdateAccessoryBuildingMutation,
  useGetMyAccessoryBuildingsQuery,
  useGetAccessoryBuildingByIdQuery,
  useDeleteAccessoryBuildingMutation,
} = accessoryBuildingApi;
