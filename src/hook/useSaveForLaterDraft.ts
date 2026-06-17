import {
  useUpdateEvChargerInstallationMutation,
  useUpdateServiceCallMutation,
} from "@/src/redux/api-slices/quote/quote-api";

import { useUpdatePanelUpgradeMutation } from "../redux/api-slices/quote/quote-api-two";

import { useUpdateRemodelingMutation } from "../redux/api-slices/quote/remodeling-api";

import { useUpdateAccessoryBuildingMutation } from "../redux/api-slices/quote/accessory-building-api";

import { useUpdateHotTubMutation } from "@/src/redux/api-slices/quote/hotTubApi";

import { useUpdateDockPowerMutation } from "@/src/redux/api-slices/quote/dockPowerApi";

import { useUpdateElectricMutation } from "@/src/redux/api-slices/quote/electricApi";

import { useUpdateGeneratorMutation } from "@/src/redux/api-slices/quote/generatorApi";

import { useUpdateNewConstructionMutation } from "@/src/redux/api-slices/quote/newConstructionApi";

import { useUpdateHomeSurgeProtectionMutation } from "@/src/redux/api-slices/quote/homeSurgeProtectionApi";

import { useUpdateStarlinkMutation } from "../redux/api-slices/quote/starLinkApi";

import { useUpdateDedicatedCircuitMutation } from "@/src/redux/api-slices/quote/dedicatedCircuitApi";

import { UpdateServiceCallPayload } from "@/src/types/quotes.api.types";
import { useState } from "react";
import { toast } from "sonner-native";

export const useSaveForLaterDraft = (onSuccess?: () => void) => {
  const [isSaving, setIsSaving] = useState(false);

  // ─── Mutations ───────────────────────────────────────────────────────────────
  const [updateServiceCall] = useUpdateServiceCallMutation();
  const [updateEvCharger] = useUpdateEvChargerInstallationMutation();
  const [updatePanelUpgrade] = useUpdatePanelUpgradeMutation();
  const [updateRemodeling] = useUpdateRemodelingMutation();
  const [updateAccessoryBuilding] = useUpdateAccessoryBuildingMutation();
  const [updateHotTub] = useUpdateHotTubMutation();
  const [updateDockPower] = useUpdateDockPowerMutation();
  const [updateElectric] = useUpdateElectricMutation();
  const [updateGenerator] = useUpdateGeneratorMutation();
  const [updateNewConstruction] = useUpdateNewConstructionMutation();
  const [updateHomeSurgeProtection] = useUpdateHomeSurgeProtectionMutation();
  const [updateStarlink] = useUpdateStarlinkMutation();
  const [updateDedicatedCircuit] = useUpdateDedicatedCircuitMutation();

  const saveForLater = async (
    id: string,
    serviceType: string,
    body: UpdateServiceCallPayload,
  ) => {
    setIsSaving(true);
    try {
      switch (serviceType) {
        case "EV Charger Installation":
          await updateEvCharger({ id, body }).unwrap();
          break;
        case "Panel Upgrade / Replacement":
          await updatePanelUpgrade({
            recordId: id,
            formData: body as any,
          }).unwrap();
          break;
        case "Remodeling":
          await updateRemodeling({
            recordId: id,
            formData: body as any,
          }).unwrap();
          break;
        case "Accessory Building / Shed Power":
          await updateAccessoryBuilding({
            recordId: id,
            formData: body as any,
          }).unwrap();
          break;
        case "Hot tub installation":
          await updateHotTub({ recordId: id, formData: body as any }).unwrap();
          break;
        case "Dock Power":
          await updateDockPower({
            recordId: id,
            formData: body as any,
          }).unwrap();
          break;
        case "Electric System":
          await updateElectric({
            recordId: id,
            formData: body as any,
          }).unwrap();
          break;
        case "Generator Installation":
          await updateGenerator({
            recordId: id,
            formData: body as any,
          }).unwrap();
          break;
        case "New Construction":
          await updateNewConstruction({
            recordId: id,
            formData: body as any,
          }).unwrap();
          break;
        case "Home Surge Protection":
          await updateHomeSurgeProtection({
            recordId: id,
            formData: body as any,
          }).unwrap();
          break;
        case "Starlink Installation":
          await updateStarlink({
            recordId: id,
            formData: body as any,
          }).unwrap();
          break;
        case "Dedicated Circuit Installation":
          await updateDedicatedCircuit({
            recordId: id,
            formData: body as any,
          }).unwrap();
          break;
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
