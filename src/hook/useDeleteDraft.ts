import { useDeleteDedicatedCircuitMutation } from "@/src/redux/api-slices/quote/dedicatedCircuitApi";
import { useDeleteDockPowerMutation } from "@/src/redux/api-slices/quote/dockPowerApi";
import { useDeleteElectricMutation } from "@/src/redux/api-slices/quote/electricApi";
import { useDeleteGeneratorMutation } from "@/src/redux/api-slices/quote/generatorApi";
import { useDeleteHomeSurgeProtectionMutation } from "@/src/redux/api-slices/quote/homeSurgeProtectionApi";
import { useDeleteHotTubMutation } from "@/src/redux/api-slices/quote/hotTubApi";
import { useDeleteNewConstructionMutation } from "@/src/redux/api-slices/quote/newConstructionApi";
import {
  useDeleteEvChargerInstallationMutation,
  useDeleteServiceCallMutation,
} from "@/src/redux/api-slices/quote/quote-api";
import { useState } from "react";
import { toast } from "sonner-native";
import { useDeleteAccessoryBuildingMutation } from "../redux/api-slices/quote/accessory-building-api";
import { useDeletePanelUpgradeReplacementMutation } from "../redux/api-slices/quote/quote-api-two";
import { useDeleteRemodelingMutation } from "../redux/api-slices/quote/remodeling-api";
import { useDeleteStarlinkMutation } from "../redux/api-slices/quote/starLinkApi";

export const useDeleteDraft = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Mutations ───────────────────────────────────────────────────────────────
  const [deleteServiceCall] = useDeleteServiceCallMutation();
  const [deleteEvCharger] = useDeleteEvChargerInstallationMutation();
  const [deletePanelUpgrade] = useDeletePanelUpgradeReplacementMutation();
  const [deleteRemodeling] = useDeleteRemodelingMutation();
  const [deleteAccessoryBuilding] = useDeleteAccessoryBuildingMutation();
  const [deleteHotTub] = useDeleteHotTubMutation();
  const [deleteDockPower] = useDeleteDockPowerMutation();
  const [deleteElectric] = useDeleteElectricMutation();
  const [deleteGenerator] = useDeleteGeneratorMutation();
  const [deleteNewConstruction] = useDeleteNewConstructionMutation();
  const [deleteHomeSurgeProtection] = useDeleteHomeSurgeProtectionMutation();
  const [deleteStarlink] = useDeleteStarlinkMutation();
  const [deleteDedicatedCircuit] = useDeleteDedicatedCircuitMutation();

  // ─── Delete handler ──────────────────────────────────────────────────────────
  const deleteDraft = async (id: string, serviceType: string) => {
    setIsDeleting(true);
    try {
      console.log({ serviceType });
      switch (serviceType) {
        case "EV Charger Installation":
          await deleteEvCharger(id).unwrap();
          break;
        case "Panel Upgrade / Replacement":
          await deletePanelUpgrade(id).unwrap();
          break;
        case "Remodeling":
          await deleteRemodeling(id).unwrap();
          break;
        case "Accessory Building / Shed Power":
          await deleteAccessoryBuilding(id).unwrap();
          break;
        case "Hot tub installation":
          await deleteHotTub(id).unwrap();
          break;
        case "Dock Power":
          await deleteDockPower(id).unwrap();
          break;
        case "Electric System":
          await deleteElectric(id).unwrap();
          break;
        case "Generator Installation":
          await deleteGenerator(id).unwrap();
          break;
        case "New Construction":
          await deleteNewConstruction(id).unwrap();
          break;
        case "Home Surge Protection":
          await deleteHomeSurgeProtection(id).unwrap();
          break;
        case "Starlink Installation":
          await deleteStarlink(id).unwrap();
          break;
        case "Dedicated Circuit Installation":
          await deleteDedicatedCircuit(id).unwrap();
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
