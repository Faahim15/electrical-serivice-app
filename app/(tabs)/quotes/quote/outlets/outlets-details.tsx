import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import CustomInput from "@/src/components/shared/CustomInput";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import TextAreaInput from "@/src/components/shared/TextAreaInput";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  selectCategory,
  updateOutletsDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { OutletRecord } from "@/src/types/quotes/outlet.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 4;
const TOTAL_STEPS = 8;

const INTENDED_USES = ["General Use", "Other"];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function OutletDetails() {
  const dispatch = useDispatch();
  const [localIntendedUse, setLocalIntendedUse] = useState("");
  const [localIntendedUseOther, setLocalIntendedUseOther] = useState("");
  const [localQuantity, setLocalQuantity] = useState("");

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Outlets";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as OutletRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "15") {
      dispatch(selectCategory("15"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxIntendedUse =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.intendedUse || ""
      : "";
  const reduxQuantity =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.numberOfOutlets || ""
      : "";

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    if (reduxIntendedUse) setLocalIntendedUse(reduxIntendedUse);
  }, [reduxIntendedUse]);

  useEffect(() => {
    if (reduxQuantity) setLocalQuantity(reduxQuantity);
  }, [reduxQuantity]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.intendedUseOfOutlets) {
      setLocalIntendedUse(draft.intendedUseOfOutlets);
      dispatch(
        updateOutletsDetails({
          intendedUse: draft.intendedUseOfOutlets as any,
        }),
      );
    }
    if (draft.howManyOutletsNeeds) {
      setLocalQuantity(draft.howManyOutletsNeeds);
      dispatch(
        updateOutletsDetails({ numberOfOutlets: draft.howManyOutletsNeeds }),
      );
    }
  }, [draft]);

  // ─── Handlers ──────────────────────────────────────────────────────────────────
  const handleIntendedUseSelect = (val: string) => {
    setLocalIntendedUse(val);
    dispatch(updateOutletsDetails({ intendedUse: val as any }));
    if (val !== "Other") {
      setLocalIntendedUseOther("");
      dispatch(updateOutletsDetails({ intendedUseOther: "" }));
    }
  };

  const handleOtherChange = (text: string) => {
    setLocalIntendedUseOther(text);
    dispatch(updateOutletsDetails({ intendedUseOther: text }));
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
      intendedUseOfOutlets:
        localIntendedUse === "Other" ? localIntendedUseOther : localIntendedUse,
      howManyOutletsNeeds: localQuantity || "",
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
    if (localIntendedUse) {
      dispatch(updateOutletsDetails({ intendedUse: localIntendedUse as any }));
    }
    if (localQuantity) {
      dispatch(updateOutletsDetails({ numberOfOutlets: localQuantity }));
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/outlets/outlet-install",
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
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Outlet Details"
            subtitle="Tell us about the outlets you need"
          />

          <OptionGrid
            label="What is the intended use of the outlet?"
            options={INTENDED_USES}
            selected={localIntendedUse}
            onSelect={handleIntendedUseSelect}
            numColumns={1}
          />

          {localIntendedUse === "Other" && (
            <TextAreaInput
              label="Please specify"
              placeholder="Describe the intended use..."
              value={localIntendedUseOther}
              onChangeText={handleOtherChange}
              minHeight={80}
            />
          )}

          <CustomInput
            label="How many outlets do you need installed / replaced?"
            textInputConfig={{
              placeholder: "Enter number of outlets",
              keyboardType: "number-pad",
              value: localQuantity,
              onChangeText: (text) => {
                setLocalQuantity(text);
                dispatch(updateOutletsDetails({ numberOfOutlets: text }));
              },
            }}
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
