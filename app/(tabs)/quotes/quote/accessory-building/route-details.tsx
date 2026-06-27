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
import { updateAccessoryBuildingDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { AccessoryBuildingRecord } from "@/src/types/quotes/accessory-building.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const SERVICE_TYPE = "Accessory Building / Shed Power";
const CURRENT_STEP = 8;
const TOTAL_STEPS = 12;

export default function RouteDetails() {
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

  // Earlier fields
  const squareFootage =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.squareFootage
        : "",
    ) || "";
  const intendedUse =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.intendedUse
        : "",
    ) || "";
  const buildingStatus =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.buildingStatus
        : "",
    ) || "";
  const constructionType =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.constructionType
        : "",
    ) || "";
  const floorType =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.floorType
        : "",
    ) || "";
  const electricalNeeds =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.electricalNeeds
        : "",
    ) || "";
  const hasHeatingCooling =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.hasHeatingCooling
        : "",
    ) || "";
  const serviceTypeSelected =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.serviceType
        : "",
    ) || "";
  const newServiceSize =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.newServiceSize
        : "",
    ) || "";
  const subPanelSize =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.subPanelSize
        : "",
    ) || "";
  const circuitCount =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.circuitCount
        : "",
    ) || "";
  const ampRating =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.ampRating
        : "",
    ) || "";
  const panelLocation =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.panelLocation
        : "",
    ) || "";
  const panelLocationOther =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.panelLocationOther
        : "",
    ) || "";
  const newServiceSizeOther =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.newServiceSizeOther
        : "",
    ) || "";
  const subPanelSizeOther =
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? s.serviceForm.categoryData.details?.subPanelSizeOther
        : "",
    ) || "";

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

  // This screen's own fields
  const privateUtilities = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.privateUtilities;
    return "";
  });

  const routeDistance = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.routeDistance;
    return "";
  });

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.routeDetails) {
      dispatch(
        updateAccessoryBuildingDetails({ routeDistance: draft.routeDetails }),
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
    const combinedRouteDetails = [privateUtilities, routeDistance]
      .filter(Boolean)
      .join(" | ");

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
      entireSquareFootage: Number(squareFootage) || 0,
      intendedUse: intendedUse || "",
      buildingStatus: buildingStatus || "",
      constructionType: constructionType || "",
      floorType: floorType || "",
      electricalNeeds: electricalNeeds || "",
      hasHeatingOrCooling: hasHeatingCooling === "Yes",
      electricalServiceType: serviceTypeSelected || "",
      serviceSize: resolvedServiceSize || "",
      panelLocation:
        panelLocation === "Other (please specify)"
          ? panelLocationOther
          : panelLocation || "",
      routeDetails: combinedRouteDetails || "",
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
              pathname: "/(tabs)/quotes/quote/accessory-building/service-type",
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
          <AuthHeading title="Route Details" subtitle="" />

          <TextAreaInput
            label="Please list any known private utilities between the house and accessory building"
            placeholder="Irrigation, private sewer/well, water, propane, etc."
            value={privateUtilities}
            onChangeText={(text) =>
              dispatch(
                updateAccessoryBuildingDetails({ privateUtilities: text }),
              )
            }
            minHeight={100}
          />

          <TextAreaInput
            label="Please provide a general idea of the distance and route between the main electrical panel and the accessory building location"
            placeholder="E.g., Panel is in the basement, building is 50 ft away across the backyard"
            value={routeDistance}
            onChangeText={(text) =>
              dispatch(updateAccessoryBuildingDetails({ routeDistance: text }))
            }
            minHeight={100}
          />

          <GradientButton
            label="Continue"
            onPress={() =>
              router.push({
                pathname:
                  "/(tabs)/quotes/quote/accessory-building/plans-permit",
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
