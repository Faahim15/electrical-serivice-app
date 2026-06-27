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
import { useDeleteCeilingFanMutation } from "../redux/api-slices/quote/ceiling-fan-api";
import { useDeleteExhaustFanMutation } from "../redux/api-slices/quote/exhaust-fan-api";
import { useDeleteLightingMutation } from "../redux/api-slices/quote/lighting-api";
import { useDeleteOutletMutation } from "../redux/api-slices/quote/outlet-api";
import { useDeletePanelUpgradeReplacementMutation } from "../redux/api-slices/quote/quote-api-two";
import { useDeleteRemodelingMutation } from "../redux/api-slices/quote/remodeling-api";
import { useDeleteStarlinkMutation } from "../redux/api-slices/quote/starLinkApi";
import { useDeleteSwitchesMutation } from "../redux/api-slices/quote/switches-api";

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
  // ─── New Mutations ──────────────────────────────────────────────────────────
  const [deleteExhaustFan] = useDeleteExhaustFanMutation();
  const [deleteOutlets] = useDeleteOutletMutation();
  const [deleteSwitches] = useDeleteSwitchesMutation();
  const [deleteLighting] = useDeleteLightingMutation();
  const [deleteCeilingFan] = useDeleteCeilingFanMutation();

  // ─── Delete handler ──────────────────────────────────────────────────────────
  const deleteDraft = async (id: string, serviceType: string) => {
    setIsDeleting(true);
    try {
      const normalizedType = serviceType.replace(/\s+/g, " ").trim();

      switch (normalizedType) {
        case "EV Charger Installation":
          await deleteEvCharger(id).unwrap();
          break;
        case "Panel Upgrade / Replacement":
        case "Panel Upgrade/Replacement":
          await deletePanelUpgrade(id).unwrap();
          break;
        case "Remodeling":
          await deleteRemodeling(id).unwrap();
          break;
        case "Accessory Building / Shed Power":
          await deleteAccessoryBuilding(id).unwrap();
          break;
        case "Hot tub installation":
        case "Hot Tub Installation":
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
        case "Exhaust Fan":
        case "Exhaust Fan Installation":
          await deleteExhaustFan(id).unwrap();
          break;
        case "Outlets":
        case "Outlets Installation":
        case "Outlet Installation":
          await deleteOutlets(id).unwrap();
          break;
        case "Switches":
        case "Switches Installation":
          await deleteSwitches(id).unwrap();
          break;
        case "Lighting":
        case "Lighting Installation":
          await deleteLighting(id).unwrap();
          break;
        case "Ceiling Fan":
        case "Ceiling Fan Installation":
          await deleteCeilingFan(id).unwrap();
          break;
        case "Service Call":
          await deleteServiceCall(id).unwrap();
          break;
        default:
          console.warn(`Unknown serviceType: "${normalizedType}"`);
          toast.error("Unknown service type. Cannot delete draft.");
          return;
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
