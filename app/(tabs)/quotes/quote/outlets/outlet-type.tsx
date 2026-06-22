import { nemaChart } from "@/assets/images/svg/tabs-svg";
import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import CustomInput from "@/src/components/shared/CustomInput";
import CustomSvg from "@/src/components/shared/CustomSvg";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  selectCategory,
  updateOutletsDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { OutletRecord } from "@/src/types/quotes/outlet.api.types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 6;
const TOTAL_STEPS = 7;

const OUTLET_TYPES = [
  "Standard (Rounded)",
  "Decorator (Rectangle)",
  "GFI",
  "Surge protected",
  "Floor",
  "Smart",
  "Night light",
  "I'll provide my own",
];
const AMPS = ["15", "20", "30", "50"];
const VOLTS = ["110 or 120", "220 or 240", "110/220 or 120/240"];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function OutletType() {
  const dispatch = useDispatch();
  const { width: screenWidth } = useWindowDimensions();
  const [isNemaChartVisible, setIsNemaChartVisible] = useState(false);
  const [localOutletTypes, setLocalOutletTypes] = useState<string[]>([]);
  const [localAmps, setLocalAmps] = useState("");
  const [localVolts, setLocalVolts] = useState("");
  const [localNema, setLocalNema] = useState("");

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
  const reduxOutletTypes =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.outletTypes || []
      : [];
  const reduxAmps =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.ampsNeeded || ""
      : "";
  const reduxVolts =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.voltsNeeded || ""
      : "";
  const reduxNema =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.NEMAConfiguration || ""
      : "";

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    if (reduxOutletTypes.length > 0) setLocalOutletTypes(reduxOutletTypes);
  }, [reduxOutletTypes]);

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
    if (draft.typeOfOutletsNeed) {
      setLocalOutletTypes([draft.typeOfOutletsNeed]);
      dispatch(
        updateOutletsDetails({ outletTypes: [draft.typeOfOutletsNeed] }),
      );
    }
    if (draft.howManyAmps) {
      setLocalAmps(draft.howManyAmps);
      dispatch(updateOutletsDetails({ ampsNeeded: draft.howManyAmps }));
    }
    if (draft.ampsOrVoltsNeeded) {
      setLocalVolts(draft.ampsOrVoltsNeeded);
      dispatch(updateOutletsDetails({ voltsNeeded: draft.ampsOrVoltsNeeded }));
    }
    if (draft.NEMAConfiguration) {
      setLocalNema(draft.NEMAConfiguration);
      dispatch(
        updateOutletsDetails({ NEMAConfiguration: draft.NEMAConfiguration }),
      );
    }
  }, [draft]);

  // ─── Handlers ──────────────────────────────────────────────────────────────────
  const handleOutletTypeToggle = (type: string) => {
    let updated = [...localOutletTypes];
    if (updated.includes(type)) {
      updated = updated.filter((t) => t !== type);
    } else {
      updated.push(type);
    }
    setLocalOutletTypes(updated);
    dispatch(updateOutletsDetails({ outletTypes: updated }));
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
      typeOfOutletsNeed: localOutletTypes.join(", ") || "",
      howManyAmps: localAmps || "",
      ampsOrVoltsNeeded: localVolts || "",
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
    if (localOutletTypes.length > 0) {
      dispatch(updateOutletsDetails({ outletTypes: localOutletTypes }));
    }
    if (localAmps) {
      dispatch(updateOutletsDetails({ ampsNeeded: localAmps }));
    }
    if (localVolts) {
      dispatch(updateOutletsDetails({ voltsNeeded: localVolts }));
    }
    if (localNema) {
      dispatch(updateOutletsDetails({ NEMAConfiguration: localNema }));
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/outlets/outlet-additional",
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
              pathname: "/(tabs)/quotes/quote/outlets/outlet-install",
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
            title="Outlet Type"
            subtitle="What type of outlet(s) do you need?"
          />

          <OptionGrid
            label="What type of outlet(s) do you need? (Select all that apply)"
            options={OUTLET_TYPES}
            selected={localOutletTypes.join(", ")}
            onSelect={handleOutletTypeToggle}
            numColumns={2}
          />

          <OptionGrid
            label="How many Amps?"
            options={AMPS}
            selected={localAmps}
            onSelect={(val) => {
              setLocalAmps(val);
              dispatch(updateOutletsDetails({ ampsNeeded: val }));
            }}
            numColumns={2}
          />

          <OptionGrid
            label="How many amps/volts do you need?"
            options={VOLTS}
            selected={localVolts}
            onSelect={(val) => {
              setLocalVolts(val);
              dispatch(updateOutletsDetails({ voltsNeeded: val }));
            }}
            numColumns={1}
          />

          <View className="mb-4">
            <Pressable
              onPress={() => setIsNemaChartVisible(!isNemaChartVisible)}
              className="flex-row items-center"
            >
              <CustomInput
                label="What is the NEMA configuration for the receptacle? (If there will be one)"
                textInputConfig={{
                  placeholder: "14-50, 6-50, 14-30, unsure, etc.",
                  value: localNema,
                  onChangeText: (text) => {
                    setLocalNema(text);
                    dispatch(updateOutletsDetails({ NEMAConfiguration: text }));
                  },
                }}
              />
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#60A5FA"
                style={{ marginLeft: 8 }}
              />
            </Pressable>

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
                    <Ionicons name="close" size={14} color="#0369A1" />
                  </Pressable>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  style={{ backgroundColor: "#F0F9FF", maxHeight: 1400 }}
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
