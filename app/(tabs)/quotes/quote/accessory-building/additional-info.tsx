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
  updateAccessoryBuildingDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { AccessoryBuildingRecord } from "@/src/types/quotes/accessory-building.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const SERVICE_TYPE = "Accessory Building / Shed Power";
const CURRENT_STEP = 11;
const TOTAL_STEPS = 12;

export default function AdditionalInfo() {
  const dispatch = useDispatch();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || SERVICE_TYPE;
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as AccessoryBuildingRecord | undefined;

  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const { propertyType, ownershipStatus, timeline } = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  const getField = (key: string) =>
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? (s.serviceForm.categoryData.details as any)?.[key]
        : "",
    );

  const squareFootage = getField("squareFootage") || "";
  const intendedUse = getField("intendedUse") || "";
  const buildingStatus = getField("buildingStatus") || "";
  const constructionType = getField("constructionType") || "";
  const floorType = getField("floorType") || "";
  const electricalNeeds = getField("electricalNeeds") || "";
  const hasHeatingCooling = getField("hasHeatingCooling") || "";
  const serviceTypeSelected = getField("serviceType") || "";
  const newServiceSize = getField("newServiceSize") || "";
  const subPanelSize = getField("subPanelSize") || "";
  const circuitCount = getField("circuitCount") || "";
  const ampRating = getField("ampRating") || "";
  const panelLocation = getField("panelLocation") || "";
  const panelLocationOther = getField("panelLocationOther") || "";
  const newServiceSizeOther = getField("newServiceSizeOther") || "";
  const subPanelSizeOther = getField("subPanelSizeOther") || "";
  const privateUtilities = getField("privateUtilities") || "";
  const routeDistance = getField("routeDistance") || "";
  const hasPlans = getField("hasPlans") || "";
  const planDrawingPhotos = getField("planDrawingPhotos") || [];
  const hasPermit = getField("hasPermit") || "";
  const permitNumber = getField("permitNumber") || "";
  const existingSpacePhotos = getField("existingSpacePhotos") || [];
  const panelPhotos = getField("panelPhotos") || [];

  const isNewService = serviceTypeSelected === "New Service";
  const isSubPanel = serviceTypeSelected === "Sub-panel";
  const isDedicatedCircuits = serviceTypeSelected === "1-2 dedicated circuits";
  const resolvedServiceSize = isNewService
    ? newServiceSize === "Other"
      ? newServiceSizeOther
      : newServiceSize
    : isSubPanel
      ? subPanelSize === "Other"
        ? subPanelSizeOther
        : subPanelSize
      : isDedicatedCircuits
        ? `${circuitCount} circuit(s) @ ${ampRating}A`
        : "";
  const combinedRouteDetails = [privateUtilities, routeDistance]
    .filter(Boolean)
    .join(" | ");

  // This screen's own field
  const additionalInfo = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.additionalInfo;
    return "";
  });

  // ✅ Ensure category is selected
  useEffect(() => {
    dispatch(selectCategory("5"));
  }, []);

  // ─── Prefill from draft — draft priority ─────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.additionalInformation) {
      dispatch(
        updateAccessoryBuildingDetails({
          additionalInfo: draft.additionalInformation,
        }),
      );
    }
  }, [draft]);

  // ─── Helper ──────────────────────────────────────────────────────────────────
  const createFormData = (payload: Record<string, any>) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    return formData;
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const payload = {
      // draft first, Redux as fallback for every field
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
      entireSquareFootage:
        draft?.entireSquareFootage || Number(squareFootage) || 0,
      intendedUse: draft?.intendedUse || intendedUse || "",
      buildingStatus: draft?.buildingStatus || buildingStatus || "",
      constructionType: draft?.constructionType || constructionType || "",
      floorType: draft?.floorType || floorType || "",
      electricalNeeds: electricalNeeds || "",
      hasHeatingOrCooling:
        draft?.hasHeatingOrCooling !== undefined
          ? draft.hasHeatingOrCooling
          : hasHeatingCooling === "Yes",
      electricalServiceType:
        draft?.electricalServiceType || serviceTypeSelected || "",
      serviceSize: draft?.serviceSize || resolvedServiceSize || "",
      panelLocation:
        draft?.panelLocation ||
        (panelLocation === "Other (please specify)"
          ? panelLocationOther
          : panelLocation) ||
        "",
      routeDetails: draft?.routeDetails || combinedRouteDetails || "",
      hasPlansDrawings:
        draft?.hasPlansDrawings !== undefined
          ? draft.hasPlansDrawings
          : hasPlans === "Yes",
      plansDrawings:
        (draft?.plansDrawings?.length ?? 0) > 0
          ? draft!.plansDrawings
          : planDrawingPhotos || [],
      permitApplied:
        draft?.permitApplied !== undefined
          ? draft.permitApplied
          : hasPermit === "Yes",
      permitNumber: draft?.permitNumber || permitNumber || "",
      existingSpacePhotos:
        (draft?.existingSpacePhotos?.length ?? 0) > 0
          ? draft!.existingSpacePhotos
          : existingSpacePhotos || [],
      panelPhotos:
        (draft?.panelPhotos?.length ?? 0) > 0
          ? draft!.panelPhotos
          : panelPhotos || [],
      additionalInformation:
        draft?.additionalInformation || additionalInfo || "",
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
      console.log(error.data);
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
              pathname: "/(tabs)/quotes/quote/accessory-building/photos-needed",
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
            key={`additional-${additionalInfo}`}
            label="Additional Information"
            placeholder="any additional information you feel we should know for your quote"
            value={additionalInfo}
            onChangeText={(text) =>
              dispatch(updateAccessoryBuildingDetails({ additionalInfo: text }))
            }
            minHeight={100}
          />

          <GradientButton
            label="Continue"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/quotes/quote/common/review-request",
                params: { serviceType, serviceCallId },
              })
            }
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
