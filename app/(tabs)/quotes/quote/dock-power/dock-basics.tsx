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

const CURRENT_STEP = 4;
const TOTAL_STEPS = 10;

const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function DockBasics() {
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

  const reduxDockBuilt = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details) return data.details.dockBuilt;
    return "";
  });
  const reduxElectricalNeeds = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.electricalNeeds;
    return "";
  });
  const reduxReceptacleCount = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.receptacleCount;
    return "";
  });

  // ─── Local state ──────────────────────────────────────────────────────────────
  const [dockBuilt, setDockBuilt] = useState(reduxDockBuilt || "");
  const [electricalNeeds, setElectricalNeeds] = useState(
    reduxElectricalNeeds || "",
  );
  const [receptacleCount, setReceptacleCount] = useState(
    reduxReceptacleCount || "",
  );

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.isDockBuilt !== undefined) {
      const val = draft.isDockBuilt ? "Yes" : "No";
      setDockBuilt(val);
      dispatch(updateDockPowerDetails({ dockBuilt: val as any }));
    }
    if (draft.electricalNeedsDetails) {
      setElectricalNeeds(draft.electricalNeedsDetails);
      dispatch(
        updateDockPowerDetails({
          electricalNeeds: draft.electricalNeedsDetails,
        }),
      );
    }
    if (draft.receptacleCount) {
      const val = String(draft.receptacleCount);
      setReceptacleCount(val);
      dispatch(updateDockPowerDetails({ receptacleCount: val }));
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
      isDockBuilt:
        draft?.isDockBuilt ??
        (dockBuilt === "Yes"
          ? true
          : dockBuilt === "No"
            ? false
            : reduxDockBuilt === "Yes"),
      electricalNeedsDetails:
        draft?.electricalNeedsDetails ||
        electricalNeeds ||
        reduxElectricalNeeds ||
        "",
      receptacleCount:
        (draft?.receptacleCount ?? parseInt(receptacleCount)) ||
        parseInt(reduxReceptacleCount) ||
        0,
      electricalServiceType: draft?.electricalServiceType || "",
      subPanelSize: draft?.subPanelSize || "",
      panelLocation: draft?.panelLocation || "",
      routeDistanceDetails: draft?.routeDistanceDetails || "",
      privateUtilitiesDetails: draft?.privateUtilitiesDetails || "",
      panelPhotos: draft?.panelPhotos || [],
      existingSpacePhotos: draft?.existingSpacePhotos || [],
      hasPlansDrawings: draft?.hasPlansDrawings ?? false,
      plansDrawingsPhotos: draft?.plansDrawingsPhotos || [],
      permitApplied: draft?.permitApplied ?? false,
      additionalInformation: draft?.additionalInformation || "",
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
          <AuthHeading title="Dock basics" subtitle="" />

          <OptionGrid
            label="Is your dock already built?"
            options={["Yes", "No"]}
            selected={dockBuilt}
            onSelect={(val) => {
              setDockBuilt(val);
              dispatch(updateDockPowerDetails({ dockBuilt: val as any }));
            }}
            numColumns={1}
          />

          <TextAreaInput
            label="Please provide details about your electrical need at the dock power"
            placeholder="Describe boat lift and how many, jet ski lift and how many, lighting, etc."
            value={electricalNeeds}
            onChangeText={(text) => {
              setElectricalNeeds(text);
              dispatch(updateDockPowerDetails({ electricalNeeds: text }));
            }}
            minHeight={120}
          />

          <CustomInput
            label="How many receptacles do you need at the dock?"
            textInputConfig={{
              placeholder: "Type here",
              keyboardType: "number-pad",
              value: receptacleCount,
              onChangeText: (text) => {
                setReceptacleCount(text);
                dispatch(updateDockPowerDetails({ receptacleCount: text }));
              },
            }}
          />

          <GradientButton
            label="Continue"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/quotes/quote/dock-power/power-requirements",
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
