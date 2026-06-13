import {
  useCreateEvChargerInstallationMutation,
  useCreateServiceCallMutation,
  useUpdateEvChargerInstallationMutation,
  useUpdateServiceCallMutation,
} from "@/src/redux/api-slices/quote/quote-api";
import { useState } from "react";
export type DraftStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "quoted"
  | "scheduled"
  | "completed"
  | "cancelled";
// Common fields shared across all service types (contact + address steps)
export interface DraftCommonPayload {
  fullName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  preferredContactMethod?: string;
  streetAddress?: string;
  apartmentUnit?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  propertyType?: string;
  ownershipStatus?: string;
  timelineUrgency?: string;
  status?: DraftStatus;
  completionPercentage?: number;
  [key: string]: any;
}

export const useDraftSave = () => {
  const [createServiceCall, { isLoading: isCreatingServiceCall }] =
    useCreateServiceCallMutation();
  const [updateServiceCall, { isLoading: isUpdatingServiceCall }] =
    useUpdateServiceCallMutation();

  const [createEvCharger, { isLoading: isCreatingEvCharger }] =
    useCreateEvChargerInstallationMutation();
  const [updateEvCharger, { isLoading: isUpdatingEvCharger }] =
    useUpdateEvChargerInstallationMutation();

  // Add more mutation hooks here as new types are wired up:
  // const [createPanelUpgrade] = useCreatePanelUpgradeReplacementMutation();
  // const [updatePanelUpgrade] = useUpdatePanelUpgradeReplacementMutation();
  // const [createRemodeling] = useCreateRemodelingMutation();
  // const [updateRemodeling] = useUpdateRemodelingMutation();
  // const [createAccessoryBuildingPower] = useCreateAccessoryBuildingPowerMutation();
  // const [updateAccessoryBuildingPower] = useUpdateAccessoryBuildingPowerMutation();

  const [isSavingExtra, setIsSavingExtra] = useState(false);

  const isSaving =
    isCreatingServiceCall ||
    isUpdatingServiceCall ||
    isCreatingEvCharger ||
    isUpdatingEvCharger ||
    isSavingExtra;

  // ─── Create (no existing draft yet) ─────────────────────────────────────────
  const createDraft = async (serviceType: string, body: DraftCommonPayload) => {
    switch (serviceType) {
      case "EV Charger Installation":
        return createEvCharger(body as any).unwrap();

      // case "Panel Upgrade/Replacement":
      //   return createPanelUpgrade(body as any).unwrap();

      // case "Remodeling":
      //   return createRemodeling(body as any).unwrap();

      // case "Accessory Building Power":
      //   return createAccessoryBuildingPower(body as any).unwrap();

      case "Service Call":
      default:
        return createServiceCall(body as any).unwrap();
    }
  };

  // ─── Update (resuming an existing draft) ────────────────────────────────────
  const updateDraft = async (
    id: string,
    serviceType: string,
    body: DraftCommonPayload,
  ) => {
    switch (serviceType) {
      case "EV Charger Installation":
        return updateEvCharger({ id, body }).unwrap();

      // case "Panel Upgrade/Replacement":
      //   return updatePanelUpgrade({ id, body }).unwrap();

      // case "Remodeling":
      //   return updateRemodeling({ id, body }).unwrap();

      // case "Accessory Building Power":
      //   return updateAccessoryBuildingPower({ id, body }).unwrap();

      case "Service Call":
      default:
        return updateServiceCall({ id, body }).unwrap();
    }
  };

  return { createDraft, updateDraft, isSaving };
};
