import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
import { useDraftSave } from "@/src/hooks/useDraftSave";
import {
  selectCategory,
  updateSwitchesDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { SwitchesRecord } from "@/src/types/quotes/switches.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 5;
const TOTAL_STEPS = 8;

const SWITCH_TYPES = [
  "Standard (Toggle)",
  "Smart",
  "Standard (Rocker/Decorator)",
  "Dimmer (Rocker/Decorator)",
  "Dimmer (Toggle)",
  "Motion",
  "Timer",
  "I'll provide my own",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

// ─── Two Column Grid Component ──────────────────────────────────────────────
const TwoColGrid = ({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string[];
  onSelect: (v: string) => void;
}) => (
  <View className="flex-row flex-wrap gap-2">
    {items.map((item) => (
      <View key={item} style={{ width: "48%" }}>
        <Pressable onPress={() => onSelect(item)}>
          <View
            className={`rounded-xl border py-3 px-3 items-center justify-center ${
              selected.includes(item)
                ? "bg-[#4AA9F5] border-[#4AA9F5]"
                : "bg-white border-gray-200"
            }`}
            style={{ minHeight: 48 }}
          >
            <Text
              className={`text-sm font-Inter_SemiBold text-center ${
                selected.includes(item) ? "text-white" : "text-[#1F2937]"
              }`}
            >
              {item}
            </Text>
          </View>
        </Pressable>
      </View>
    ))}
  </View>
);

export default function SwitchType() {
  const dispatch = useDispatch();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Switches Installation";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as SwitchesRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "16") {
      dispatch(selectCategory("16"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const typeOfSwitchesNeeded =
    categoryData?.categoryId === "16"
      ? (categoryData.details as any)?.typeOfSwitchesNeeded || []
      : [];

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.typeOfSwitchesNeeded?.length) {
      dispatch(
        updateSwitchesDetails({
          typeOfSwitchesNeeded: draft.typeOfSwitchesNeeded as any,
        }),
      );
    }
  }, [draft]);

  // ─── Toggle switch type ──────────────────────────────────────────────────────
  const toggleSwitchType = (type: string) => {
    const current = typeOfSwitchesNeeded || [];
    const newTypes = current.includes(type)
      ? current.filter((t: string) => t !== type)
      : [...current, type];
    dispatch(
      updateSwitchesDetails({
        typeOfSwitchesNeeded: newTypes,
      }),
    );
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const details =
      categoryData?.categoryId === "16" ? (categoryData.details as any) : {};

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

      howManySwitchesNeeded: details.howManySwitchesNeeded || "",
      isNewInstallationOrReplacement:
        details.isNewInstallationOrReplacement || "",
      photosOfWhereSwitchesInstallationNeeded:
        details.photosOfWhereSwitchesInstallationNeeded || [],
      typeOfSwitchesNeeded: typeOfSwitchesNeeded || [],
      additionalInformation: details.additionalInformation || "",

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
              pathname: "/(tabs)/quotes/quote/switches/switch-details",
              params: { serviceCallId, serviceType },
            })
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(32) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Switch type"
            subtitle="What type of switch(es) do you need?"
          />

          <Text className="text-[#1E293B] text-[15px] font-Inter_SemiBold mb-4">
            What type of switch(es) do you need? (Select all that apply)
          </Text>

          <TwoColGrid
            items={SWITCH_TYPES}
            selected={typeOfSwitchesNeeded}
            onSelect={toggleSwitchType}
          />

          <View className="mt-[3%]">
            <GradientButton
              label="Continue"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/quotes/quote/switches/switch-photos",
                  params: { serviceCallId, serviceType },
                })
              }
              disabled={typeOfSwitchesNeeded.length === 0 || isSaving}
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
