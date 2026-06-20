import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  initialAccessoryBuildingDetails,
  initialCeilingFanDetails,
  initialDedicatedCircuitDetails,
  initialDockPowerDetails,
  initialElectricalInspectionDetails,
  initialEVChargerDetails,
  initialExhaustFanDetails,
  initialGeneratorDetails,
  initialHotTubDetails,
  initialLightingDetails,
  initialNewConstructionDetails,
  initialOutletsDetails,
  initialPanelUpgradeDetails,
  initialRemodelingDetails,
  initialServiceCallDetails,
  initialStarlinkDetails,
  initialSurgeProtectionDetails,
  initialSwitchesDetails,
} from "@/src/types/serviceForm.initials";

import {
  AccessoryBuildingDetails,
  CategoryData_1,
  CategoryData_10,
  CategoryData_11,
  CategoryData_12,
  CategoryData_13,
  CategoryData_14,
  CategoryData_15,
  CategoryData_16,
  CategoryData_17,
  CategoryData_18,
  CategoryData_2,
  CategoryData_3,
  CategoryData_4,
  CategoryData_5,
  CategoryData_6,
  CategoryData_7,
  CategoryData_8,
  CategoryData_9,
  CategorySpecificData,
  CeilingFanDetails,
  ChargerType,
  ContactDetails,
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
  ProjectBasics,
  ProvidingCharger,
  RemodelingDetails,
  ServiceAddress,
  ServiceCallDetails,
  StarlinkDetails,
  SurgeProtectionDetails,
  SwitchesDetails,
} from "@/src/types/serviceForm.types";

// ============================================
// MAIN STATE
// ============================================
interface ServiceFormState {
  selectedCategoryId: string | null;
  currentStep: number;
  contactDetails: ContactDetails;
  serviceAddress: ServiceAddress;
  projectBasics: ProjectBasics;
  categoryData: CategorySpecificData | null;
}

// ============================================
// HELPER
// ============================================
const getCategoryInitialData = (categoryId: string): CategorySpecificData => {
  switch (categoryId) {
    case "1":
      return { categoryId: "1", details: { ...initialServiceCallDetails } };
    case "2":
      return { categoryId: "2", details: { ...initialEVChargerDetails } };
    case "3":
      return { categoryId: "3", details: { ...initialPanelUpgradeDetails } };
    case "4":
      return { categoryId: "4", details: { ...initialRemodelingDetails } };
    case "5":
      return {
        categoryId: "5",
        details: { ...initialAccessoryBuildingDetails },
      };
    case "6":
      return { categoryId: "6", details: { ...initialHotTubDetails } };
    case "7":
      return { categoryId: "7", details: { ...initialDockPowerDetails } };
    case "8":
      return {
        categoryId: "8",
        details: { ...initialElectricalInspectionDetails },
      };
    case "9":
      return { categoryId: "9", details: { ...initialGeneratorDetails } };
    case "10":
      return {
        categoryId: "10",
        details: { ...initialNewConstructionDetails },
      };
    // ─── New categories (ID 11 is Solar - skipped) ──────────────────────────
    case "11": // Whole Home Surge Protection
      return {
        categoryId: "11",
        details: { ...initialSurgeProtectionDetails },
      };
    case "12": // Starlink Installation
      return { categoryId: "12", details: { ...initialStarlinkDetails } };
    case "13": // Dedicated Circuit
      return {
        categoryId: "13",
        details: { ...initialDedicatedCircuitDetails },
      };
    case "14": // Exhaust Fan
      return { categoryId: "14", details: { ...initialExhaustFanDetails } };
    case "15": // Outlets
      return { categoryId: "15", details: { ...initialOutletsDetails } };
    case "16": // Switches
      return { categoryId: "16", details: { ...initialSwitchesDetails } };
    case "17": // Lighting
      return { categoryId: "17", details: { ...initialLightingDetails } };
    case "18": // Ceiling Fan
      return { categoryId: "18", details: { ...initialCeilingFanDetails } };
    default:
      return { categoryId, details: null };
  }
};

// ============================================
// TYPE GUARDS
// ============================================
function isServiceCall(data: CategorySpecificData): data is CategoryData_1 {
  return data.categoryId === "1";
}
function isEVCharger(data: CategorySpecificData): data is CategoryData_2 {
  return data.categoryId === "2";
}
function isPanelUpgrade(data: CategorySpecificData): data is CategoryData_3 {
  return data.categoryId === "3";
}
function isRemodeling(data: CategorySpecificData): data is CategoryData_4 {
  return data.categoryId === "4";
}
function isAccessoryBuilding(
  data: CategorySpecificData,
): data is CategoryData_5 {
  return data.categoryId === "5";
}
function isHotTub(data: CategorySpecificData): data is CategoryData_6 {
  return data.categoryId === "6";
}
function isDockPower(data: CategorySpecificData): data is CategoryData_7 {
  return data.categoryId === "7";
}
function isElectricalInspection(
  data: CategorySpecificData,
): data is CategoryData_8 {
  return data.categoryId === "8";
}
function isGenerator(data: CategorySpecificData): data is CategoryData_9 {
  return data.categoryId === "9";
}
function isNewConstruction(
  data: CategorySpecificData,
): data is CategoryData_10 {
  return data.categoryId === "10";
}
function isSurgeProtection(
  data: CategorySpecificData,
): data is CategoryData_11 {
  return data.categoryId === "11";
}
function isStarlink(data: CategorySpecificData): data is CategoryData_12 {
  return data.categoryId === "12";
}
function isDedicatedCircuit(
  data: CategorySpecificData,
): data is CategoryData_13 {
  return data.categoryId === "13";
}
function isExhaustFan(data: CategorySpecificData): data is CategoryData_14 {
  return data.categoryId === "14";
}
function isOutlets(data: CategorySpecificData): data is CategoryData_15 {
  return data.categoryId === "15";
}
function isSwitches(data: CategorySpecificData): data is CategoryData_16 {
  return data.categoryId === "16";
}
function isLighting(data: CategorySpecificData): data is CategoryData_17 {
  return data.categoryId === "17";
}
function isCeilingFan(data: CategorySpecificData): data is CategoryData_18 {
  return data.categoryId === "18";
}

// ============================================
// INITIAL STATE
// ============================================
const initialState: ServiceFormState = {
  selectedCategoryId: null,
  currentStep: 0,
  contactDetails: {
    fullName: "",
    email: "",
    phone: "",
    preferredContact: "Call",
  },
  serviceAddress: {
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    isHomeAddress: false,
  },
  projectBasics: {
    propertyType: "",
    ownershipStatus: "",
    timeline: "",
    ownershipStatusOther: "",
  },
  categoryData: null,
};

// ============================================
// SLICE
// ============================================
const serviceFormSlice = createSlice({
  name: "serviceForm",
  initialState,
  reducers: {
    // --- Navigation ---
    selectCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategoryId = action.payload;
      state.currentStep = 0;
      if (state.categoryData?.categoryId !== action.payload) {
        state.categoryData = getCategoryInitialData(action.payload);
      }
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      if (state.currentStep > 0) state.currentStep -= 1;
    },

    // --- Common ---
    updateContactDetails: (
      state,
      action: PayloadAction<Partial<ContactDetails>>,
    ) => {
      state.contactDetails = { ...state.contactDetails, ...action.payload };
    },
    updateServiceAddress: (
      state,
      action: PayloadAction<Partial<ServiceAddress>>,
    ) => {
      state.serviceAddress = { ...state.serviceAddress, ...action.payload };
    },
    updateProjectBasics: (
      state,
      action: PayloadAction<Partial<ProjectBasics>>,
    ) => {
      state.projectBasics = { ...state.projectBasics, ...action.payload };
    },

    // --- id: "1" ---
    updateServiceCallDetails: (
      state,
      action: PayloadAction<Partial<ServiceCallDetails>>,
    ) => {
      if (
        state.categoryData &&
        isServiceCall(state.categoryData) &&
        state.categoryData.details
      ) {
        const updates = { ...action.payload };
        if (updates.preferredTime !== undefined) {
          const validPreferredTime = updates.preferredTime as
            | "AM (8-11)"
            | "PM (12-2)"
            | "";
          updates.preferredTime = validPreferredTime;
        }
        Object.assign(state.categoryData.details, updates);
      }
    },
    toggleServiceCallTag: (state, action: PayloadAction<string>) => {
      if (
        state.categoryData &&
        isServiceCall(state.categoryData) &&
        state.categoryData.details
      ) {
        const tag = action.payload;
        const tags = state.categoryData.details.quickTags;
        state.categoryData.details.quickTags = tags.includes(tag)
          ? tags.filter((t) => t !== tag)
          : [...tags, tag];
      }
    },
    toggleSchedulingDay: (state, action: PayloadAction<string>) => {
      if (
        state.categoryData &&
        isServiceCall(state.categoryData) &&
        state.categoryData.details
      ) {
        const day = action.payload;
        const days = state.categoryData.details.schedulingDays;
        state.categoryData.details.schedulingDays = days.includes(day)
          ? days.filter((d) => d !== day)
          : [...days, day];
      }
    },

    // --- id: "2" ---
    updateEVChargerDetails: (
      state,
      action: PayloadAction<Partial<EVChargerDetails>>,
    ) => {
      if (
        state.categoryData &&
        isEVCharger(state.categoryData) &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },
    setEVChargerType: (state, action: PayloadAction<ChargerType>) => {
      if (
        state.categoryData &&
        isEVCharger(state.categoryData) &&
        state.categoryData.details
      ) {
        state.categoryData.details.chargerType = action.payload;
        if (action.payload === "I want help deciding") {
          state.categoryData.details.nemaConfig = "";
          state.categoryData.details.providingCharger = "";
          state.categoryData.details.chargerStatus = "";
        }
        if (action.payload !== "Plug-in") {
          state.categoryData.details.nemaConfig = "";
        }
      }
    },
    setEVProvidingCharger: (state, action: PayloadAction<ProvidingCharger>) => {
      if (
        state.categoryData &&
        isEVCharger(state.categoryData) &&
        state.categoryData.details
      ) {
        state.categoryData.details.providingCharger = action.payload;
        if (action.payload === "No") {
          state.categoryData.details.chargerStatus = "";
        }
      }
    },

    // --- id: "3" ---
    updatePanelUpgradeDetails: (
      state,
      action: PayloadAction<Partial<PanelUpgradeDetails>>,
    ) => {
      if (
        state.categoryData?.categoryId === "3" &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "4" ---
    updateRemodelingDetails: (
      state,
      action: PayloadAction<Partial<RemodelingDetails>>,
    ) => {
      if (
        state.categoryData?.categoryId === "4" &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "5" ---
    updateAccessoryBuildingDetails: (
      state,
      action: PayloadAction<Partial<AccessoryBuildingDetails>>,
    ) => {
      if (
        state.categoryData?.categoryId === "5" &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "6" ---
    updateHotTubDetails: (
      state,
      action: PayloadAction<Partial<HotTubDetails>>,
    ) => {
      if (
        state.categoryData?.categoryId === "6" &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "7" ---
    updateDockPowerDetails: (
      state,
      action: PayloadAction<Partial<DockPowerDetails>>,
    ) => {
      if (
        state.categoryData?.categoryId === "7" &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "8" ---
    updateElectricalInspectionDetails: (
      state,
      action: PayloadAction<Partial<ElectricalInspectionDetails>>,
    ) => {
      if (
        state.categoryData?.categoryId === "8" &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "9" ---
    updateGeneratorDetails: (
      state,
      action: PayloadAction<Partial<GeneratorDetails>>,
    ) => {
      if (
        state.categoryData?.categoryId === "9" &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "10" ---
    updateNewConstructionDetails: (
      state,
      action: PayloadAction<Partial<NewConstructionDetails>>,
    ) => {
      if (
        state.categoryData?.categoryId === "10" &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "11" - Whole Home Surge Protection ---
    updateSurgeProtectionDetails: (
      state,
      action: PayloadAction<Partial<SurgeProtectionDetails>>,
    ) => {
      if (
        state.categoryData &&
        isSurgeProtection(state.categoryData) &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "12" - Starlink Installation ---
    updateStarlinkDetails: (
      state,
      action: PayloadAction<Partial<StarlinkDetails>>,
    ) => {
      if (
        state.categoryData &&
        isStarlink(state.categoryData) &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "13" - Dedicated Circuit ---
    updateDedicatedCircuitDetails: (
      state,
      action: PayloadAction<Partial<DedicatedCircuitDetails>>,
    ) => {
      if (
        state.categoryData &&
        isDedicatedCircuit(state.categoryData) &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "14" - Exhaust Fan ---
    updateExhaustFanDetails: (
      state,
      action: PayloadAction<Partial<ExhaustFanDetails>>,
    ) => {
      if (
        state.categoryData &&
        isExhaustFan(state.categoryData) &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "15" - Outlets ---
    updateOutletsDetails: (
      state,
      action: PayloadAction<Partial<OutletsDetails>>,
    ) => {
      if (
        state.categoryData &&
        isOutlets(state.categoryData) &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "16" - Switches ---
    updateSwitchesDetails: (
      state,
      action: PayloadAction<Partial<SwitchesDetails>>,
    ) => {
      if (
        state.categoryData &&
        isSwitches(state.categoryData) &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "17" - Lighting ---
    updateLightingDetails: (
      state,
      action: PayloadAction<Partial<LightingDetails>>,
    ) => {
      if (
        state.categoryData &&
        isLighting(state.categoryData) &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- id: "18" - Ceiling Fan ---
    updateCeilingFanDetails: (
      state,
      action: PayloadAction<Partial<CeilingFanDetails>>,
    ) => {
      if (
        state.categoryData &&
        isCeilingFan(state.categoryData) &&
        state.categoryData.details
      ) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },

    // --- Reset ---
    clearServiceForm: () => initialState,
    clearCategoryData: (state) => {
      if (state.selectedCategoryId) {
        state.categoryData = getCategoryInitialData(state.selectedCategoryId);
      }
    },
  },
});

export const {
  selectCategory,
  setCurrentStep,
  nextStep,
  prevStep,
  updateContactDetails,
  updateServiceAddress,
  updateProjectBasics,
  updateServiceCallDetails,
  toggleServiceCallTag,
  toggleSchedulingDay,
  updateEVChargerDetails,
  setEVChargerType,
  setEVProvidingCharger,
  updatePanelUpgradeDetails,
  updateRemodelingDetails,
  updateAccessoryBuildingDetails,
  clearServiceForm,
  clearCategoryData,
  updateHotTubDetails,
  updateDockPowerDetails,
  updateElectricalInspectionDetails,
  updateNewConstructionDetails,
  updateGeneratorDetails,
  // ─── New exports ────────────────────────────────────────────────────────────
  updateSurgeProtectionDetails,
  updateStarlinkDetails,
  updateDedicatedCircuitDetails,
  updateExhaustFanDetails,
  updateOutletsDetails,
  updateSwitchesDetails,
  updateLightingDetails,
  updateCeilingFanDetails,
} = serviceFormSlice.actions;

export default serviceFormSlice.reducer;
