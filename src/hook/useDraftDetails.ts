import {
  useGetEvChargerInstallationByIdQuery,
  useGetServiceCallByIdQuery,
} from "@/src/redux/api-slices/quote/quote-api";
import { EvChargerInstallationResponse } from "@/src/types/evCharger.api.types";
import { ServiceCallResponse } from "@/src/types/quotes.api.types";

export type DraftResponse = ServiceCallResponse | EvChargerInstallationResponse;

export const useDraftDetails = (id?: string, serviceType?: string) => {
  const isServiceCall = !id || serviceType === "Service Call" || !serviceType;
  const isEvCharger = !!id && serviceType === "EV Charger Installation";

  const serviceCallResult = useGetServiceCallByIdQuery(id as string, {
    skip: !id || !isServiceCall,
  });

  const evChargerResult = useGetEvChargerInstallationByIdQuery(id as string, {
    skip: !id || !isEvCharger,
  });

  // Add more query hooks here as new types are wired up
  // const isPanelUpgrade = !!id && serviceType === "Panel Upgrade/Replacement";
  // const panelUpgradeResult = useGetPanelUpgradeByIdQuery(id as string, {
  //   skip: !id || !isPanelUpgrade,
  // });

  if (isEvCharger) {
    return {
      data: evChargerResult.data?.data as
        | EvChargerInstallationResponse
        | undefined,
      isLoading: evChargerResult.isLoading,
    };
  }

  // if (isPanelUpgrade) {
  //   return {
  //     data: panelUpgradeResult.data?.data as PanelUpgradeResponse | undefined,
  //     isLoading: panelUpgradeResult.isLoading,
  //   };
  // }

  return {
    data: serviceCallResult.data?.data as ServiceCallResponse | undefined,
    isLoading: serviceCallResult.isLoading,
  };
};
