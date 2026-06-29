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
import { updateDockPowerDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { DockPowerRecord } from "@/src/types/quotes/dock-power.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 5;
const TOTAL_STEPS = 10;

const SERVICE_TYPES = ["New service", "Sub-panel", "1-2 dedicated circuits"];
const NEW_SERVICE_SIZES = [
  "100 amp",
  "125 amp",
  "150 amp",
  "200 amp",
  "300 amp",
  "350 amp",
  "400 amp",
  "Unsure",
  "Other",
];
const SUB_PANEL_SIZES = [
  "30 amp",
  "50 amp",
  "60 amp",
  "100 amp",
  "125 amp",
  "Unsure",
  "Other",
];
const CIRCUIT_COUNTS = ["1", "2"];
const AMP_RATINGS = ["15", "20"];
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

export default function PowerRequirements() {
  const dispatch = useDispatch();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

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

  const serviceType_ = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.serviceType;
    return "";
  });

  const newServiceSize = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.newServiceSize;
    return "";
  });

  const subPanelSize = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.subPanelSize;
    return "";
  });

  const circuitCount = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.circuitCount;
    return "";
  });

  const ampRating = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details) return data.details.ampRating;
    return "";
  });

  const panelLocation = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.panelLocation;
    return "";
  });

  const panelLocationOther = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.panelLocationOther;
    return "";
  });

  const newServiceSizeOther = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.newServiceSizeOther;
    return "";
  });

  const subPanelSizeOther = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.subPanelSizeOther;
    return "";
  });

  const isNewService = serviceType_ === "New service";
  const isSubPanel = serviceType_ === "Sub-panel";
  const isDedicatedCircuits = serviceType_ === "1-2 dedicated circuits";
  const showPanelSection = isNewService || isSubPanel || isDedicatedCircuits;

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.electricalServiceType) {
      dispatch(
        updateDockPowerDetails({
          serviceType: draft.electricalServiceType as any,
        }),
      );
    }
    if (draft.subPanelSize) {
      dispatch(
        updateDockPowerDetails({ subPanelSize: draft.subPanelSize as any }),
      );
    }
    if (draft.panelLocation) {
      dispatch(
        updateDockPowerDetails({ panelLocation: draft.panelLocation as any }),
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
      electricalServiceType: draft?.electricalServiceType || serviceType_ || "",
      subPanelSize: draft?.subPanelSize || subPanelSize || "",
      panelLocation: draft?.panelLocation || panelLocation || "",
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
              pathname: "/(tabs)/quotes/quote/dock-power/dock-basics",
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

          <AuthHeading title="Power requirements" subtitle="" />

          <OptionGrid
            label="Will you need a new service (panel and meter), sub-panel, or 1-2 dedicated circuits to power the Dock power?"
            options={SERVICE_TYPES}
            selected={serviceType_}
            onSelect={(val) =>
              dispatch(
                updateDockPowerDetails({
                  serviceType: val as any,
                  newServiceSize: "",
                  subPanelSize: "",
                  circuitCount: "",
                  ampRating: "",
                }),
              )
            }
            numColumns={1}
          />

          {isNewService && (
            <>
              <OptionGrid
                label="What size service do you need?"
                options={NEW_SERVICE_SIZES}
                selected={newServiceSize}
                onSelect={(val) =>
                  dispatch(
                    updateDockPowerDetails({ newServiceSize: val as any }),
                  )
                }
                numColumns={1}
              />
              {newServiceSize === "Other" && (
                <TextAreaInput
                  label="Please specify"
                  placeholder="Describe your service size"
                  value={newServiceSizeOther ?? ""}
                  onChangeText={(text) =>
                    dispatch(
                      updateDockPowerDetails({ newServiceSizeOther: text }),
                    )
                  }
                />
              )}
            </>
          )}

          {isSubPanel && (
            <>
              <OptionGrid
                label="What size sub-panel do you need?"
                options={SUB_PANEL_SIZES}
                selected={subPanelSize}
                onSelect={(val) =>
                  dispatch(updateDockPowerDetails({ subPanelSize: val as any }))
                }
                numColumns={1}
              />
              {subPanelSize === "Other" && (
                <TextAreaInput
                  label="Please specify"
                  placeholder="Describe your sub-panel size"
                  value={subPanelSizeOther ?? ""}
                  onChangeText={(text) =>
                    dispatch(
                      updateDockPowerDetails({ subPanelSizeOther: text }),
                    )
                  }
                />
              )}
            </>
          )}

          {isDedicatedCircuits && (
            <>
              <OptionGrid
                label="Would you like 1 or 2 circuits"
                options={CIRCUIT_COUNTS}
                selected={circuitCount}
                onSelect={(val) =>
                  dispatch(updateDockPowerDetails({ circuitCount: val as any }))
                }
                numColumns={1}
              />
              <OptionGrid
                label="What amp rating for the circuit(s)?"
                options={AMP_RATINGS}
                selected={ampRating}
                onSelect={(val) =>
                  dispatch(updateDockPowerDetails({ ampRating: val as any }))
                }
                numColumns={1}
              />
            </>
          )}

          {showPanelSection && (
            <>
              <OptionGrid
                label="Where is your electrical panel located?"
                options={PANEL_LOCATIONS}
                selected={panelLocation}
                onSelect={(val) =>
                  dispatch(
                    updateDockPowerDetails({ panelLocation: val as any }),
                  )
                }
                numColumns={1}
              />
              {panelLocation === "Other (please specify)" && (
                <TextAreaInput
                  label="Please specify"
                  placeholder="Describe your panel location"
                  value={panelLocationOther ?? ""}
                  onChangeText={(text) =>
                    dispatch(
                      updateDockPowerDetails({ panelLocationOther: text }),
                    )
                  }
                />
              )}
            </>
          )}

          <GradientButton
            label="Continue"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/quotes/quote/dock-power/route-details",
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
