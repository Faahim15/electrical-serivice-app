import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import CustomInput from "@/src/components/shared/CustomInput";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
import { useDraftSave } from "@/src/hooks/useDraftSave";
import { updatePanelUpgradeDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { PanelUpgradeRecord } from "@/src/types/quotes/panel.upgrader.api.types";
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

const SERVICE_TYPE = "Panel Upgrade / Replacement";
const CURRENT_STEP = 5;
const TOTAL_STEPS = 9;
const AMPERAGE_OPTIONS = ["50", "60", "100", "150", "200", "Unsure", "Other"];
const POWER_TYPE_OPTIONS = ["Overhead", "Underground", "Unsure"];

export default function CurrentPanelDetails() {
  const dispatch = useDispatch();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || SERVICE_TYPE;
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as PanelUpgradeRecord | undefined;

  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const { propertyType, ownershipStatus, timeline } = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  const currentAmperage = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "3" && data.details)
      return data.details.currentAmperage;
    return "" as const;
  });

  const powerType = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "3" && data.details) return data.details.powerType;
    return "" as const;
  });

  const currentAmperageOther = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "3" && data.details)
      return data.details.currentAmperageOther;
    return "";
  });

  const panelServiceType = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "3" && data.details)
      return data.details.serviceType;
    return "";
  });

  const upgradeAmps = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "3" && data.details)
      return data.details.upgradeAmps;
    return "";
  });

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.currentPanelAmperage) {
      dispatch(
        updatePanelUpgradeDetails({
          currentAmperage: draft.currentPanelAmperage as any,
        }),
      );
    }
    if (draft.powerFeedType) {
      dispatch(
        updatePanelUpgradeDetails({ powerType: draft.powerFeedType as any }),
      );
    }
  }, [draft]);

  // ─── Helper ──────────────────────────────────────────────────────────────────
  const createFormData = (payload: Record<string, any>) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    return formData;
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
      panelServiceType: panelServiceType || "",
      desiredPanelAmperage: upgradeAmps || "",
      currentPanelAmperage: currentAmperage || "",
      powerFeedType: powerType || "",
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
              pathname: "/(tabs)/quotes/quote/panel-upgrade/service-type",
              params: {
                serviceType: serviceType,
                serviceCallId: serviceCallId,
              },
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
            title="Current panel details"
            subtitle="Tell us about your existing setup"
          />

          <OptionGrid
            label="What is the amperage of your current panel?"
            options={AMPERAGE_OPTIONS}
            selected={currentAmperage}
            onSelect={(val) =>
              dispatch(
                updatePanelUpgradeDetails({ currentAmperage: val as any }),
              )
            }
            numColumns={1}
          />
          {currentAmperage === "Other" && (
            <CustomInput
              label="Please specify *"
              textInputConfig={{
                placeholder: "Enter amperage (e.g. 125)",
                keyboardType: "numeric",
                value: currentAmperageOther ?? "",
                onChangeText: (text) =>
                  dispatch(
                    updatePanelUpgradeDetails({
                      currentAmperageOther: text.replace(/[^0-9]/g, ""), // শুধু number allow
                    }),
                  ),
              }}
            />
          )}

          <View className="mb-[3%]">
            <Text className="text-[#1E293B] text-base font-Inter_SemiBold mb-1">
              Is your existing power overhead or underground to your electrical
              meter?
            </Text>
            <Text className="text-[#94A3B8] text-sm font-Inter_Regular mb-[1%]">
              Overhead = cable runs from utility pole to house in the air{"\n"}
              Underground = cable runs from utility pole/transformer to the
              house underground
            </Text>
            {POWER_TYPE_OPTIONS.map((option) => (
              <OptionGrid
                key={option}
                label=""
                options={[option]}
                selected={powerType}
                onSelect={(val) =>
                  dispatch(updatePanelUpgradeDetails({ powerType: val as any }))
                }
                numColumns={1}
              />
            ))}
          </View>

          <GradientButton
            label="Continue"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/quotes/quote/panel-upgrade/panel-location",
                params: { serviceType, serviceCallId },
              })
            }
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
