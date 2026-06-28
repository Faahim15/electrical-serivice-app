import TagTypes from "@/src/constants/tagTypes.constant";
import { baseApi } from "@/src/redux/services/base-api";
import {
  GetMaintenanceAlertsResponse,
  UpdateMaintenanceAlertsPayload,
  UpdateMaintenanceAlertsResponse,
} from "@/src/types/maintenanceAlert.api.types";

const maintenanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMaintenanceAlerts: builder.query<GetMaintenanceAlertsResponse, void>({
      query: () => ({
        url: "/user/maintenance-alerts",
        method: "GET",
      }),
      providesTags: [TagTypes.Profile],
    }),

    updateMaintenanceAlerts: builder.mutation<
      UpdateMaintenanceAlertsResponse,
      UpdateMaintenanceAlertsPayload
    >({
      query: (body) => ({
        url: "/user/maintenance-alerts",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [TagTypes.Profile],
    }),
  }),
});

export const {
  useGetMaintenanceAlertsQuery,
  useUpdateMaintenanceAlertsMutation,
} = maintenanceApi;
