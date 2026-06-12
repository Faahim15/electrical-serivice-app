import {
  useDeleteAccessoryBuildingPowerMutation,
  useDeleteEvChargerInstallationMutation,
  useDeletePanelUpgradeReplacementMutation,
  useDeleteRemodelingMutation,
  useDeleteServiceCallMutation,
} from "@/src/redux/api-slices/quote/quote-api";
import { useState } from "react";
import { toast } from "sonner-native";

export const useDeleteDraft = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteServiceCall] = useDeleteServiceCallMutation();
  const [deleteEvCharger] = useDeleteEvChargerInstallationMutation();
  const [deletePanelUpgrade] = useDeletePanelUpgradeReplacementMutation();
  const [deleteRemodeling] = useDeleteRemodelingMutation();
  const [deleteAccessoryBuildingPower] =
    useDeleteAccessoryBuildingPowerMutation();

  const deleteDraft = async (id: string, serviceType: string) => {
    setIsDeleting(true);
    try {
      console.log({ serviceType });
      switch (serviceType) {
        case "EV Charger Installation":
          await deleteEvCharger(id).unwrap();
          break;
        case "Panel Upgrade/Replacement":
          await deletePanelUpgrade(id).unwrap();
          break;
        case "Remodeling":
          await deleteRemodeling(id).unwrap();
          break;
        case "Accessory Building Power":
          await deleteAccessoryBuildingPower(id).unwrap();
          break;
        case "Service Call":
        default:
          await deleteServiceCall(id).unwrap();
          break;
      }
      toast.success("Draft deleted successfully.");
      onSuccess?.();
    } catch (err: any) {
      console.log({ err });
      toast.error("Failed to delete draft. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteDraft, isDeleting };
};
