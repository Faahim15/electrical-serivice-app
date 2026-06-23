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

  // ─── Ensure category is set ──────────────────────────────────────────────────
  useEffect(() => {
    if (!categoryData || categoryData.categoryId !== "17") {
      dispatch(selectCategory("17"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxLightingType =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.lightingType || ""
      : "";

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    if (reduxLightingType) setLocalLightingType(reduxLightingType);
  }, [reduxLightingType]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.lightingType) {
      setLocalLightingType(draft.lightingType);
      dispatch(
        updateLightingDetails({ lightingType: draft.lightingType as any }),
      );
    }
  }, [draft]);

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
      lightingType: localLightingType || "",
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
      console.log("Save draft error:", error);
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

    const routeMap: Record<string, string> = {
      "Interior Lighting": "/lighting/lighting-interior",
      "Flood Lights": "/lighting/lighting-flood",
      "Wall / Coach Lights": "/lighting/lighting-wall",
      "Driveway Lighting": "/lighting/lighting-driveway",
      "Pole / Area Lighting": "/lighting/lighting-pole",
      Landscape: "/lighting/lighting-landscape",
    };

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
