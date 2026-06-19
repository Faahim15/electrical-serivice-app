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
import { updateHotTubDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { HotTubRecord } from "@/src/types/quotes/hot-tub.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 6;
const TOTAL_STEPS = 9;

const PLACEMENT_OPTIONS = [
  "Ground",
  "Concrete pad",
  "Concrete patio",
  "Deck (wood)",
  "Deck (composite)",
  "Other",
];
const PANEL_LOCATIONS = [
  "Basement (Finished)",
  "Basement (Unfinished)",
  "Garage (Finished)",
  "Garage (Unfinished)",
  "Other (please specify)",
];
const PANEL_DISTANCES = [
  "Less than 25 ft",
  "25 - 50 ft",
  "50 - 100 ft",
  "More than 100 ft",
  "Unsure",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function LocationDetails() {
  const dispatch = useDispatch();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Hot tub installation";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as HotTubRecord | undefined;

  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const { propertyType, ownershipStatus, timeline } = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  const placement = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "6" && data.details) return data.details.placement;
    return "";
  });

  const panelLocation = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "6" && data.details)
      return data.details.panelLocation;
    return "";
  });

  const panelDistance = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "6" && data.details)
      return data.details.panelDistance;
    return "";
  });

  const placementOther = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "6" && data.details)
      return data.details.placementOther;
    return "";
  });

  const panelLocationOther = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "6" && data.details)
      return data.details.panelLocationOther;
    return "";
  });

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.location) {
      dispatch(updateHotTubDetails({ placement: draft.location as any }));
    }
    if (draft.panelLocation) {
      dispatch(
        updateHotTubDetails({ panelLocation: draft.panelLocation as any }),
      );
    }
    if (draft.panelDistance) {
      dispatch(
        updateHotTubDetails({ panelDistance: draft.panelDistance as any }),
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
      location: placement || "",
      panelLocation: panelLocation || "",
      panelDistance: panelDistance || "",
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
              pathname: "/(tabs)/quotes/quote/hot-tub/electrical-requirements",
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

          <AuthHeading title="Location details" subtitle="" />
          <View className="mt-[2%]">
            <OptionGrid
              label="What will the hot tub be placed on?"
              options={PLACEMENT_OPTIONS}
              selected={placement}
              onSelect={(val) =>
                dispatch(updateHotTubDetails({ placement: val as any }))
              }
              numColumns={1}
            />
            {placement === "Other" && (
              <TextAreaInput
                label="Please specify"
                placeholder="Describe where the hot tub will be placed"
                value={placementOther ?? ""}
                onChangeText={(text) =>
                  dispatch(updateHotTubDetails({ placementOther: text }))
                }
              />
            )}
            <View className="my-[2%]">
              <OptionGrid
                label="Where is your electrical panel located?"
                options={PANEL_LOCATIONS}
                selected={panelLocation}
                onSelect={(val) =>
                  dispatch(updateHotTubDetails({ panelLocation: val as any }))
                }
                numColumns={1}
              />
            </View>
            {panelLocation === "Other (please specify)" && (
              <TextAreaInput
                label="Please specify"
                placeholder="Describe your panel location"
                value={panelLocationOther ?? ""}
                onChangeText={(text) =>
                  dispatch(updateHotTubDetails({ panelLocationOther: text }))
                }
              />
            )}
            <OptionGrid
              label="What is the approximate distance of the electrical panel from hot tub location?"
              options={PANEL_DISTANCES}
              selected={panelDistance}
              onSelect={(val) =>
                dispatch(updateHotTubDetails({ panelDistance: val as any }))
              }
              numColumns={1}
            />
            <View className="mt-[2%]">
              <GradientButton
                label="Continue"
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/quotes/quote/hot-tub/photos-needed",
                    params: { serviceCallId, serviceType },
                  })
                }
                disabled={isSaving}
              />
            </View>
            <SavedEditAction
              onPress={handleSaveForLater}
              title={isSaving ? "Saving..." : "Save for Later"}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
