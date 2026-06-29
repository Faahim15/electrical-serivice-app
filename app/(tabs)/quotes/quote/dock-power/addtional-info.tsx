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
import { updateDockPowerDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { DockPowerRecord } from "@/src/types/quotes/dock-power.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 9;
const TOTAL_STEPS = 10;

const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function AdditionalInfo() {
  const dispatch = useDispatch();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{ serviceCallId?: string; serviceType?: string }>();

  const serviceType = serviceTypeParam || "Dock Power";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as DockPowerRecord | undefined;

  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const { propertyType, ownershipStatus, timeline } = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  const reduxAdditionalInfo = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.additionalInfo;
    return "";
  });

  // ─── Local state ──────────────────────────────────────────────────────────────
  const [additionalInfo, setAdditionalInfo] = useState(
    reduxAdditionalInfo || "",
  );
  const {
    isDockBuilt,
    electricalNeedsDetails,
    receptacleCount,
    electricalServiceType,
    subPanelSize,
    panelLocation,
    routeDistanceDetails,
    privateUtilitiesDetails,
    panelPhotos,
    existingSpacePhotos,
    hasPlansDrawings,
    plansDrawingsPhotos,
    permitApplied,
  } = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details) return data.details;
    return {} as any;
  });
  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.additionalInformation) {
      setAdditionalInfo(draft.additionalInformation);
      dispatch(
        updateDockPowerDetails({ additionalInfo: draft.additionalInformation }),
      );
    }
  }, [draft]);

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
      isDockBuilt: draft?.isDockBuilt ?? isDockBuilt ?? false,
      electricalNeedsDetails:
        draft?.electricalNeedsDetails || electricalNeedsDetails || "",
      receptacleCount: draft?.receptacleCount ?? receptacleCount ?? 0,
      electricalServiceType:
        draft?.electricalServiceType || electricalServiceType || "",
      subPanelSize: draft?.subPanelSize || subPanelSize || "",
      panelLocation: draft?.panelLocation || panelLocation || "",
      routeDistanceDetails:
        draft?.routeDistanceDetails || routeDistanceDetails || "",
      privateUtilitiesDetails:
        draft?.privateUtilitiesDetails || privateUtilitiesDetails || "",
      panelPhotos: draft?.panelPhotos || panelPhotos || [],
      existingSpacePhotos:
        draft?.existingSpacePhotos || existingSpacePhotos || [],
      hasPlansDrawings: draft?.hasPlansDrawings ?? hasPlansDrawings ?? false,
      plansDrawingsPhotos:
        draft?.plansDrawingsPhotos || plansDrawingsPhotos || [],
      permitApplied: draft?.permitApplied ?? permitApplied ?? false,
      additionalInformation:
        draft?.additionalInformation ||
        reduxAdditionalInfo ||
        additionalInfo ||
        "",
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
    } catch {
      toast.error("Failed to save draft. Please try again.");
    }
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
              pathname: "/(tabs)/quotes/quote/dock-power/photos-needed",
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
            label="Additional Information"
            placeholder="any additional information you feel we should know for your quote"
            value={additionalInfo}
            onChangeText={(text) => {
              setAdditionalInfo(text);
              dispatch(updateDockPowerDetails({ additionalInfo: text }));
            }}
            minHeight={100}
          />

          <GradientButton
            label="Continue"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/quotes/quote/common/review-request",
                params: { serviceCallId, serviceType },
              })
            }
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
