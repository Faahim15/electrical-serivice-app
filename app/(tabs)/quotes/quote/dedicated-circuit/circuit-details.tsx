import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import TextAreaInput from "@/src/components/shared/TextAreaInput";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  selectCategory,
  updateDedicatedCircuitDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { DedicatedCircuitRecord } from "@/src/types/quotes/dedicated-circuit.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 4;
const TOTAL_STEPS = 8;

const CIRCUIT_OPTIONS = ["Freezer", "RV", "Tools / Equipment", "Other"];
const PANEL_LOCATIONS = [
  "Basement (Finished)",
  "Basement (Unfinished)",
  "Garage (Finished)",
  "Garage (Unfinished)",
  "Other (please specify)",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function CircuitDetails() {
  const dispatch = useDispatch();
  const [localCircuit, setLocalCircuit] = useState("");
  const [localCircuitOther, setLocalCircuitOther] = useState("");
  const [localPanel, setLocalPanel] = useState("");
  const [localPanelOther, setLocalPanelOther] = useState("");

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
  const reduxCircuit =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.whyNeedDedicatedCircuit || ""
      : "";
  const reduxPanel =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.electricalPanelLocation || ""
      : "";

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    if (reduxCircuit) setLocalCircuit(reduxCircuit);
  }, [reduxCircuit]);

  useEffect(() => {
    if (reduxPanel) setLocalPanel(reduxPanel);
  }, [reduxPanel]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.whyNeedDedicatedCircuit) {
      setLocalCircuit(draft.whyNeedDedicatedCircuit);
      dispatch(
        updateDedicatedCircuitDetails({
          whyNeedDedicatedCircuit: draft.whyNeedDedicatedCircuit,
        }),
      );
    }
    if (draft.electricalPanelLocation) {
      setLocalPanel(draft.electricalPanelLocation);
      dispatch(
        updateDedicatedCircuitDetails({
          electricalPanelLocation: draft.electricalPanelLocation,
        }),
      );
    }
  }, [draft]);

  // ─── Handlers ──────────────────────────────────────────────────────────────────
  const handleCircuitSelect = (val: string) => {
    setLocalCircuit(val);
    dispatch(updateDedicatedCircuitDetails({ whyNeedDedicatedCircuit: val }));
    if (val !== "Other") {
      setLocalCircuitOther("");
      dispatch(
        updateDedicatedCircuitDetails({ whyNeedDedicatedCircuitOther: "" }),
      );
    }
  };

  const handleCircuitOtherChange = (text: string) => {
    setLocalCircuitOther(text);
    dispatch(
      updateDedicatedCircuitDetails({ whyNeedDedicatedCircuitOther: text }),
    );
  };

  const handlePanelSelect = (val: string) => {
    setLocalPanel(val);
    dispatch(updateDedicatedCircuitDetails({ electricalPanelLocation: val }));
    if (val !== "Other (please specify)") {
      setLocalPanelOther("");
      dispatch(
        updateDedicatedCircuitDetails({ electricalPanelLocationOther: "" }),
      );
    }
  };

  const handlePanelOtherChange = (text: string) => {
    setLocalPanelOther(text);
    dispatch(
      updateDedicatedCircuitDetails({ electricalPanelLocationOther: text }),
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
      whyNeedDedicatedCircuit: localCircuit || "",
      electricalPanelLocation: localPanel || "",
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
    // Save final values to Redux
    if (localCircuit) {
      dispatch(
        updateDedicatedCircuitDetails({
          whyNeedDedicatedCircuit: localCircuit,
        }),
      );
    }
    if (localPanel) {
      dispatch(
        updateDedicatedCircuitDetails({ electricalPanelLocation: localPanel }),
      );
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/dedicated-circuit/circuit-location",
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
              pathname: "/(tabs)/quotes/quote/common/project-basics",
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

          <AuthHeading
            title="Intended use"
            subtitle="What do you need a dedicated circuit for?"
          />

          <OptionGrid
            label="What do you need a dedicated circuit for?"
            options={CIRCUIT_OPTIONS}
            selected={localCircuit}
            onSelect={handleCircuitSelect}
            numColumns={1}
          />

          {localCircuit === "Other" && (
            <TextAreaInput
              label="Please specify"
              placeholder="Describe your intended use..."
              value={localCircuitOther}
              onChangeText={handleCircuitOtherChange}
              minHeight={80}
            />
          )}

          <OptionGrid
            label="Where is your electrical panel located?"
            options={PANEL_LOCATIONS}
            selected={localPanel}
            onSelect={handlePanelSelect}
            numColumns={1}
          />

          {localPanel === "Other (please specify)" && (
            <TextAreaInput
              label="Please specify"
              placeholder="Describe your panel location..."
              value={localPanelOther}
              onChangeText={handlePanelOtherChange}
              minHeight={80}
            />
          )}

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
