import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import TextAreaInput from "@/src/components/shared/TextAreaInput";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import { updateEVChargerDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { EvChargerInstallationResponse } from "@/src/types/evCharger.api.types";
import { ServiceCallResponse } from "@/src/types/quotes.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 8;
const TOTAL_STEPS = 9;

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

// Type guard to check if draft is EV Charger type
const isEvChargerDraft = (
  draft: ServiceCallResponse | EvChargerInstallationResponse,
): draft is EvChargerInstallationResponse => {
  return (
    (draft as EvChargerInstallationResponse).chargerConnectionType !== undefined
  );
};

export default function AdditionalInfo() {
  const dispatch = useDispatch();
  const [localAdditionalInfo, setLocalAdditionalInfo] = useState("");

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  // ─── Redux state ──────────────────────────────────────────────────────────────
  const selectedCategory = useSelector(
    (state: RootState) => state.categoryRoute.selectedCategory,
  );
  const contactDetails = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const serviceAddress = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const projectBasics = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );
  const categoryData = useSelector(
    (state: RootState) => state.serviceForm.categoryData,
  );

  const serviceType =
    serviceTypeParam || selectedCategory?.title || "EV Charger Installation";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  // ─── Get current values from Redux ───────────────────────────────────────────
  const additionalInfo =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.additionalInfo
      : "";

  // Update local state when Redux changes
  useEffect(() => {
    if (additionalInfo) {
      setLocalAdditionalInfo(additionalInfo);
    }
  }, [additionalInfo]);

  // ─── API hooks ────────────────────────────────────────────────────────────────
  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);

  // ─── Prefill from API draft ───────────────────────────────────────────────────
  useEffect(() => {
    if (draftData && isEvChargerDraft(draftData)) {
      if (draftData.additionalInformation) {
        setLocalAdditionalInfo(draftData.additionalInformation);
        dispatch(
          updateEVChargerDetails({
            additionalInfo: draftData.additionalInformation,
          }),
        );
      }
    }
  }, [draftData]);

  // ─── Handle text change ──────────────────────────────────────────────────────
  const handleTextChange = (text: string) => {
    setLocalAdditionalInfo(text);
    dispatch(updateEVChargerDetails({ additionalInfo: text }));
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    // Get all required data from Redux or draft
    const finalFullName = draftData?.fullName || contactDetails.fullName;
    const finalEmail = draftData?.emailAddress || contactDetails.email;
    const finalPhone = draftData?.phoneNumber || contactDetails.phone;
    const finalPreferredContact =
      draftData?.preferredContactMethod || contactDetails.preferredContact;
    const finalStreetAddress =
      draftData?.streetAddress || serviceAddress.streetAddress;
    const finalApartment = draftData?.apartmentUnit || serviceAddress.apartment;
    const finalCity = draftData?.city || serviceAddress.city;
    const finalState = draftData?.state || serviceAddress.state;
    const finalZipCode = draftData?.zipCode || serviceAddress.zipCode;
    const finalPropertyType =
      draftData?.propertyType || projectBasics.propertyType;
    const finalOwnershipStatus =
      draftData?.ownershipStatus || projectBasics.ownershipStatus;
    const finalTimeline = draftData?.timelineUrgency || projectBasics.timeline;

    // Get previous step data from Redux or draft
    const previousData =
      categoryData?.categoryId === "2" ? (categoryData.details as any) : {};

    let finalChargerType = previousData.chargerType;
    let finalNemaConfig = previousData.nemaConfig;
    let finalProvidingCharger = previousData.providingCharger;
    let finalChargerStatus = previousData.chargerStatus;
    let finalInstallationLocation = previousData.installationLocation;
    let finalPanelLocation = previousData.panelLocation;
    let finalPanelDistance = previousData.panelDistance;
    let finalAreaPhoto =
      previousData.chargerAreaPhotos?.length > 0
        ? previousData.chargerAreaPhotos[0]
        : "";
    let finalPanelPhotos = previousData.panelPhotos || [];

    if (draftData && isEvChargerDraft(draftData)) {
      finalChargerType = draftData.chargerConnectionType || finalChargerType;
      finalNemaConfig = draftData.nemaConfiguration || finalNemaConfig;
      finalProvidingCharger =
        draftData.chargerProvidedByUser !== undefined
          ? draftData.chargerProvidedByUser
            ? "Yes"
            : "No"
          : finalProvidingCharger;
      finalChargerStatus = draftData.chargerStatus || finalChargerStatus;
      finalInstallationLocation =
        draftData.installationLocation || finalInstallationLocation;
      finalPanelLocation = draftData.panelLocation || finalPanelLocation;
      finalPanelDistance = draftData.panelDistance || finalPanelDistance;
      finalAreaPhoto = draftData.areaPhoto || finalAreaPhoto;
      finalPanelPhotos = draftData.panelPhotos || finalPanelPhotos;
    }

    // Build payload matching the EV Charger API structure
    const payload = {
      fullName: finalFullName || "",
      phoneNumber: finalPhone || "",
      emailAddress: finalEmail || "",
      preferredContactMethod: finalPreferredContact || "Call",
      streetAddress: finalStreetAddress || "",
      apartmentUnit: finalApartment || "",
      city: finalCity || "",
      state: finalState || "",
      zipCode: finalZipCode || "",
      propertyType: finalPropertyType || "",
      ownershipStatus: finalOwnershipStatus || "",
      timelineUrgency: finalTimeline || "",
      chargerConnectionType: finalChargerType || "",
      nemaConfiguration: finalNemaConfig || "",
      chargerProvidedByUser: finalProvidingCharger === "Yes",
      chargerStatus: finalChargerStatus || "",
      installationLocation: finalInstallationLocation || "",
      panelLocation: finalPanelLocation || "",
      panelDistance: finalPanelDistance || "",
      areaPhoto: finalAreaPhoto,
      panelPhotos: finalPanelPhotos,
      additionalInformation: localAdditionalInfo || "",
      status: "draft" as const,
      completionPercentage,
    };

    const formData = createFormData(payload);

    try {
      if (serviceCallId) {
        await updateDraft(serviceCallId, serviceType, formData);
      } else {
        await createDraft(serviceType, formData);
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

  // ─── Continue handler ────────────────────────────────────────────────────────
  const handleContinue = () => {
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
              pathname: "/(tabs)/quotes/quote/ev-charger/photos-needed",
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
            subtitle="Any other details we should know"
          />

          <TextAreaInput
            label="Additional information"
            placeholder="Any additional information you feel we should know..."
            value={localAdditionalInfo}
            onChangeText={handleTextChange}
            minHeight={120}
          />

          <GradientButton
            label="Continue"
            onPress={handleContinue}
            disabled={isSaving}
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
