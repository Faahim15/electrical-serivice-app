import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  selectCategory,
  updateCeilingFanDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { CeilingFanRecord } from "@/src/types/quotes/ceiling-fan.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
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
const TOTAL_STEPS = 8;

const SWITCH_KINDS = [
  "Standard (Toggle)",
  "Smart",
  "Standard (Rocker/Decorator)",
  "Dimmer (Rocker/Decorator)",
  "Dimmer (Toggle)",
  "Motion",
  "Timer",
  "I'll provide my own",
];

const SWITCH_CONNECTION_OPTIONS = [
  "New",
  "Existing",
  "My fan comes with a remote",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function SwitchDetails() {
  const dispatch = useDispatch();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Ceiling Fan Installation";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as CeilingFanRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "18") {
      dispatch(selectCategory("18"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const willConnectNewOrExistingSwitch =
    categoryData?.categoryId === "18"
      ? (categoryData.details as any)?.willConnectNewOrExistingSwitch || ""
      : "";
  const wantUpgradeSwitch =
    categoryData?.categoryId === "18"
      ? (categoryData.details as any)?.wantUpgradeSwitch || ""
      : "";
  const kindOfSwitchWant =
    categoryData?.categoryId === "18"
      ? (categoryData.details as any)?.kindOfSwitchWant || ""
      : "";

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.willConnectNewOrExistingSwitch) {
      dispatch(
        updateCeilingFanDetails({
          willConnectNewOrExistingSwitch:
            draft.willConnectNewOrExistingSwitch as any,
        }),
      );
    }
    if (draft.wantUpgradeSwitch !== undefined) {
      dispatch(
        updateCeilingFanDetails({
          wantUpgradeSwitch: draft.wantUpgradeSwitch ? "Yes" : "No",
        }),
      );
    }
    if (draft.kindOfSwitchWant) {
      dispatch(
        updateCeilingFanDetails({
          kindOfSwitchWant: draft.kindOfSwitchWant as any,
        }),
      );
    }
  }, [draft]);

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    // Get all data from Redux
    const details =
      categoryData?.categoryId === "18" ? (categoryData.details as any) : {};

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

      // Ceiling Fan specific fields - keep all data
      installationType: details.installationType || "",
      photosOfCurrentCeilingFan: details.photosOfCurrentCeilingFan || [],
      aboveBelowAreaOfCeilingFan: details.aboveBelowAreaOfCeilingFan || [],
      isThereCurrentLightFixture: details.isThereCurrentLightFixture === "Yes",
      wasAreaPrewired: details.wasAreaPrewired || "",
      willProvideNewCeilingFan: details.willProvideNewCeilingFan === "Yes",
      photosOfNewCeilingFan: details.photosOfNewCeilingFan || [],
      describeFanWantInstalled: details.describeFanWantInstalled || "",
      tallOfCeilingFanFromFloor: details.tallOfCeilingFanFromFloor || "",

      // Switch details
      willConnectNewOrExistingSwitch: willConnectNewOrExistingSwitch || "",
      wantUpgradeSwitch: wantUpgradeSwitch === "Yes",
      kindOfSwitchWant: kindOfSwitchWant || "",

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

  const isSwitchDetailsSelected = willConnectNewOrExistingSwitch !== "";

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BackButton
          onPress={() =>
            router.push({
              pathname: "/(tabs)/quotes/quote/ceiling-fan/fan-details",
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
            title="Switch details"
            subtitle="Will the fan be connected to a new or existing switch?"
          />

          <OptionGrid
            label="Will the fan be connected to a new or existing switch?"
            options={SWITCH_CONNECTION_OPTIONS}
            selected={willConnectNewOrExistingSwitch}
            onSelect={(val) => {
              dispatch(
                updateCeilingFanDetails({
                  willConnectNewOrExistingSwitch: val as any,
                  wantUpgradeSwitch: "",
                  kindOfSwitchWant: "",
                }),
              );
            }}
            numColumns={1}
          />

          {willConnectNewOrExistingSwitch === "New" && (
            <>
              <Text className="text-[#1E293B] text-[15px] font-Inter_SemiBold mb-3 mt-2">
                What kind of switch do you want installed?
              </Text>
              <OptionGrid
                label=""
                options={SWITCH_KINDS}
                selected={kindOfSwitchWant}
                onSelect={(val) =>
                  dispatch(
                    updateCeilingFanDetails({
                      kindOfSwitchWant: val as any,
                    }),
                  )
                }
                numColumns={2}
              />
            </>
          )}

          {willConnectNewOrExistingSwitch === "Existing" && (
            <>
              <OptionGrid
                label="Do you want to upgrade your switch?"
                options={["Yes", "No"]}
                selected={wantUpgradeSwitch}
                onSelect={(val) => {
                  dispatch(
                    updateCeilingFanDetails({
                      wantUpgradeSwitch: val as any,
                      kindOfSwitchWant: "",
                    }),
                  );
                }}
                numColumns={2}
              />

              {wantUpgradeSwitch === "Yes" && (
                <>
                  <Text className="text-[#1E293B] text-[15px] font-Inter_SemiBold mb-3 mt-2">
                    What kind of switch do you want installed?
                  </Text>
                  <OptionGrid
                    label=""
                    options={SWITCH_KINDS}
                    selected={kindOfSwitchWant}
                    onSelect={(val) =>
                      dispatch(
                        updateCeilingFanDetails({
                          kindOfSwitchWant: val as any,
                        }),
                      )
                    }
                    numColumns={2}
                  />
                </>
              )}
            </>
          )}

          {willConnectNewOrExistingSwitch === "My fan comes with a remote" && (
            <View className="bg-blue-50 border border-[#4AA9F5] rounded-xl p-4 mt-2">
              <Text className="text-[#4AA9F5] font-Inter_Regular text-sm leading-5">
                Great! Your fan comes with a remote. No additional switch
                installation is needed.
              </Text>
            </View>
          )}

          <View className="mt-[3%]">
            <GradientButton
              label="Continue"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/quotes/quote/ceiling-fan/addtional-info",
                  params: { serviceCallId, serviceType },
                })
              }
              disabled={!isSwitchDetailsSelected || isSaving}
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
