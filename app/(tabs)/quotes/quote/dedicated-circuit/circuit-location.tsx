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
  updateDedicatedCircuitDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { DedicatedCircuitRecord } from "@/src/types/quotes/dedicated-circuit.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 5;
const TOTAL_STEPS = 8;

const ABOVE_BELOW_OPTIONS = [
  "Attic above",
  "Occupied space above",
  "Crawlspace (unfinished)",
  "Crawlspace (finished)",
  "Basement (unfinished)",
  "Basement (finished)",
];

const DISTANCE_OPTIONS = [
  "Less than 25 ft",
  "25 – 50 ft",
  "50 – 100 ft",
  "More than 100 ft",
  "Unsure",
  "Other",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function CircuitLocation() {
  const dispatch = useDispatch();
  const [localInstallLocation, setLocalInstallLocation] = useState("");
  const [localAboveBelow, setLocalAboveBelow] = useState("");
  const [localDistance, setLocalDistance] = useState("");
  const [localDistanceOther, setLocalDistanceOther] = useState("");

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Dedicated Circuit";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as DedicatedCircuitRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "13") {
      dispatch(selectCategory("13"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxInstallLocation =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.whereWillDedicatedCircuitInstalled || ""
      : "";
  const reduxAboveBelow =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.aboveBelowArea || ""
      : "";
  const reduxDistance =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)
          ?.distanceElectricalPanelToInstallationArea || ""
      : "";

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    if (reduxInstallLocation) setLocalInstallLocation(reduxInstallLocation);
  }, [reduxInstallLocation]);

  useEffect(() => {
    if (reduxAboveBelow) setLocalAboveBelow(reduxAboveBelow);
  }, [reduxAboveBelow]);

  useEffect(() => {
    if (reduxDistance) setLocalDistance(reduxDistance);
  }, [reduxDistance]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.whereWillDedicatedCircuitInstalled) {
      setLocalInstallLocation(draft.whereWillDedicatedCircuitInstalled);
      dispatch(
        updateDedicatedCircuitDetails({
          whereWillDedicatedCircuitInstalled:
            draft.whereWillDedicatedCircuitInstalled,
        }),
      );
    }
    if (draft.aboveBelowArea) {
      setLocalAboveBelow(draft.aboveBelowArea);
      dispatch(
        updateDedicatedCircuitDetails({ aboveBelowArea: draft.aboveBelowArea }),
      );
    }
    if (draft.distanceElectricalPanelToInstallationArea) {
      setLocalDistance(draft.distanceElectricalPanelToInstallationArea);
      dispatch(
        updateDedicatedCircuitDetails({
          distanceElectricalPanelToInstallationArea:
            draft.distanceElectricalPanelToInstallationArea,
        }),
      );
    }
  }, [draft]);

  // ─── Handlers ──────────────────────────────────────────────────────────────────
  const handleDistanceSelect = (val: string) => {
    setLocalDistance(val);
    dispatch(
      updateDedicatedCircuitDetails({
        distanceElectricalPanelToInstallationArea: val,
      }),
    );
    if (val !== "Other") {
      setLocalDistanceOther("");
      dispatch(
        updateDedicatedCircuitDetails({
          distanceElectricalPanelToInstallationAreaOther: "",
        }),
      );
    }
  };

  const handleDistanceOtherChange = (text: string) => {
    setLocalDistanceOther(text);
    dispatch(
      updateDedicatedCircuitDetails({
        distanceElectricalPanelToInstallationAreaOther: text,
      }),
    );
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
      whereWillDedicatedCircuitInstalled: localInstallLocation || "",
      aboveBelowArea: localAboveBelow || "",
      distanceElectricalPanelToInstallationArea: localDistance || "",
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
    if (localInstallLocation) {
      dispatch(
        updateDedicatedCircuitDetails({
          whereWillDedicatedCircuitInstalled: localInstallLocation,
        }),
      );
    }
    if (localAboveBelow) {
      dispatch(
        updateDedicatedCircuitDetails({ aboveBelowArea: localAboveBelow }),
      );
    }
    if (localDistance) {
      dispatch(
        updateDedicatedCircuitDetails({
          distanceElectricalPanelToInstallationArea: localDistance,
        }),
      );
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/dedicated-circuit/circuit-specs",
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
              pathname:
                "/(tabs)/quotes/quote/dedicated-circuit/circuit-details",
              params: { serviceCallId, serviceType },
            })
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(132) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />

          <AuthHeading title="Panel and location" subtitle="" />

          <TextAreaInput
            label="Where will the dedicated circuit be installed?"
            placeholder="Kitchen, garage, bedroom, etc."
            value={localInstallLocation}
            onChangeText={(text) => {
              setLocalInstallLocation(text);
              dispatch(
                updateDedicatedCircuitDetails({
                  whereWillDedicatedCircuitInstalled: text,
                }),
              );
            }}
            minHeight={80}
          />

          <OptionGrid
            label="What is above / below the area?"
            options={ABOVE_BELOW_OPTIONS}
            selected={localAboveBelow}
            onSelect={(val) => {
              setLocalAboveBelow(val);
              dispatch(updateDedicatedCircuitDetails({ aboveBelowArea: val }));
            }}
            numColumns={1}
          />

          <OptionGrid
            label="What is the approximate distance of the electrical panel from dedicated circuit install location?"
            options={DISTANCE_OPTIONS}
            selected={localDistance}
            onSelect={handleDistanceSelect}
            numColumns={1}
          />

          {localDistance === "Other" && (
            <TextAreaInput
              label="Please specify"
              placeholder="Describe the distance..."
              value={localDistanceOther}
              onChangeText={handleDistanceOtherChange}
              minHeight={80}
            />
          )}
          <View className="pt-[30%]">
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
