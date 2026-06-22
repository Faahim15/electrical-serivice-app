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
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 1;
const TOTAL_STEPS = 4;

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
  const howManySwitchesNeeded =
    categoryData?.categoryId === "16"
      ? (categoryData.details as any)?.howManySwitchesNeeded || ""
      : "";
  const isNewInstallationOrReplacement =
    categoryData?.categoryId === "16"
      ? (categoryData.details as any)?.isNewInstallationOrReplacement || ""
      : "";

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.howManySwitchesNeeded) {
      dispatch(
        updateSwitchesDetails({
          howManySwitchesNeeded: draft.howManySwitchesNeeded,
        }),
      );
    }
    if (draft.isNewInstallationOrReplacement) {
      dispatch(
        updateSwitchesDetails({
          isNewInstallationOrReplacement:
            draft.isNewInstallationOrReplacement as any,
        }),
      );
    }
  }, [draft]);

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

      howManySwitchesNeeded: howManySwitchesNeeded || "",
      isNewInstallationOrReplacement: isNewInstallationOrReplacement || "",
      photosOfWhereSwitchesInstallationNeeded:
        details.photosOfWhereSwitchesInstallationNeeded || [],
      typeOfSwitchesNeeded: details.typeOfSwitchesNeeded || [],
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

  const isFormValid =
    howManySwitchesNeeded !== "" && isNewInstallationOrReplacement !== "";

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
          contentContainerStyle={{ paddingBottom: verticalScale(32) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Switch details"
            subtitle="Tell us about the switches you need installed"
          />

          <Text className="text-[#1E293B] text-[15px] font-Inter_SemiBold mb-2">
            How many switches do you need installed / replaced?
          </Text>
          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-4 font-Inter_Regular text-gray-800 text-sm bg-white mb-4"
            onChangeText={(v) =>
              dispatch(
                updateSwitchesDetails({
                  howManySwitchesNeeded: v,
                }),
              )
            }
            value={howManySwitchesNeeded}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
            placeholder="Enter number of switches"
          />

          <OptionGrid
            label="Is this a new install or replacement?"
            options={["New install", "Replacement"]}
            selected={isNewInstallationOrReplacement}
            onSelect={(val) =>
              dispatch(
                updateSwitchesDetails({
                  isNewInstallationOrReplacement: val as any,
                }),
              )
            }
            numColumns={2}
          />

          <View className="mt-[3%]">
            <GradientButton
              label="Continue"
              onPress={() =>
                router.push({
                  pathname:
                    "/(tabs)/quotes/quote/switches/switch-photos" as any,
                  params: { serviceCallId, serviceType },
                })
              }
              disabled={!isFormValid || isSaving}
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
