import { nemaChart } from "@/assets/images/svg/tabs-svg";
import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import CustomSvg from "@/src/components/shared/CustomSvg";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  selectCategory,
  updateDedicatedCircuitDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { DedicatedCircuitRecord } from "@/src/types/quotes/dedicated-circuit.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 6;
const TOTAL_STEPS = 8;

const AMP_OPTIONS = [15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 125, 150];
const VOLT_OPTIONS = ["110 or 120", "220 or 240", "110/220 or 120/240"];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function CircuitSpecs() {
  const dispatch = useDispatch();
  const { width: screenWidth } = useWindowDimensions();
  const [localAmps, setLocalAmps] = useState<number | null>(null);
  const [localVolts, setLocalVolts] = useState("");
  const [localNema, setLocalNema] = useState("");
  const [nemaFocused, setNemaFocused] = useState(false);
  const [isNemaChartVisible, setIsNemaChartVisible] = useState(false);

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
  const reduxAmps =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.ampsNeeded || null
      : null;
  const reduxVolts =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.voltsNeeded || ""
      : "";
  const reduxNema =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.NEMAConfiguration || ""
      : "";

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    if (reduxAmps) setLocalAmps(reduxAmps);
  }, [reduxAmps]);

  useEffect(() => {
    if (reduxVolts) setLocalVolts(reduxVolts);
  }, [reduxVolts]);

  useEffect(() => {
    if (reduxNema) setLocalNema(reduxNema);
  }, [reduxNema]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.ampsNeeded) {
      setLocalAmps(parseInt(draft.ampsNeeded));
      dispatch(updateDedicatedCircuitDetails({ ampsNeeded: draft.ampsNeeded }));
    }
    if (draft.voltsNeeded) {
      setLocalVolts(draft.voltsNeeded);
      dispatch(
        updateDedicatedCircuitDetails({ voltsNeeded: draft.voltsNeeded }),
      );
    }
    if (draft.NEMAConfiguration) {
      setLocalNema(draft.NEMAConfiguration);
      dispatch(
        updateDedicatedCircuitDetails({
          NEMAConfiguration: draft.NEMAConfiguration,
        }),
      );
    }
  }, [draft]);

  // ─── Handlers ──────────────────────────────────────────────────────────────────
  const handleAmpSelect = (val: string) => {
    const numVal = parseInt(val);
    setLocalAmps(numVal);
    dispatch(updateDedicatedCircuitDetails({ ampsNeeded: val }));
  };

  const handleVoltSelect = (val: string) => {
    setLocalVolts(val);
    dispatch(updateDedicatedCircuitDetails({ voltsNeeded: val }));
  };

  const handleNemaChange = (text: string) => {
    setLocalNema(text);
    dispatch(updateDedicatedCircuitDetails({ NEMAConfiguration: text }));
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
      ampsNeeded: localAmps ? String(localAmps) : "",
      voltsNeeded: localVolts || "",
      NEMAConfiguration: localNema || "",
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
    if (localAmps) {
      dispatch(
        updateDedicatedCircuitDetails({ ampsNeeded: String(localAmps) }),
      );
    }
    if (localVolts) {
      dispatch(updateDedicatedCircuitDetails({ voltsNeeded: localVolts }));
    }
    if (localNema) {
      dispatch(updateDedicatedCircuitDetails({ NEMAConfiguration: localNema }));
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/dedicated-circuit/circuit-photos",
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
                "/(tabs)/quotes/quote/dedicated-circuit/circuit-location",
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

          <AuthHeading title="Electrical specifications" subtitle="" />

          <OptionGrid
            label="How many amps do you need?"
            options={AMP_OPTIONS.map(String)}
            selected={localAmps ? String(localAmps) : ""}
            onSelect={handleAmpSelect}
            numColumns={2}
          />

          <OptionGrid
            label="How many volts do you need?"
            options={VOLT_OPTIONS}
            selected={localVolts}
            onSelect={handleVoltSelect}
            numColumns={1}
          />

          {/* ─── NEMA Configuration with Info Button ─────────────────────────── */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-[#1E293B] text-[13.5px] font-Inter_SemiBold">
                What is the NEMA configuration?
              </Text>
              <Pressable
                onPress={() => setIsNemaChartVisible(!isNemaChartVisible)}
                className="ml-2"
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#94A3B8"
                />
              </Pressable>
            </View>
            <Text className="text-[#94A3B8] text-xs font-Inter_Regular mb-2">
              If there will be one
            </Text>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                borderWidth: nemaFocused ? 1.5 : 1,
                borderColor: nemaFocused ? "#0EA5E9" : "#E2E8F0",
                paddingHorizontal: 13,
                paddingVertical: 13,
                shadowColor: "#94A3B8",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.07,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              <TextInput
                value={localNema}
                onChangeText={handleNemaChange}
                onFocus={() => setNemaFocused(true)}
                onBlur={() => setNemaFocused(false)}
                placeholder="13-50, 6-50, 13-30, unsure, etc."
                placeholderTextColor="#AABCD0"
                className="font-Inter_Regular text-[13.5px] text-[#1E293B]"
                style={{ padding: 0, margin: 0 }}
              />
            </View>

            {/* ─── NEMA Chart ─────────────────────────────────────────────────── */}
            {isNemaChartVisible && (
              <View
                className="mt-3 rounded-2xl overflow-hidden"
                style={{
                  borderWidth: 1,
                  borderColor: "#BAE6FD",
                  shadowColor: "#0EA5E9",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View
                  className="flex-row items-center justify-between px-4 py-3"
                  style={{ backgroundColor: "#EEF9FF" }}
                >
                  <Text className="text-lg font-Inter_SemiBold text-[#0369A1]">
                    NEMA Configuration Chart
                  </Text>
                  <Pressable
                    onPress={() => setIsNemaChartVisible(false)}
                    className="w-[26px] h-[26px] rounded-full items-center justify-center"
                    style={{ backgroundColor: "#BAE6FD" }}
                  >
                    <Ionicons name="close" size={13} color="#0369A1" />
                  </Pressable>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  style={{ backgroundColor: "#F0F9FF", maxHeight: 1300 }}
                >
                  <CustomSvg
                    xml={nemaChart}
                    width={screenWidth - 48}
                    height={800}
                  />
                </ScrollView>
              </View>
            )}
          </View>

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
