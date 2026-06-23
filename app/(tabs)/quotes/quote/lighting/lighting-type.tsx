import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  selectCategory,
  updateLightingDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { LightingRecord } from "@/src/types/quotes/lighting.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

// ─── Import reusable components ──────────────────────────────────────────────
import { TwoColGrid } from "@/src/components/lighting/LightingOptionGrid";
import {
  DrivewaySection,
  FloodLightsSection,
  InteriorSection,
  LandscapeSection,
  PoleAreaSection,
  WallCoachSection,
} from "@/src/components/lighting/sections";
import { useLighting } from "@/src/hook/useLighting";

const CURRENT_STEP = 4;
const TOTAL_STEPS = 6;

const LIGHTING_TYPES = [
  "Interior Lighting",
  "Flood Lights",
  "Wall / Coach Lights",
  "Driveway Lighting",
  "Pole / Area Lighting",
  "Landscape",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

// ─── Normalize functions ────────────────────────────────────────────────────
const normalizeInstallType = (value: string) => {
  if (!value) return "";
  const lowerValue = value.toLowerCase();
  if (
    lowerValue === "new installation" ||
    lowerValue === "new install" ||
    lowerValue === "new" ||
    lowerValue.includes("new install") ||
    lowerValue.includes("new installation")
  ) {
    return "New Installation";
  }
  if (lowerValue === "replacement" || lowerValue.includes("replacement")) {
    return "Replacement";
  }
  return value;
};

const normalizeSwitchConnection = (value: string) => {
  if (!value) return "";
  const lowerValue = value.toLowerCase();
  if (lowerValue === "new" || lowerValue === "n") return "New";
  if (lowerValue === "existing" || lowerValue === "e") return "Existing";
  return value;
};

const normalizeYesNo = (value: string) => {
  if (!value) return "";
  const lowerValue = value.toLowerCase();
  if (lowerValue === "yes" || lowerValue === "y") return "Yes";
  if (lowerValue === "no" || lowerValue === "n") return "No";
  return value;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LightingType() {
  const dispatch = useDispatch();
  const [localLightingType, setLocalLightingType] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Lighting";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as LightingRecord | undefined;

  // ─── Custom hook for lighting operations ───────────────────────────────────
  const { uploadingSection, uploadSingleImage, deleteSingleImage } =
    useLighting();

  // ─── Redux state ──────────────────────────────────────────────────────────────
  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const { propertyType, ownershipStatus, timeline } = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );
  const categoryData = useSelector(
    (state: RootState) => state.serviceForm.categoryData,
  );

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxLightingType =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.lightingType || ""
      : "";

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    if (reduxLightingType) setLocalLightingType(reduxLightingType);
  }, [reduxLightingType]);

  // ─── Ensure category is set + Prefill from draft ─────────────────────────────
  useEffect(() => {
    if (!categoryData || categoryData.categoryId !== "17") {
      dispatch(selectCategory("17"));
    }
  }, []);

  useEffect(() => {
    if (!draft || categoryData?.categoryId !== "17") return;

    if (draft.lightingType) {
      setLocalLightingType(draft.lightingType);
    }

    dispatch(
      updateLightingDetails({
        lightingType: draft.lightingType as any,
        interiorInstallType: normalizeInstallType(
          draft.isNewOrReplacement || "",
        ),
        switchNewExisting: normalizeSwitchConnection(
          draft.fixtureConnectedToNewOrExistingSwitch || "",
        ),
        fixtureWeight: draft.kindOfLightingFixture || "",
        fixtureKind: draft.typeOfInteriorLightingFixture || "",
        complexAssembly:
          draft.isFixtureHaveComplexAssembly === true
            ? "Yes"
            : draft.isFixtureHaveComplexAssembly === false
              ? "No"
              : "",
        ceilingHeight: draft.tallOfCeiling || "",
        providingFixture:
          draft.willProvideNewLight === true
            ? "Yes"
            : draft.willProvideNewLight === false
              ? "No"
              : "",
        fixtureDetails: draft.detailsOnTypeOfFixture || "",
        upgradeSwitch:
          draft.wantToUpgradeSwitch === true
            ? "Yes"
            : draft.wantToUpgradeSwitch === false
              ? "No"
              : "",
        switchKind: draft.kindOfSwitchWant || "",
        multiSwitch:
          draft.moreThanOneSwitchLocation === true
            ? "Yes"
            : draft.moreThanOneSwitchLocation === false
              ? "No"
              : "",
        photosOfWhereWantToInstall: draft.photosOfWhereWantToInstall || [],
        photosOfCurrentLightFixture: draft.photosOfCurrentLightFixture || [],
        photosOfNewLightFixture: draft.photosOfNewLightFixture || [],
      }),
    );
  }, [draft, categoryData?.categoryId]);

  // ─── Animate on type change ──────────────────────────────────────────────────
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [localLightingType]);

  // ─── Handle type select ──────────────────────────────────────────────────────
  const handleTypeSelect = (val: string) => {
    fadeAnim.setValue(0);
    setLocalLightingType(val);
    dispatch(updateLightingDetails({ lightingType: val as any }));
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  // ─── Get all lighting details from Redux ────────────────────────────────────
  const getLightingDetails = () => {
    if (categoryData?.categoryId === "17" && categoryData.details) {
      return categoryData.details as any;
    }
    return {};
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const details = getLightingDetails();

    // Debug log to see what's in Redux
    console.log("🔍 Redux Lighting Details:", {
      interiorInstallType: details.interiorInstallType,
      switchNewExisting: details.switchNewExisting,
      floodSwitchNewExisting: details.floodSwitchNewExisting,
      wallSwitchNewExisting: details.wallSwitchNewExisting,
      drivewaySwitchNewExisting: details.drivewaySwitchNewExisting,
      poleSwitchNewExisting: details.poleSwitchNewExisting,
    });

    const payload = {
      fullName: draft?.fullName || fullName || "",
      emailAddress: draft?.emailAddress || email || "",
      phoneNumber: draft?.phoneNumber || phone || "",
      preferredContactMethod:
        draft?.preferredContactMethod || preferredContact || "Call",
      streetAddress: draft?.streetAddress || streetAddress || "",
      apartmentUnit: draft?.apartmentUnit || apartment || "",
      city: draft?.city || city || "",
      state: draft?.state || state || "",
      zipCode: draft?.zipCode || zipCode || "",
      propertyType: draft?.propertyType || propertyType || "",
      ownershipStatus: draft?.ownershipStatus || ownershipStatus || "",
      timelineUrgency: draft?.timelineUrgency || timeline || "",

      // ─── Lighting specific fields ──────────────────────────────────────────────
      lightingType: localLightingType || "",

      // Interior Lighting fields
      typeOfInteriorLightingFixture: details.fixtureKind || "",
      kindOfLightingFixture: details.fixtureWeight || "",
      isFixtureHaveComplexAssembly: details.complexAssembly === "Yes",
      tallOfCeiling: details.ceilingHeight || "",
      detailsOnTypeOfFixture: details.fixtureDetails || "",
      willProvideNewLight: details.providingFixture === "Yes",
      kindOfSwitchWant: details.switchKind || "",
      wantToUpgradeSwitch: details.upgradeSwitch === "Yes",
      moreThanOneSwitchLocation: details.multiSwitch === "Yes",

      // Flood Lights fields
      floodInstallHeight: details.floodInstallHeight || "",
      floodProviding: details.floodProviding || "",
      floodDetails: details.floodDetails || "",
      floodPowerControl: details.floodPowerControl || "",
      floodUpgradeSwitch: details.floodUpgradeSwitch || "",
      floodSwitchKind: details.floodSwitchKind || "",
      floodSwitchOtherText: details.floodSwitchOtherText || "",
      floodMultiSwitch: details.floodMultiSwitch || "",

      // Wall Coach fields
      wallSurface: details.wallSurface || "",
      wallProviding: details.wallProviding || "",
      wallNewLightDetails: details.wallNewLightDetails || "",
      wallUpgradeSwitch: details.wallUpgradeSwitch || "",
      wallSwitchKind: details.wallSwitchKind || "",
      wallMultiSwitch: details.wallMultiSwitch || "",

      // Driveway fields
      drivewayProviding: details.drivewayProviding || "",
      drivewayNewLightDetails: details.drivewayNewLightDetails || "",
      drivewayDistance: details.drivewayDistance || "",
      drivewayPowerControl: details.drivewayPowerControl || "",
      drivewayUpgradeSwitch: details.drivewayUpgradeSwitch || "",
      drivewaySwitchKind: details.drivewaySwitchKind || "",
      drivewaySwitchOtherText: details.drivewaySwitchOtherText || "",
      drivewayMultiSwitch: details.drivewayMultiSwitch || "",

      // Pole Area fields
      poleProviding: details.poleProviding || "",
      poleLightDetails: details.poleLightDetails || "",
      poleDistance: details.poleDistance || "",
      polePowerControl: details.polePowerControl || "",
      poleUpgradeSwitch: details.poleUpgradeSwitch || "",
      poleSwitchKind: details.poleSwitchKind || "",
      poleSwitchOtherText: details.poleSwitchOtherText || "",
      poleMultiSwitch: details.poleMultiSwitch || "",

      // Landscape fields
      landscapeVoltage: details.landscapeVoltage || "",

      // Photos
      photosOfWhereWantToInstall: details.photosOfWhereWantToInstall || [],
      photosOfCurrentLightFixture: details.photosOfCurrentLightFixture || [],
      photosOfNewLightFixture: details.photosOfNewLightFixture || [],
      photosOfInstallationAreaFloodLight:
        details.photosOfInstallationAreaFloodLight || [],
      photosOfCurrentFloodLight: details.photosOfCurrentFloodLight || [],
      photosOfNewFloodLight: details.photosOfNewFloodLight || [],

      // Additional Info
      additionalInformation: details.additionalInformation || "",

      // ─── Conditional enum fields (omitted if empty to avoid API rejection) ─────
      ...(normalizeInstallType(details.interiorInstallType || "") && {
        isNewOrReplacement: normalizeInstallType(details.interiorInstallType),
      }),
      ...(normalizeSwitchConnection(details.switchNewExisting || "") && {
        fixtureConnectedToNewOrExistingSwitch: normalizeSwitchConnection(
          details.switchNewExisting,
        ),
      }),
      ...(normalizeInstallType(details.floodInstallType || "") && {
        floodInstallType: normalizeInstallType(details.floodInstallType),
      }),
      ...(normalizeSwitchConnection(details.floodSwitchNewExisting || "") && {
        floodSwitchNewExisting: normalizeSwitchConnection(
          details.floodSwitchNewExisting,
        ),
      }),
      ...(normalizeInstallType(details.wallInstallType || "") && {
        wallInstallType: normalizeInstallType(details.wallInstallType),
      }),
      ...(normalizeSwitchConnection(details.wallSwitchNewExisting || "") && {
        wallSwitchNewExisting: normalizeSwitchConnection(
          details.wallSwitchNewExisting,
        ),
      }),
      ...(normalizeInstallType(details.drivewayInstallType || "") && {
        drivewayInstallType: normalizeInstallType(details.drivewayInstallType),
      }),
      ...(normalizeSwitchConnection(
        details.drivewaySwitchNewExisting || "",
      ) && {
        drivewaySwitchNewExisting: normalizeSwitchConnection(
          details.drivewaySwitchNewExisting,
        ),
      }),
      ...(normalizeInstallType(details.poleInstallType || "") && {
        poleInstallType: normalizeInstallType(details.poleInstallType),
      }),
      ...(normalizeSwitchConnection(details.poleSwitchNewExisting || "") && {
        poleSwitchNewExisting: normalizeSwitchConnection(
          details.poleSwitchNewExisting,
        ),
      }),

      status: "draft" as const,
      completionPercentage,
    };

    console.log(
      "📤 Saving Lighting draft payload:",
      JSON.stringify(payload, null, 2),
    );

    try {
      if (serviceCallId) {
        await updateDraft(serviceCallId, serviceType, createFormData(payload));
      } else {
        await createDraft(
          serviceType,
          createFormData({ serviceType, ...payload }),
        );
      }
      toast.success("Draft saved successfully!");
      router.push("/(tabs)/home/saved-draft");
    } catch (error: any) {
      console.log("❌ Save draft error:", error?.data);
      toast.error(
        error?.data?.message || "Failed to save draft. Please try again.",
      );
    }
  };

  // ─── Continue ────────────────────────────────────────────────────────────────
  const handleContinue = () => {
    if (localLightingType) {
      dispatch(
        updateLightingDetails({ lightingType: localLightingType as any }),
      );
    }

    router.push({
      pathname: `/(tabs)/quotes/quote/lighting/lighting-additional`,
      params: { serviceCallId, serviceType },
    });
  };

  // ─── Render details section ─────────────────────────────────────────────────
  const renderDetailsSection = () => {
    if (!localLightingType) return null;

    const sectionProps = {
      onUploadSingle: uploadSingleImage,
      onDeleteSingle: deleteSingleImage,
      isUploading: !!uploadingSection,
    };

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        {localLightingType === "Interior Lighting" && (
          <InteriorSection {...sectionProps} />
        )}
        {localLightingType === "Flood Lights" && (
          <FloodLightsSection {...sectionProps} />
        )}
        {localLightingType === "Wall / Coach Lights" && (
          <WallCoachSection {...sectionProps} />
        )}
        {localLightingType === "Driveway Lighting" && (
          <DrivewaySection {...sectionProps} />
        )}
        {localLightingType === "Pole / Area Lighting" && (
          <PoleAreaSection {...sectionProps} />
        )}
        {localLightingType === "Landscape" && <LandscapeSection />}
      </Animated.View>
    );
  };

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BackButton
          onPress={() =>
            router.push({
              pathname: "/(tabs)/quotes/quote/common/project-basics",
              params: { serviceCallId, serviceType },
            })
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(200) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Lighting Type"
            subtitle="What type of lighting do you need?"
          />

          <View className="mb-4">
            <TwoColGrid
              items={LIGHTING_TYPES}
              selected={localLightingType}
              onSelect={handleTypeSelect}
            />
          </View>

          {renderDetailsSection()}

          <GradientButton
            label="Continue"
            onPress={handleContinue}
            disabled={!localLightingType || isSaving || !!uploadingSection}
          />
          <SavedEditAction
            onPress={handleSaveForLater}
            title={isSaving ? "Saving..." : "Save for Later"}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
