import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  initialAccessoryBuildingDetails,
  initialDockPowerDetails,
  initialElectricalInspectionDetails,
  initialEVChargerDetails,
  initialGeneratorDetails,
  initialHotTubDetails,
  initialNewConstructionDetails,
  initialPanelUpgradeDetails,
  initialRemodelingDetails,
  initialServiceCallDetails,
} from "@/src/types/serviceForm.initials";

import {
  AccessoryBuildingDetails,
  CategoryData_1,
  CategoryData_2,
  CategorySpecificData,
  ChargerType,
  ContactDetails,
  DockPowerDetails,
  ElectricalInspectionDetails,
  EVChargerDetails,
  GeneratorDetails,
  HotTubDetails,
  NewConstructionDetails,
  PanelUpgradeDetails,
  ProjectBasics,
  ProvidingCharger,
  RemodelingDetails,
  ServiceAddress,
  ServiceCallDetails,
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
    // selectCategory: (state, action: PayloadAction<string>) => {
    //   state.selectedCategoryId = action.payload;
    //   state.currentStep = 0;
    //   state.categoryData = getCategoryInitialData(action.payload);
    // },
    // serviceFormSlice.ts এ selectCategory reducer update করো
    selectCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategoryId = action.payload;
      state.currentStep = 0;
      // শুধু different category হলে reset করো
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
      if (state.categoryData && isServiceCall(state.categoryData)) {
        // Validate preferredTime if it's being updated
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
      if (state.categoryData && isServiceCall(state.categoryData)) {
        const tag = action.payload;
        const tags = state.categoryData.details.quickTags;
        state.categoryData.details.quickTags = tags.includes(tag)
          ? tags.filter((t) => t !== tag)
          : [...tags, tag];
      }
    },
    toggleSchedulingDay: (state, action: PayloadAction<string>) => {
      if (state.categoryData && isServiceCall(state.categoryData)) {
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
      if (state.categoryData && isEVCharger(state.categoryData)) {
        Object.assign(state.categoryData.details, action.payload);
      }
    },
    setEVChargerType: (state, action: PayloadAction<ChargerType>) => {
      if (state.categoryData && isEVCharger(state.categoryData)) {
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
      if (state.categoryData && isEVCharger(state.categoryData)) {
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
} = serviceFormSlice.actions;

export default serviceFormSlice.reducer;
