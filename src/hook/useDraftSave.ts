import {
  useCreateEvChargerInstallationMutation,
  useCreateServiceCallMutation,
  useUpdateEvChargerInstallationMutation,
  useUpdateServiceCallMutation,
} from "@/src/redux/api-slices/quote/quote-api";

import {
  useCreatePanelUpgradeMutation,
  useUpdatePanelUpgradeMutation,
} from "../redux/api-slices/quote/quote-api-two";

import {
  useCreateRemodelingMutation,
  useUpdateRemodelingMutation,
} from "../redux/api-slices/quote/remodeling-api";

import {
  useCreateDedicatedCircuitMutation,
  useUpdateDedicatedCircuitMutation,
} from "@/src/redux/api-slices/quote/dedicatedCircuitApi";
import {
  useCreateDockPowerMutation,
  useUpdateDockPowerMutation,
} from "@/src/redux/api-slices/quote/dockPowerApi";
import {
  useCreateElectricMutation,
  useUpdateElectricMutation,
} from "@/src/redux/api-slices/quote/electricApi";
import {
  useCreateGeneratorMutation,
  useUpdateGeneratorMutation,
} from "@/src/redux/api-slices/quote/generatorApi";
import {
  useCreateHomeSurgeProtectionMutation,
  useUpdateHomeSurgeProtectionMutation,
} from "@/src/redux/api-slices/quote/homeSurgeProtectionApi";
import {
  useCreateHotTubMutation,
  useUpdateHotTubMutation,
} from "@/src/redux/api-slices/quote/hotTubApi";
import {
  useCreateNewConstructionMutation,
  useUpdateNewConstructionMutation,
} from "@/src/redux/api-slices/quote/newConstructionApi";
import {
  useCreateAccessoryBuildingMutation,
  useUpdateAccessoryBuildingMutation,
} from "../redux/api-slices/quote/accessory-building-api";
import {
  useCreateStarlinkMutation,
  useUpdateStarlinkMutation,
} from "../redux/api-slices/quote/starLinkApi";

import { useState } from "react";

export type DraftStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "quoted"
  | "scheduled"
  | "completed"
  | "cancelled";

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

export type DraftPayload = DraftCommonPayload | FormData;

export const useDraftSave = () => {
  // ─── Service Call ────────────────────────────────────────────────────────────
  const [createServiceCall, { isLoading: isCreatingServiceCall }] =
    useCreateServiceCallMutation();
  const [updateServiceCall, { isLoading: isUpdatingServiceCall }] =
    useUpdateServiceCallMutation();

  // ─── EV Charger ──────────────────────────────────────────────────────────────
  const [createEvCharger, { isLoading: isCreatingEvCharger }] =
    useCreateEvChargerInstallationMutation();
  const [updateEvCharger, { isLoading: isUpdatingEvCharger }] =
    useUpdateEvChargerInstallationMutation();

  // ─── Panel Upgrade ───────────────────────────────────────────────────────────
  const [createPanelUpgrade, { isLoading: isCreatingPanelUpgrade }] =
    useCreatePanelUpgradeMutation();
  const [updatePanelUpgrade, { isLoading: isUpdatingPanelUpgrade }] =
    useUpdatePanelUpgradeMutation();

  // ─── Remodeling ──────────────────────────────────────────────────────────────
  const [createRemodeling, { isLoading: isCreatingRemodeling }] =
    useCreateRemodelingMutation();
  const [updateRemodeling, { isLoading: isUpdatingRemodeling }] =
    useUpdateRemodelingMutation();

  // ─── Accessory Building ──────────────────────────────────────────────────────
  const [createAccessoryBuilding, { isLoading: isCreatingAccessoryBuilding }] =
    useCreateAccessoryBuildingMutation();
  const [updateAccessoryBuilding, { isLoading: isUpdatingAccessoryBuilding }] =
    useUpdateAccessoryBuildingMutation();

  // ─── Hot Tub ─────────────────────────────────────────────────────────────────
  const [createHotTub, { isLoading: isCreatingHotTub }] =
    useCreateHotTubMutation();
  const [updateHotTub, { isLoading: isUpdatingHotTub }] =
    useUpdateHotTubMutation();

  // ─── Dock Power ──────────────────────────────────────────────────────────────
  const [createDockPower, { isLoading: isCreatingDockPower }] =
    useCreateDockPowerMutation();
  const [updateDockPower, { isLoading: isUpdatingDockPower }] =
    useUpdateDockPowerMutation();

  // ─── Electric ────────────────────────────────────────────────────────────────
  const [createElectric, { isLoading: isCreatingElectric }] =
    useCreateElectricMutation();
  const [updateElectric, { isLoading: isUpdatingElectric }] =
    useUpdateElectricMutation();

  // ─── Generator ───────────────────────────────────────────────────────────────
  const [createGenerator, { isLoading: isCreatingGenerator }] =
    useCreateGeneratorMutation();
  const [updateGenerator, { isLoading: isUpdatingGenerator }] =
    useUpdateGeneratorMutation();

  // ─── New Construction ────────────────────────────────────────────────────────
  const [createNewConstruction, { isLoading: isCreatingNewConstruction }] =
    useCreateNewConstructionMutation();
  const [updateNewConstruction, { isLoading: isUpdatingNewConstruction }] =
    useUpdateNewConstructionMutation();

  // ─── Home Surge Protection ───────────────────────────────────────────────────
  const [
    createHomeSurgeProtection,
    { isLoading: isCreatingHomeSurgeProtection },
  ] = useCreateHomeSurgeProtectionMutation();
  const [
    updateHomeSurgeProtection,
    { isLoading: isUpdatingHomeSurgeProtection },
  ] = useUpdateHomeSurgeProtectionMutation();

  // ─── Starlink ────────────────────────────────────────────────────────────────
  const [createStarlink, { isLoading: isCreatingStarlink }] =
    useCreateStarlinkMutation();
  const [updateStarlink, { isLoading: isUpdatingStarlink }] =
    useUpdateStarlinkMutation();

  // ─── Dedicated Circuit ───────────────────────────────────────────────────────
  const [createDedicatedCircuit, { isLoading: isCreatingDedicatedCircuit }] =
    useCreateDedicatedCircuitMutation();
  const [updateDedicatedCircuit, { isLoading: isUpdatingDedicatedCircuit }] =
    useUpdateDedicatedCircuitMutation();

  const [isSavingExtra, setIsSavingExtra] = useState(false);

  const isSaving =
    isCreatingServiceCall ||
    isUpdatingServiceCall ||
    isCreatingEvCharger ||
    isUpdatingEvCharger ||
    isCreatingPanelUpgrade ||
    isUpdatingPanelUpgrade ||
    isCreatingRemodeling ||
    isUpdatingRemodeling ||
    isCreatingAccessoryBuilding ||
    isUpdatingAccessoryBuilding ||
    isCreatingHotTub ||
    isUpdatingHotTub ||
    isCreatingDockPower ||
    isUpdatingDockPower ||
    isCreatingElectric ||
    isUpdatingElectric ||
    isCreatingGenerator ||
    isUpdatingGenerator ||
    isCreatingNewConstruction ||
    isUpdatingNewConstruction ||
    isCreatingHomeSurgeProtection ||
    isUpdatingHomeSurgeProtection ||
    isCreatingStarlink ||
    isUpdatingStarlink ||
    isCreatingDedicatedCircuit ||
    isUpdatingDedicatedCircuit ||
    isSavingExtra;

  // ─── Create (no existing draft yet) ─────────────────────────────────────────
  const createDraft = async (serviceType: string, body: DraftPayload) => {
    switch (serviceType) {
      case "EV Charger Installation":
        return createEvCharger(body as any).unwrap();
      case "Panel Upgrade / Replacement":
        return createPanelUpgrade(body as any).unwrap();
      case "Remodeling":
        return createRemodeling(body as any).unwrap();
      case "Accessory Building / Shed Power":
        return createAccessoryBuilding(body as any).unwrap();
      case "Hot tub installation":
        return createHotTub(body as any).unwrap();
      case "Dock Power":
        return createDockPower(body as any).unwrap();
      case "Electric System":
        return createElectric(body as any).unwrap();
      case "Generator Installation":
        return createGenerator(body as any).unwrap();
      case "New Construction":
        return createNewConstruction(body as any).unwrap();
      case "Home Surge Protection":
        return createHomeSurgeProtection(body as any).unwrap();
      case "Starlink Installation":
        return createStarlink(body as any).unwrap();
      case "Dedicated Circuit Installation":
        return createDedicatedCircuit(body as any).unwrap();
      case "Service Call":
      default:
        return createServiceCall(body as any).unwrap();
    }
  };

  // ─── Update (resuming an existing draft) ────────────────────────────────────
  const updateDraft = async (
    id: string,
    serviceType: string,
    body: DraftPayload,
  ) => {
    switch (serviceType) {
      case "EV Charger Installation":
        return updateEvCharger({ id, body: body as FormData }).unwrap();
      case "Panel Upgrade / Replacement":
        return updatePanelUpgrade({
          recordId: id,
          formData: body as FormData,
        }).unwrap();
      case "Remodeling":
        return updateRemodeling({
          recordId: id,
          formData: body as FormData,
        }).unwrap();
      case "Accessory Building / Shed Power":
        return updateAccessoryBuilding({
          recordId: id,
          formData: body as FormData,
        }).unwrap();
      case "Hot tub installation":
        return updateHotTub({
          recordId: id,
          formData: body as FormData,
        }).unwrap();
      case "Dock Power":
        return updateDockPower({
          recordId: id,
          formData: body as FormData,
        }).unwrap();
      case "Electric System":
        return updateElectric({
          recordId: id,
          formData: body as FormData,
        }).unwrap();
      case "Generator Installation":
        return updateGenerator({
          recordId: id,
          formData: body as FormData,
        }).unwrap();
      case "New Construction":
        return updateNewConstruction({
          recordId: id,
          formData: body as FormData,
        }).unwrap();
      case "Home Surge Protection":
        return updateHomeSurgeProtection({
          recordId: id,
          formData: body as FormData,
        }).unwrap();
      case "Starlink Installation":
        return updateStarlink({
          recordId: id,
          formData: body as FormData,
        }).unwrap();
      case "Dedicated Circuit Installation":
        return updateDedicatedCircuit({
          recordId: id,
          formData: body as FormData,
        }).unwrap();
      case "Service Call":
      default:
        return updateServiceCall({ id, body: body as any }).unwrap();
    }
  };

  return { createDraft, updateDraft, isSaving };
};
