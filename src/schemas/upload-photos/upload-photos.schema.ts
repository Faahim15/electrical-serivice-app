// src/schemas/upload-photos/upload-photos.schema.ts

import { z } from "zod";

// ─── Service Call (Electrical) Schema ──────────────────────────────────────
export const uploadPhotosSchema = z.object({
  panelPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one panel photo"),
  workAreaPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one work area photo"),
  referencePhotos: z
    .array(z.string())
    .min(1, "Please upload at least one reference photo"),
});

export type UploadPhotosFormData = z.infer<typeof uploadPhotosSchema>;

// ─── EV Charger Schema ──────────────────────────────────────────────────────
export const evChargerUploadSchema = z.object({
  chargerAreaPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the installation area"),
  panelPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical panel"),
});

export type EvChargerUploadFormData = z.infer<typeof evChargerUploadSchema>;

// ─── Panel Upgrade Schema ──────────────────────────────────────────────────
export const panelUpgradeUploadSchema = z.object({
  meterPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical meter"),
  panelPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical panel"),
});

export type PanelUpgradeUploadFormData = z.infer<
  typeof panelUpgradeUploadSchema
>;

// ─── Remodeling Schema ──────────────────────────────────────────────────────
export const remodelingUploadPhotosSchema = z.object({
  existingSpacePhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the existing space"),
  panelPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical panel"),
});

export type RemodelingUploadPhotosFormData = z.infer<
  typeof remodelingUploadPhotosSchema
>;

// ─── Accessory Building Schema ──────────────────────────────────────────────
export const accessoryBuildingPhotosSchema = z.object({
  existingSpacePhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the route"),
  panelPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical panel"),
});

export type AccessoryBuildingPhotosFormData = z.infer<
  typeof accessoryBuildingPhotosSchema
>;

// ─── Hot Tub Schema ──────────────────────────────────────────────────────────
export const hotTubPhotosSchema = z.object({
  panelPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical panel"),
  installLocationPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the installation location"),
  receptaclePhotos: z
    .array(z.string())
    .min(
      1,
      "Please upload at least one photo of the receptacle/disconnect location",
    ),
});

export type HotTubPhotosFormData = z.infer<typeof hotTubPhotosSchema>;

// ─── Dock Power Schema ──────────────────────────────────────────────────────
export const dockPowerPhotosSchema = z.object({
  existingSpacePhotos: z
    .array(z.string())
    .min(
      1,
      "Please upload at least one photo of the dock and surrounding area",
    ),
  panelPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical panel"),
});

export type DockPowerPhotosFormData = z.infer<typeof dockPowerPhotosSchema>;

// ─── Electrical Inspection Schema ──────────────────────────────────────────
export const electricalInspectionPhotosSchema = z.object({
  panelPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical panel"),
});

export type ElectricalInspectionPhotosFormData = z.infer<
  typeof electricalInspectionPhotosSchema
>;

// ─── Generator Schema ──────────────────────────────────────────────────────
export const generatorPhotosSchema = z.object({
  panelPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical panel"),
  generatorPhotos: z.array(z.string()).optional(),
  meterPhotos: z.array(z.string()).optional(),
  installLocationPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the installation location"),
});

export type GeneratorPhotosFormData = z.infer<typeof generatorPhotosSchema>;

// ─── Generator Whole Home Schema ──────────────────────────────────────────
export const generatorPhotosWholeHomeSchema = z.object({
  panelPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical panel"),
  generatorPhotos: z.array(z.string()).optional(),
  meterPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical meter"),
  installLocationPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the installation location"),
});

export type GeneratorPhotosWholeHomeFormData = z.infer<
  typeof generatorPhotosWholeHomeSchema
>;

// ─── New Construction Schema ──────────────────────────────────────────────
export const newConstructionPhotosSchema = z.object({
  buildingPlanPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the building plans"),
});

export type NewConstructionPhotosFormData = z.infer<
  typeof newConstructionPhotosSchema
>;

// ─── Surge Protection Schema ──────────────────────────────────────────────
export const surgeProtectionPhotosSchema = z.object({
  panelPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical panel"),
});

export type SurgeProtectionPhotosFormData = z.infer<
  typeof surgeProtectionPhotosSchema
>;

// ─── Starlink Schema ──────────────────────────────────────────────────────
export const starlinkPhotosSchema = z.object({
  areaOfInstallationPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the installation area"),
});

export type StarlinkPhotosFormData = z.infer<typeof starlinkPhotosSchema>;

// ─── Starlink Router Schema ──────────────────────────────────────────────
export const starlinkRouterSchema = z.object({
  photosOfRoomForRouter: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the room for the WiFi router"),
});

export type StarlinkRouterFormData = z.infer<typeof starlinkRouterSchema>;

// ─── Dedicated Circuit Schema ──────────────────────────────────────────────
export const dedicatedCircuitPhotosSchema = z.object({
  photosOfElectricalMeter: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the electrical meter"),
  photosOfInstallationLocation: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the installation location"),
});

export type DedicatedCircuitPhotosFormData = z.infer<
  typeof dedicatedCircuitPhotosSchema
>;

// ─── Exhaust Fan Schema ──────────────────────────────────────────────────────
export const exhaustFanPhotosSchema = z.object({
  photosOfInstallationArea: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the installation area"),
  photoOfNewFan: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the new fan"),
});

export type ExhaustFanPhotosFormData = z.infer<typeof exhaustFanPhotosSchema>;

// ─── Exhaust Fan Panel Photos Schema ──────────────────────────────────────
export const exhaustFanPanelPhotosSchema = z.object({
  panelClosePhotos: z
    .array(z.string())
    .min(
      1,
      "Please upload at least one close-up photo of the electrical panel",
    ),
  panelWidePhotos: z
    .array(z.string())
    .min(
      1,
      "Please upload at least one wide shot photo of the electrical panel",
    ),
});

export type ExhaustFanPanelPhotosFormData = z.infer<
  typeof exhaustFanPanelPhotosSchema
>;

// src/schemas/upload-photos/upload-photos.schema.ts
// Add this to your existing schema file

// ─── Outlet Schema ──────────────────────────────────────────────────────────
export const outletPhotosSchema = z.object({
  photosOfWhereOutletsInstall: z
    .array(z.string())
    .min(
      1,
      "Please upload at least one photo of where the outlet(s) will be installed",
    ),
});

export type OutletPhotosFormData = z.infer<typeof outletPhotosSchema>;
// src/schemas/upload-photos/upload-photos.schema.ts
// Add this to your existing schema file

// ─── Switches Schema ──────────────────────────────────────────────────────────
export const switchesPhotosSchema = z.object({
  photosOfWhereSwitchesInstallationNeeded: z
    .array(z.string())
    .min(
      1,
      "Please upload at least one photo of where the switch(es) will be installed",
    ),
});

export type SwitchesPhotosFormData = z.infer<typeof switchesPhotosSchema>;

// src/schemas/upload-photos/upload-photos.schema.ts
// Add this to your existing schema file

// ─── Lighting Schema ──────────────────────────────────────────────────────────
// src/schemas/upload-photos/upload-photos.schema.ts
// Add these schemas to your existing file

// ─── Interior Lighting Schema ──────────────────────────────────────────────
export const interiorLightingPhotosSchema = z.object({
  photosOfWhereWantToInstall: z
    .array(z.string())
    .min(
      1,
      "Please upload at least one photo of where you want to install the lighting",
    ),
});

export type InteriorLightingPhotosFormData = z.infer<
  typeof interiorLightingPhotosSchema
>;

// ─── Flood Lights Schema ──────────────────────────────────────────────────
export const floodLightPhotosSchema = z.object({
  photosOfInstallationAreaFloodLight: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the installation area"),
});

export type FloodLightPhotosFormData = z.infer<typeof floodLightPhotosSchema>;
