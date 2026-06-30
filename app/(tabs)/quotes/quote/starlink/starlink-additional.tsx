import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import TextAreaInput from "@/src/components/shared/TextAreaInput";
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
import { useDraftSave } from "@/src/hooks/useDraftSave";
import {
  selectCategory,
  updateStarlinkDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { StarlinkRecord } from "@/src/types/quotes/starlink.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 7;
const TOTAL_STEPS = 8;

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function StarlinkAdditional() {
  const dispatch = useDispatch();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Starlink Installation";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as StarlinkRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "12") {
      dispatch(selectCategory("12"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const additionalNotes =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.additionalNotes || ""
      : "";
  const haveStarlinkEquipment =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.haveStarlinkEquipment || ""
      : "";
  const whenHaveEquipment =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.whenHaveEquipment || ""
      : "";
  const dishLocation =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.dishLocation || ""
      : "";
  const haveMountingEquipment =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.haveMountingEquipment || ""
      : "";
  const roomOfRouterIn =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.roomOfRouterIn || ""
      : "";
  const roomCondition =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.roomCondition || ""
      : "";
  const areaOfInstallationPhotos =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.areaOfInstallationPhotos || []
      : [];
  const photosOfRoomForRouter =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.photosOfRoomForRouter || []
      : [];

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.additionalNotes) {
      dispatch(
        updateStarlinkDetails({
          additionalNotes: draft.additionalNotes,
        }),
      );
    }
  }, [draft]);

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const payload = {
      // Contact Details
      fullName: draft?.fullName || fullName || "",
      phoneNumber: draft?.phoneNumber || phone || "",
      emailAddress: draft?.emailAddress || email || "",
      preferredContactMethod:
        draft?.preferredContactMethod || preferredContact || "Call",

      // Address Details
      streetAddress: draft?.streetAddress || streetAddress || "",
      apartmentUnit: draft?.apartmentUnit || apartment || "",
      city: draft?.city || city || "",
      state: draft?.state || state || "",
      zipCode: draft?.zipCode || zipCode || "",

      // Project Basics
      propertyType: draft?.propertyType || propertyType || "",
      ownershipStatus: draft?.ownershipStatus || ownershipStatus || "",
      timelineUrgency: draft?.timelineUrgency || timeline || "",

      // Starlink Specific Fields
      haveStarlinkEquipment:
        draft?.haveStarlinkEquipment !== undefined
          ? draft.haveStarlinkEquipment
          : haveStarlinkEquipment === "Yes",
      whenHaveEquipment: draft?.whenHaveEquipment || whenHaveEquipment || "",
      dishLocation: draft?.dishLocation || dishLocation || "",
      haveMountingEquipment:
        draft?.haveMountingEquipment !== undefined
          ? draft.haveMountingEquipment
          : haveMountingEquipment === "Yes",
      roomOfRouterIn: draft?.roomOfRouterIn || roomOfRouterIn || "",
      roomCondition: draft?.roomCondition || roomCondition || "",
      areaOfInstallationPhotos:
        draft?.areaOfInstallationPhotos || areaOfInstallationPhotos || [],
      photosOfRoomForRouter:
        draft?.photosOfRoomForRouter || photosOfRoomForRouter || [],
      additionalNotes: draft?.additionalNotes || additionalNotes || "",

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

  // ─── Handle Continue ──────────────────────────────────────────────────────
  const handleContinue = () => {
    // Save latest values to Redux before navigating
    if (additionalNotes) {
      dispatch(
        updateStarlinkDetails({
          additionalNotes: additionalNotes,
        }),
      );
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/common/review-request",
      params: { serviceCallId, serviceType },
    });
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
              pathname: "/(tabs)/quotes/quote/starlink/starlink-router",
              params: { serviceCallId, serviceType },
            })
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Additional information"
            subtitle="Any other details you'd like to share?"
          />

          <TextAreaInput
            label=""
            placeholder="Type additional information here..."
            value={additionalNotes}
            onChangeText={(text) =>
              dispatch(updateStarlinkDetails({ additionalNotes: text }))
            }
            minHeight={160}
          />
          <View className="mt-[0%]">
            <GradientButton
              label="Continue"
              onPress={handleContinue}
              disabled={isSaving}
            />
          </View>
          <SavedEditAction
            onPress={handleSaveForLater}
            title={isSaving ? "Saving..." : "Save for Later"}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
