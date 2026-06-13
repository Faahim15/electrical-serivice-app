import {
  useGetEvChargerInstallationByIdQuery,
  useGetServiceCallByIdQuery,
} from "@/src/redux/api-slices/quote/quote-api";

export const useDraftDetails = (id?: string, serviceType?: string) => {
  const isServiceCall = !id || serviceType === "Service Call" || !serviceType;
  const isEvCharger = !!id && serviceType === "EV Charger Installation";

  const serviceCallResult = useGetServiceCallByIdQuery(id as string, {
    skip: !id || !isServiceCall,
  });

  const evChargerResult = useGetEvChargerInstallationByIdQuery(id as string, {
    skip: !id || !isEvCharger,
  });

  // Add more query hooks here as new types are wired up, following the
  // same skip-pattern keyed on serviceType.

  if (isEvCharger) {
    return {
      data: evChargerResult.data?.data,
      isLoading: evChargerResult.isLoading,
    };
  }

  return {
    data: serviceCallResult.data?.data,
    isLoading: serviceCallResult.isLoading,
  };
};
