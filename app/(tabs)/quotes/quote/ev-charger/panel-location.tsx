import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import TextAreaInput from "@/src/components/shared/TextAreaInput";
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
import { useDraftSave } from "@/src/hooks/useDraftSave";
import {
  selectCategory,
  updateEVChargerDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { EvChargerInstallationResponse } from "@/src/types/evCharger.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 6;
const TOTAL_STEPS = 9;

const PANEL_LOCATIONS = [
  "Basement (Finished)",
  "Basement (Unfinished)",
  "Garage (Finished)",
  "Garage (Unfinished)",
  "Other (please specify)",
];

const PANEL_DISTANCES = [
  "Less than 25 ft",
  "25–50 ft",
  "50–100 ft",
  "More than 100 ft",
  "Unsure",
];

const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

const isEvChargerDraft = (
  draft: any,
): draft is EvChargerInstallationResponse => {
  return (
    draft &&
    typeof draft === "object" &&
    draft.chargerConnectionType !== undefined
  );
};

export default function PanelLocation() {
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (!categoryData || categoryData.categoryId !== "2") {
      dispatch(selectCategory("2"));
    }
  }, []);

  // ─── Get current values from Redux ───────────────────────────────────────────
  const reduxPanelLocation =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.panelLocation || ""
      : "";
  const reduxPanelDistance =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.panelDistance || ""
      : "";
  const reduxPanelLocationOther =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.panelLocationOther || ""
      : "";
  const reduxChargerType =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.chargerType || ""
      : "";
  const reduxNemaConfig =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.nemaConfig || ""
      : "";
  const reduxProvidingCharger =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.providingCharger || ""
      : "";
  const reduxChargerStatus =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.chargerStatus || ""
      : "";
  const reduxInstallationLocation =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.installationLocation || ""
      : "";
  const reduxChargerAreaPhotos =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.chargerAreaPhotos || []
      : [];
  const reduxPanelPhotos =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.panelPhotos || []
      : [];
  const reduxAdditionalInfo =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.additionalInfo || ""
      : "";

  // ─── Local state ──────────────────────────────────────────────────────────────
  const [panelLocation, setPanelLocation] = useState(reduxPanelLocation || "");
  const [panelLocationOther, setPanelLocationOther] = useState(
    reduxPanelLocationOther || "",
  );
  const [panelDistance, setPanelDistance] = useState(reduxPanelDistance || "");
  const [errors, setErrors] = useState<{
    panelLocation?: string;
    panelLocationOther?: string;
    panelDistance?: string;
  }>({});

  // ─── API hooks ────────────────────────────────────────────────────────────────
  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const isEvCharger = isEvChargerDraft(draftData);

  // ─── Prefill from API draft ───────────────────────────────────────────────────
  useEffect(() => {
    if (!draftData || !isEvCharger) return;

    const apiPanelLocation = draftData.panelLocation;
    const apiPanelDistance = draftData.panelDistance;

    if (apiPanelLocation) {
      if (PANEL_LOCATIONS.includes(apiPanelLocation)) {
        setPanelLocation(apiPanelLocation);
        setPanelLocationOther("");
        dispatch(
          updateEVChargerDetails({
            panelLocation: apiPanelLocation as any,
            panelLocationOther: "",
          }),
        );
      } else {
        setPanelLocation("Other (please specify)");
        setPanelLocationOther(apiPanelLocation);
        dispatch(
          updateEVChargerDetails({
            panelLocation: "Other (please specify)" as any,
            panelLocationOther: apiPanelLocation,
          }),
        );
      }
    }

    if (apiPanelDistance) {
      setPanelDistance(apiPanelDistance);
      dispatch(
        updateEVChargerDetails({ panelDistance: apiPanelDistance as any }),
      );
    }
  }, [draftData]);

  // ─── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!panelLocation)
      newErrors.panelLocation = "Please select a panel location.";
    if (
      panelLocation === "Other (please specify)" &&
      !panelLocationOther.trim()
    ) {
      newErrors.panelLocationOther = "Please specify the panel location.";
    }
    if (!panelDistance)
      newErrors.panelDistance = "Please select a panel distance.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Continue handler ────────────────────────────────────────────────────────
  const handleContinue = () => {
    if (!validate()) return;
    dispatch(
      updateEVChargerDetails({
        panelLocation: panelLocation as any,
        panelLocationOther: panelLocationOther,
        panelDistance: panelDistance as any,
      }),
    );
    router.push({
      pathname: "/(tabs)/quotes/quote/ev-charger/photos-needed",
      params: { serviceCallId, serviceType },
    });
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const finalPanelLocation =
      panelLocation === "Other (please specify)"
        ? panelLocationOther
        : panelLocation;

    const payload = {
      fullName: draftData?.fullName || contactDetails.fullName || "",
      emailAddress: draftData?.emailAddress || contactDetails.email || "",
      phoneNumber: draftData?.phoneNumber || contactDetails.phone || "",
      preferredContactMethod:
        draftData?.preferredContactMethod ||
        contactDetails.preferredContact ||
        "Call",
      streetAddress:
        draftData?.streetAddress || serviceAddress.streetAddress || "",
      apartmentUnit: draftData?.apartmentUnit || serviceAddress.apartment || "",
      city: draftData?.city || serviceAddress.city || "",
      state: draftData?.state || serviceAddress.state || "",
      zipCode: draftData?.zipCode || serviceAddress.zipCode || "",
      propertyType: draftData?.propertyType || projectBasics.propertyType || "",
      ownershipStatus:
        draftData?.ownershipStatus || projectBasics.ownershipStatus || "",
      timelineUrgency:
        draftData?.timelineUrgency || projectBasics.timeline || "",
      chargerConnectionType:
        (isEvCharger && draftData.chargerConnectionType) ||
        reduxChargerType ||
        "",
      nemaConfiguration:
        (isEvCharger && draftData.nemaConfiguration) || reduxNemaConfig || "",
      chargerProvidedByUser:
        isEvCharger && draftData.chargerProvidedByUser !== undefined
          ? draftData.chargerProvidedByUser
          : reduxProvidingCharger === "Yes",
      chargerStatus:
        (isEvCharger && draftData.chargerStatus) || reduxChargerStatus || "",
      installationLocation:
        (isEvCharger && draftData.installationLocation) ||
        reduxInstallationLocation ||
        "",
      panelLocation:
        (isEvCharger && draftData.panelLocation) || finalPanelLocation || "",
      panelDistance:
        (isEvCharger && draftData.panelDistance) || panelDistance || "",
      areaPhoto:
        (isEvCharger && draftData.areaPhoto) ||
        (reduxChargerAreaPhotos?.length > 0 ? reduxChargerAreaPhotos[0] : ""),
      panelPhotos:
        (isEvCharger && draftData.panelPhotos) || reduxPanelPhotos || [],
      additionalInformation:
        (isEvCharger && draftData.additionalInformation) ||
        reduxAdditionalInfo ||
        "",
      status: "draft" as const,
      completionPercentage,
    };

    try {
      if (serviceCallId) {
        await updateDraft(serviceCallId, serviceType, createFormData(payload));
      } else {
        await createDraft(serviceType, createFormData(payload));
      }
      toast.success("Draft saved successfully!");
      router.push("/(tabs)/home/saved-draft");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to save draft. Please try again.",
      );
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
              pathname: "/(tabs)/quotes/quote/ev-charger/installation-location",
              params: { serviceCallId, serviceType },
            })
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(120) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />
          <AuthHeading
            title="Panel location"
            subtitle="Help us understand your electrical panel"
          />

          {/* ── Panel Location ── */}
          <OptionGrid
            label="Where is your electrical panel located?"
            options={PANEL_LOCATIONS}
            selected={panelLocation}
            onSelect={(val) => {
              setPanelLocation(val);
              if (val !== "Other (please specify)") {
                setPanelLocationOther("");
              }
              setErrors((prev) => ({ ...prev, panelLocation: undefined }));
            }}
            numColumns={1}
          />
          {errors.panelLocation && (
            <Text className="text-red-500 text-xs mb-2">
              {errors.panelLocation}
            </Text>
          )}

          {/* ── Other specify ── */}
          {panelLocation === "Other (please specify)" && (
            <TextAreaInput
              label="Please specify"
              placeholder="Describe your panel location"
              value={panelLocationOther}
              onChangeText={(val) => {
                setPanelLocationOther(val);
                setErrors((prev) => ({
                  ...prev,
                  panelLocationOther: undefined,
                }));
              }}
              error={errors.panelLocationOther}
            />
          )}

          {/* ── Panel Distance ── */}
          <OptionGrid
            label="What is the approximate distance of the electrical panel from charger install location?"
            sublabel={true}
            options={PANEL_DISTANCES}
            selected={panelDistance}
            onSelect={(val) => {
              setPanelDistance(val);
              setErrors((prev) => ({ ...prev, panelDistance: undefined }));
            }}
            numColumns={1}
          />
          {errors.panelDistance && (
            <Text className="text-red-500 text-xs mb-2">
              {errors.panelDistance}
            </Text>
          )}

          <View className="mt-[3%]">
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
