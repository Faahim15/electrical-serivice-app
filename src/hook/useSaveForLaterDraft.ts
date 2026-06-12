import { useUpdateServiceCallMutation } from "@/src/redux/api-slices/quote/quote-api";
import { UpdateServiceCallPayload } from "@/src/types/quotes.api.types";
import { useState } from "react";
import { toast } from "sonner-native";

export const useSaveForLaterDraft = (onSuccess?: () => void) => {
  const [isSaving, setIsSaving] = useState(false);

  const [updateServiceCall] = useUpdateServiceCallMutation();
  // const [updateEvCharger] = useUpdateEvChargerInstallationMutation();
  // const [updatePanelUpgrade] = useUpdatePanelUpgradeReplacementMutation();
  // const [updateRemodeling] = useUpdateRemodelingMutation();
  // const [updateAccessoryBuildingPower] = useUpdateAccessoryBuildingPowerMutation();

  const saveForLater = async (
    id: string,
    serviceType: string,
    body: UpdateServiceCallPayload,
  ) => {
    setIsSaving(true);
    try {
      switch (serviceType) {
        // case "EV Charger Installation":
        //   await updateEvCharger({ id, body }).unwrap();
        //   break;
        // case "Panel Upgrade/Replacement":
        //   await updatePanelUpgrade({ id, body }).unwrap();
        //   break;
        // case "Remodeling":
        //   await updateRemodeling({ id, body }).unwrap();
        //   break;
        // case "Accessory Building Power":
        //   await updateAccessoryBuildingPower({ id, body }).unwrap();
        //   break;

        case "Service Call":
        default:
          await updateServiceCall({ id, body }).unwrap();
          break;
      }
      toast.success("Draft saved for later.");
      onSuccess?.();
    } catch {
      toast.error("Failed to save draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return { saveForLater, isSaving };
};
