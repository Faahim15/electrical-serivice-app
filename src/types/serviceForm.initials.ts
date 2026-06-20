import type {
  AccessoryBuildingDetails,
  CeilingFanDetails,
  DedicatedCircuitDetails,
  DockPowerDetails,
  ElectricalInspectionDetails,
  EVChargerDetails,
  ExhaustFanDetails,
  GeneratorDetails,
  HotTubDetails,
  LightingDetails,
  NewConstructionDetails,
  OutletsDetails,
  PanelUpgradeDetails,
  RemodelingDetails,
  ServiceCallDetails,
  StarlinkDetails,
  SurgeProtectionDetails,
  SwitchesDetails,
} from "./serviceForm.types";

export const initialServiceCallDetails: ServiceCallDetails = {
  projectDetails: "",
  preferredTime: "",
  schedulingDays: [],
  additionalNotes: "",
  quickTags: [],
  panelPhotos: [],
  workAreaPhotos: [],
  referencePhotos: [],
};

export const initialEVChargerDetails: EVChargerDetails = {
  chargerType: "",
  nemaConfig: "",
  providingCharger: "",
  chargerStatus: "",
  installationLocation: "",
  panelLocation: "",
  panelDistance: "",
  additionalInfo: "",
  chargerAreaPhotos: [],
  panelPhotos: [],
  panelLocationOther: "",
  installationLocationOther: "",
};

export const initialPanelUpgradeDetails: PanelUpgradeDetails = {
  serviceType: "",
  upgradeAmps: "",
  currentAmperage: "",
  powerType: "",
  panelLocation: "",
  additionalInfo: "",
  meterPhotos: [],
  panelPhotos: [],
  currentAmperageOther: "",
  panelLocationOther: "",
};

export const initialRemodelingDetails: RemodelingDetails = {
  panelLocation: "",
  remodlingArea: "",
  hasPlans: "",
  planPhotos: [],
  electricalNeeds: "",
  hasPermit: "",
  permitNumber: "",
  additionalInfo: "",
  existingSpacePhotos: [],
  panelPhotos: [],
  panelLocationOther: "",
};

export const initialAccessoryBuildingDetails: AccessoryBuildingDetails = {
  squareFootage: "",
  intendedUse: "",
  buildingStatus: "",
  constructionType: "",
  floorType: "",
  electricalNeeds: "",
  hasHeatingCooling: "",
  serviceType: "",
  newServiceSize: "",
  subPanelSize: "",
  circuitCount: "",
  ampRating: "",
  panelLocation: "",
  panelPhotos: [],
  privateUtilities: "",
  routeDistance: "",
  existingSpacePhotos: [],
  hasPlans: "",
  planDrawingPhotos: [],
  hasPermit: "",
  permitNumber: "",
  additionalInfo: "",

  panelLocationOther: "", // add করো
  newServiceSizeOther: "", // add করো
  subPanelSizeOther: "", // add করো
};

export const initialHotTubDetails: HotTubDetails = {
  hasUserManual: "",
  userManualPhotos: [],
  manufacturer: "",
  modelNumber: "",
  amperage: "",
  placement: "",
  panelLocation: "",
  panelDistance: "",
  additionalInfo: "",
  panelPhotos: [],
  installLocationPhotos: [],
  receptaclePhotos: [],

  placementOther: "", // add করো
  panelLocationOther: "", // add করো
};

export const initialDockPowerDetails: DockPowerDetails = {
  dockBuilt: "",
  electricalNeeds: "",
  receptacleCount: "",
  serviceType: "",
  newServiceSize: "",
  subPanelSize: "",
  circuitCount: "",
  ampRating: "",
  panelLocation: "",
  panelPhotos: [],
  privateUtilities: "",
  routeDistance: "",
  existingSpacePhotos: [],
  hasPlans: "",
  planDrawingPhotos: [],
  hasPermit: "",
  permitNumber: "",
  additionalInfo: "",
  panelLocationOther: "", // add করো
  newServiceSizeOther: "", // add করো
  subPanelSizeOther: "", // add করো
};

export const initialElectricalInspectionDetails: ElectricalInspectionDetails = {
  inspectionType: "",
  squareFootage: "",
  panelCount: "",
  panelPhotos: [],
  additionalInfo: "",
};

export const initialGeneratorDetails: GeneratorDetails = {
  generatorType: "",
  hasGenerator: "",
  kwOutput: "",
  backupInstallation: "",
  generatorPhotos: [],
  panelDistance: "",
  panelLocation: "",
  purchaseSize: "",
  backedUpCircuits: "",
  hasPropane: "",
  panelLocations: "",
  panelPhotos: [],
  installLocationPhotos: [],
  panelLocationOther: "",
  // ✅ ADD THIS
  meterPhotos: [],
};

export const initialNewConstructionDetails: NewConstructionDetails = {
  constructionBegun: "",
  constructionStage: "",
  buildingPlanPhotos: [],
  hasBuildingPlans: "",
  buildingPlanPhotos2: [],
};

// ============================================
// id: "11" - Home Surge Protection
// ============================================
export const initialSurgeProtectionDetails: SurgeProtectionDetails = {
  panelPhotos: [],
  additionalNotes: "",
};

// ============================================
// id: "12" - Starlink Installation
// ============================================
export const initialStarlinkDetails: StarlinkDetails = {
  haveStarlinkEquipment: "",
  haveMountingEquipment: "",
  dishLocation: "",
  whenHaveEquipment: "", // ← Add this
  roomOfRouterIn: "", // ← Add this
  roomCondition: "", // ← Add this
  areaOfInstallationPhotos: [],
  photosOfRoomForRouter: [],
  additionalNotes: "",
};

// ============================================
// id: "13" - Dedicated Circuit
// ============================================
export const initialDedicatedCircuitDetails: DedicatedCircuitDetails = {
  circuitType: "",
  circuitLocation: "",
  numberOfCircuits: "",
  intendedUse: "",
  panelPhotos: [],
  additionalNotes: "",
  locationOther: "",

  // ─── New fields for dedicated circuit ──────────────────────────────────────
  whyNeedDedicatedCircuit: "",
  whyNeedDedicatedCircuitOther: "",
  electricalPanelLocation: "",
  electricalPanelLocationOther: "",
  whereWillDedicatedCircuitInstalled: "",
  aboveBelowArea: "",
  distanceElectricalPanelToInstallationArea: "",
  distanceElectricalPanelToInstallationAreaOther: "",
  ampsNeeded: "",
  voltsNeeded: "",
  NEMAConfiguration: "",
  photosOfElectricalMeter: [],
  photosOfInstallationLocation: [],
};

// ============================================
// id: "14" - Exhaust Fan
// ============================================
export const initialExhaustFanDetails: ExhaustFanDetails = {
  fanType: "",
  installationType: "",
  existingFan: "",
  fanLocation: "",
  panelPhotos: [],
  additionalNotes: "",
  // ─── New fields ──────────────────────────────────────────────────────────────
  atticFanType: "",
  stories: "",
  panelLocation: "",
  photosOfInstallationArea: [], // ← Add this
};

// ============================================
// id: "15" - Outlets
// ============================================
export const initialOutletsDetails: OutletsDetails = {
  numberOfOutlets: "",
  outletType: "",
  outletLocation: "",
  intendedUse: "",
  isDedicatedCircuit: "",
  panelPhotos: [],
  additionalNotes: "",
};

// ============================================
// id: "16" - Switches
// ============================================
export const initialSwitchesDetails: SwitchesDetails = {
  numberOfSwitches: "",
  switchType: "",
  switchLocation: "",
  existingWiring: "",
  panelPhotos: [],
  additionalNotes: "",
};

// ============================================
// id: "17" - Lighting
// ============================================
export const initialLightingDetails: LightingDetails = {
  numberOfFixtures: "",
  lightingType: "",
  lightingLocation: "",
  existingWiring: "",
  panelPhotos: [],
  additionalNotes: "",
};

// ============================================
// id: "18" - Ceiling Fan
// ============================================
export const initialCeilingFanDetails: CeilingFanDetails = {
  fanSize: "",
  fanLocation: "",
  hasLightKit: "",
  existingWiring: "",
  panelPhotos: [],
  additionalNotes: "",
  locationOther: "",
};
