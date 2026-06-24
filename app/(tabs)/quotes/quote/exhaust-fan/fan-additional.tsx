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
import {
  selectCategory,
  updateExhaustFanDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { ExhaustFanRecord } from "@/src/types/quotes/exhaust-fan.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 6;
const TOTAL_STEPS = 6;

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function FanAdditional() {
  const dispatch = useDispatch();
  const [localAdditionalNotes, setLocalAdditionalNotes] = useState("");
  const isInitialMount = useRef(true);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Exhaust Fan";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as ExhaustFanRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "14") {
      dispatch(selectCategory("14"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxAdditionalNotes =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.additionalNotes || ""
      : "";

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    if (reduxAdditionalNotes && !isInitialMount.current) {
      setLocalAdditionalNotes(reduxAdditionalNotes);
    }
  }, [reduxAdditionalNotes]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.additionalInformation) {
      setLocalAdditionalNotes(draft.additionalInformation);
      dispatch(
        updateExhaustFanDetails({
          additionalNotes: draft.additionalInformation,
        }),
      );
    }
    isInitialMount.current = false;
  }, [draft]);

  // ─── Handler ──────────────────────────────────────────────────────────────────
  const handleNotesChange = (text: string) => {
    setLocalAdditionalNotes(text);
    dispatch(updateExhaustFanDetails({ additionalNotes: text }));
  };

  // ─── Get all details from Redux ─────────────────────────────────────────────
  const getAllDetails = () => {
    if (categoryData?.categoryId === "14" && categoryData.details) {
      return categoryData.details as any;
    }
    return {};
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const details = getAllDetails();

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

      // ─── Exhaust Fan specific fields ────────────────────────────────────────
      newOrReplacement: details.installationType || "",
      locationOfExhaustFan: details.fanLocation || details.fanType || "",
      isRoofOrGableFan: details.atticFanType || "",
      willSupplyAtticFan:
        details.existingFan === "Yes" || details.supplyingAtticFan === "Yes",
      howManyStories: parseInt(details.stories) || 0,
      whereElectricalPanelLocated:
        details.panelLocation === "Other"
          ? details.panelLocationOther
          : details.panelLocation || "",
      existingDuctAndVentDiameterLocation:
        details.kitchenDuctInfo || details.bathroomDuctInfo || "",
      willProvideKitchenExhaustFan: details.kitchenYesNo === "Yes",
      willProvideBathroomExhaustFan: details.bathroomYesNo === "Yes",
      typeOfExhaustFanWanted:
        details.kitchenFanType || details.bathroomFanType || "",
      specialityControlsWanted: details.specialtyControl || "",
      aboveBelowAreaOfExhaustFan:
        details.kitchenAreas?.length > 0
          ? details.kitchenAreas[0]
          : details.bathroomAreas?.length > 0
            ? details.bathroomAreas[0]
            : "",
      distanceOfElectricalPanelToExhaustFan:
        details.kitchenDist || details.bathroomDist || "",
      additionalInformation:
        localAdditionalNotes || details.additionalInformation || "",

      // ─── Photos ──────────────────────────────────────────────────────────────
      photosOfInstallationArea:
        details.photosKitchenLocation?.length > 0
          ? details.photosKitchenLocation
          : details.photosBathromlocation?.length > 0
            ? details.photosBathromlocation
            : details.photosAtticLocation || [],
      photoOfNewFan:
        details.photosNewFan?.length > 0
          ? details.photosNewFan
          : details.photosKitchenNewFan?.length > 0
            ? details.photosKitchenNewFan
            : details.photosBathroomNewFan || [],
      photosOfPanelCloseUp: details.panelClosePhotos || [],
      photosOfPanelWideShot: details.panelWidePhotos || [],
      photosOfCurrentKitchenExhaustFan: details.photosKitchenCurrentFan || [],
      photosOfCurrentBathroomExhaustFan: details.photosBathroomCurrentFan || [],

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

  const handleContinue = () => {
    if (localAdditionalNotes) {
      dispatch(
        updateExhaustFanDetails({ additionalNotes: localAdditionalNotes }),
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
              pathname: "/(tabs)/quotes/quote/exhaust-fan/fan-photos" as any,
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
            title="Additional Information"
            subtitle="Any other details we should know"
          />

          <TextAreaInput
            label="Additional notes (optional)"
            placeholder="Any additional information you'd like to share"
            value={localAdditionalNotes}
            onChangeText={handleNotesChange}
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
