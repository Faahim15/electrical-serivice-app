import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
import { useDraftSave } from "@/src/hooks/useDraftSave";
import {
  selectCategory,
  updateLightingDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { LightingRecord } from "@/src/types/quotes/lighting.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
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
import { useLighting } from "@/src/hooks/useLighting";

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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LightingType() {
  const dispatch = useDispatch();
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

  // ─── Get lighting details ────────────────────────────────────────────────────
  const getLightingDetails = () => {
    if (categoryData?.categoryId === "17" && categoryData.details) {
      return categoryData.details as any;
    }
    return {};
  };

  const details = getLightingDetails();

  // ─── Ensure category is set ──────────────────────────────────────────────────
  useEffect(() => {
    if (!categoryData || categoryData.categoryId !== "17") {
      dispatch(selectCategory("17"));
    }
  }, []);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft || categoryData?.categoryId !== "17") return;

    const updates: any = {};

    if (draft.lightingType) {
      updates.lightingType = draft.lightingType as any;
    }
    if (draft.typeOfInteriorLightingFixture) {
      updates.fixtureKind = draft.typeOfInteriorLightingFixture;
    }
    if (draft.kindOfLightingFixture) {
      updates.fixtureWeight = draft.kindOfLightingFixture;
    }
    if (draft.isFixtureHaveComplexAssembly !== undefined) {
      updates.complexAssembly = draft.isFixtureHaveComplexAssembly
        ? "Yes"
        : "No";
    }
    if (draft.isNewOrReplacement) {
      updates.interiorInstallType = normalizeInstallType(
        draft.isNewOrReplacement,
      );
    }
    if (draft.tallOfCeiling) {
      updates.ceilingHeight = draft.tallOfCeiling;
    }
    if (draft.detailsOnTypeOfFixture) {
      updates.fixtureDetails = draft.detailsOnTypeOfFixture;
    }
    if (draft.willProvideNewLight !== undefined) {
      updates.providingFixture = draft.willProvideNewLight ? "Yes" : "No";
    }
    if (draft.fixtureConnectedToNewOrExistingSwitch) {
      updates.switchNewExisting = normalizeSwitchConnection(
        draft.fixtureConnectedToNewOrExistingSwitch,
      );
    }
    if (draft.kindOfSwitchWant) {
      updates.switchKind = draft.kindOfSwitchWant;
    }
    if (draft.wantToUpgradeSwitch !== undefined) {
      updates.upgradeSwitch = draft.wantToUpgradeSwitch ? "Yes" : "No";
    }
    if (draft.moreThanOneSwitchLocation !== undefined) {
      updates.multiSwitch = draft.moreThanOneSwitchLocation ? "Yes" : "No";
    }
    if (draft.photosOfWhereWantToInstall) {
      updates.photosOfWhereWantToInstall = draft.photosOfWhereWantToInstall;
    }
    if (draft.photosOfCurrentLightFixture) {
      updates.photosOfCurrentLightFixture = draft.photosOfCurrentLightFixture;
    }
    if (draft.photosOfNewLightFixture) {
      updates.photosOfNewLightFixture = draft.photosOfNewLightFixture;
    }
    if (draft.photosOfInstallationAreaFloodLight) {
      updates.photosOfInstallationAreaFloodLight =
        draft.photosOfInstallationAreaFloodLight;
    }
    if (draft.photosOfCurrentFloodLight) {
      updates.photosOfCurrentFloodLight = draft.photosOfCurrentFloodLight;
    }
    if (draft.photosOfNewFloodLight) {
      updates.photosOfNewFloodLight = draft.photosOfNewFloodLight;
    }
    if (draft.additionalInformation) {
      updates.additionalInformation = draft.additionalInformation;
    }

    if (Object.keys(updates).length > 0) {
      dispatch(updateLightingDetails(updates));
    }
  }, [draft, categoryData?.categoryId]);

  // ─── Animate on type change ──────────────────────────────────────────────────
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [reduxLightingType]);

  // ─── Handle type select ──────────────────────────────────────────────────────
  const handleTypeSelect = (val: string) => {
    fadeAnim.setValue(0);
    dispatch(updateLightingDetails({ lightingType: val as any }));
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  // ─── Check if photos are required and valid for current lighting type ──────
  const checkPhotoValidation = () => {
    const installType =
      details.interiorInstallType ||
      details.floodInstallType ||
      details.wallInstallType ||
      details.drivewayInstallType ||
      details.poleInstallType;

    // If no install type selected, no photo validation needed
    if (!installType) return true;

    // ─── Interior Lighting ──────────────────────────────────────────────────
    if (reduxLightingType === "Interior Lighting") {
      if (installType === "New Installation") {
        const photos = details.photosOfWhereWantToInstall || [];
        return photos.length > 0;
      } else if (installType === "Replacement") {
        const photos = details.photosOfCurrentLightFixture || [];
        return photos.length > 0;
      }
      return true;
    }

    // ─── Flood Lights ──────────────────────────────────────────────────────
    if (reduxLightingType === "Flood Lights") {
      if (installType === "New Installation") {
        const photos = details.photosOfInstallationAreaFloodLight || [];
        return photos.length > 0;
      } else if (installType === "Replacement") {
        const photos = details.photosOfCurrentFloodLight || [];
        return photos.length > 0;
      }
      return true;
    }

    // ─── Wall / Coach Lights ──────────────────────────────────────────────
    if (reduxLightingType === "Wall / Coach Lights") {
      if (installType === "New Installation") {
        const photos = details.wallPhotosNew || [];
        return photos.length > 0;
      } else if (installType === "Replacement") {
        const photos = details.wallPhotosCurrent || [];
        return photos.length > 0;
      }
      return true;
    }

    // ─── Driveway Lighting ──────────────────────────────────────────────────
    if (reduxLightingType === "Driveway Lighting") {
      if (installType === "New Installation") {
        const photos = details.drivewayPhotosNew || [];
        return photos.length > 0;
      } else if (installType === "Replacement") {
        const photos = details.drivewayPhotosCurrent || [];
        return photos.length > 0;
      }
      return true;
    }

    // ─── Pole / Area Lighting ──────────────────────────────────────────────
    if (reduxLightingType === "Pole / Area Lighting") {
      if (installType === "New Installation") {
        const photos = details.polePhotosNew || [];
        return photos.length > 0;
      } else if (installType === "Replacement") {
        const photos = details.polePhotosCurrent || [];
        return photos.length > 0;
      }
      return true;
    }

    // Landscape doesn't require photos
    return true;
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
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

      lightingType: draft?.lightingType || reduxLightingType || "",

      // Interior Lighting Fields
      typeOfInteriorLightingFixture:
        draft?.typeOfInteriorLightingFixture || details.fixtureKind || "",
      kindOfLightingFixture:
        draft?.kindOfLightingFixture || details.fixtureWeight || "",
      isFixtureHaveComplexAssembly:
        draft?.isFixtureHaveComplexAssembly !== undefined
          ? draft.isFixtureHaveComplexAssembly
          : details.complexAssembly === "Yes",
      isNewOrReplacement:
        draft?.isNewOrReplacement ||
        normalizeInstallType(details.interiorInstallType || ""),
      tallOfCeiling: draft?.tallOfCeiling || details.ceilingHeight || "",
      detailsOnTypeOfFixture:
        draft?.detailsOnTypeOfFixture || details.fixtureDetails || "",
      willProvideNewLight:
        draft?.willProvideNewLight !== undefined
          ? draft.willProvideNewLight
          : details.providingFixture === "Yes",
      fixtureConnectedToNewOrExistingSwitch:
        draft?.fixtureConnectedToNewOrExistingSwitch ||
        normalizeSwitchConnection(details.switchNewExisting || ""),
      kindOfSwitchWant: draft?.kindOfSwitchWant || details.switchKind || "",
      wantToUpgradeSwitch:
        draft?.wantToUpgradeSwitch !== undefined
          ? draft.wantToUpgradeSwitch
          : details.upgradeSwitch === "Yes",
      moreThanOneSwitchLocation:
        draft?.moreThanOneSwitchLocation !== undefined
          ? draft.moreThanOneSwitchLocation
          : details.multiSwitch === "Yes",

      // Flood Lights Photos
      photosOfInstallationAreaFloodLight:
        draft?.photosOfInstallationAreaFloodLight ||
        details.photosOfInstallationAreaFloodLight ||
        [],
      photosOfCurrentFloodLight:
        draft?.photosOfCurrentFloodLight ||
        details.photosOfCurrentFloodLight ||
        [],
      photosOfNewFloodLight:
        draft?.photosOfNewFloodLight || details.photosOfNewFloodLight || [],

      // Interior Photos
      photosOfWhereWantToInstall:
        draft?.photosOfWhereWantToInstall ||
        details.photosOfWhereWantToInstall ||
        [],
      photosOfCurrentLightFixture:
        draft?.photosOfCurrentLightFixture ||
        details.photosOfCurrentLightFixture ||
        [],
      photosOfNewLightFixture:
        draft?.photosOfNewLightFixture || details.photosOfNewLightFixture || [],

      additionalInformation:
        draft?.additionalInformation || details.additionalInformation || "",

      status: "draft" as const,
      completionPercentage,
    };

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
    const isValid = checkPhotoValidation();

    if (!isValid) {
      const installType =
        details.interiorInstallType ||
        details.floodInstallType ||
        details.wallInstallType ||
        details.drivewayInstallType ||
        details.poleInstallType;

      if (installType === "New Installation") {
        toast.error(
          "Please upload photos of where you want to install the lighting",
        );
      } else if (installType === "Replacement") {
        toast.error("Please upload photos of the current light fixture(s)");
      } else {
        toast.error("Please upload the required photos");
      }
      return;
    }

    if (reduxLightingType) {
      dispatch(
        updateLightingDetails({ lightingType: reduxLightingType as any }),
      );
    }

    router.push({
      pathname: `/(tabs)/quotes/quote/lighting/lighting-additional`,
      params: { serviceCallId, serviceType },
    });
  };

  // ─── Check if continue button should be disabled ───────────────────────────
  const isContinueDisabled = () => {
    if (!reduxLightingType) return true;
    if (isSaving || uploadingSection) return true;

    // Landscape doesn't require photos
    if (reduxLightingType === "Landscape") return false;

    // Check if photos are required based on the current selections
    return !checkPhotoValidation();
  };

  // ─── Render details section ─────────────────────────────────────────────────
  const renderDetailsSection = () => {
    if (!reduxLightingType) return null;

    const sectionProps = {
      onUploadSingle: uploadSingleImage,
      onDeleteSingle: deleteSingleImage,
      isUploading: !!uploadingSection,
    };

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        {reduxLightingType === "Interior Lighting" && (
          <InteriorSection {...sectionProps} />
        )}
        {reduxLightingType === "Flood Lights" && (
          <FloodLightsSection {...sectionProps} />
        )}
        {reduxLightingType === "Wall / Coach Lights" && (
          <WallCoachSection {...sectionProps} />
        )}
        {reduxLightingType === "Driveway Lighting" && (
          <DrivewaySection {...sectionProps} />
        )}
        {reduxLightingType === "Pole / Area Lighting" && (
          <PoleAreaSection {...sectionProps} />
        )}
        {reduxLightingType === "Landscape" && <LandscapeSection />}
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
              selected={reduxLightingType}
              onSelect={handleTypeSelect}
            />
          </View>

          {renderDetailsSection()}

          <GradientButton
            label="Continue"
            onPress={handleContinue}
            disabled={isContinueDisabled()}
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
