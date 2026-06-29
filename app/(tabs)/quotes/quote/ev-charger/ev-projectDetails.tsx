import { nemaChart } from "@/assets/images/svg/tabs-svg";
import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import CustomSvg from "@/src/components/shared/CustomSvg";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
import { useDraftSave } from "@/src/hooks/useDraftSave";
import {
  selectCategory,
  setEVChargerType,
  setEVProvidingCharger,
  updateEVChargerDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { EvChargerInstallationResponse } from "@/src/types/evCharger.api.types";
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
  View,
  useWindowDimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 4;
const TOTAL_STEPS = 9;

const CHARGER_TYPES = ["Plug-in", "Hardwired", "I want help deciding"];
const PROVIDING_OPTIONS = ["Yes", "No"];
const CHARGER_STATUS_OPTIONS = [
  "Currently have the charger",
  "Ordered and waiting on delivery",
  "Need to place order",
  "Need help choosing a charger",
];

type ChargerStatus = (typeof CHARGER_STATUS_OPTIONS)[number] | "";

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

// ─── Type guard for EV Charger draft ──────────────────────────────────────
const isEvChargerDraft = (
  draft: any,
): draft is EvChargerInstallationResponse => {
  return (
    draft &&
    typeof draft === "object" &&
    draft.chargerConnectionType !== undefined
  );
};

// ─── Type guard for charger status ──────────────────────────────────────────
const isValidChargerStatus = (status: string): status is ChargerStatus => {
  const validStatuses: ChargerStatus[] = [
    "Currently have the charger",
    "Ordered and waiting on delivery",
    "Need to place order",
    "Need help choosing a charger",
    "",
  ];
  return validStatuses.includes(status as ChargerStatus);
};

const SectionLabel = ({
  label,
  hasInfo = false,
  onInfoPress,
}: {
  label: string;
  hasInfo?: boolean;
  onInfoPress?: () => void;
}) => (
  <View className="flex-row items-center mb-2" style={{ flexWrap: "wrap" }}>
    <Text
      className="text-[#1E293B] text-[13.5px] font-Inter_SemiBold"
      style={{ flexShrink: 1, flexWrap: "wrap" }}
    >
      {label}
    </Text>
    {hasInfo && (
      <Pressable
        onPress={onInfoPress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{ marginLeft: 4 }}
      >
        <Ionicons name="information-circle-outline" size={16} color="#94A3B8" />
      </Pressable>
    )}
  </View>
);

const SelectOption = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingVertical: 13,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: selected ? "#0EA5E9" : "#FFFFFF",
      borderWidth: 1.5,
      borderColor: selected ? "#0EA5E9" : "#E2E8F0",
      marginBottom: 10,
      shadowColor: "#94A3B8",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: selected ? 0 : 0.07,
      shadowRadius: 3,
      elevation: selected ? 0 : 1,
    }}
  >
    <Text
      className="text-[13.5px] font-Inter_Medium"
      style={{ color: selected ? "#FFFFFF" : "#475569" }}
    >
      {label}
    </Text>
  </Pressable>
);

export default function EVChargerDetails() {
  const dispatch = useDispatch();
  const [showNemaChart, setShowNemaChart] = useState(false);
  const { width: screenWidth } = useWindowDimensions();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  // ─── Redux state ──────────────────────────────────────────────────────────────
  const selectedCategory = useSelector(
    (state: RootState) => state.categoryRoute.selectedCategory,
  );
  const contactDetails = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const serviceAddress = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const projectBasics = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );
  const categoryData = useSelector(
    (state: RootState) => state.serviceForm.categoryData,
  );

  const serviceType =
    serviceTypeParam || selectedCategory?.title || "EV Charger Installation";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  // ─── Ensure category is set ──────────────────────────────────────────────────
  useEffect(() => {
    if (!categoryData || categoryData.categoryId !== "2") {
      dispatch(selectCategory("2"));
    }
  }, []);

  // ─── API hooks ────────────────────────────────────────────────────────────────
  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const isEvCharger = isEvChargerDraft(draftData);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const chargerType =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.chargerType || ""
      : "";
  const nemaConfig =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.nemaConfig || ""
      : "";
  const providingCharger =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.providingCharger || ""
      : "";
  const chargerStatus =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.chargerStatus || ""
      : "";

  // ─── Prefill from API draft ───────────────────────────────────────────────────
  useEffect(() => {
    if (!draftData) return;

    if (isEvCharger) {
      // ✅ Charger Type
      if (draftData.chargerConnectionType) {
        dispatch(setEVChargerType(draftData.chargerConnectionType as any));
      }

      // ✅ NEMA Config
      if (draftData.nemaConfiguration) {
        dispatch(
          updateEVChargerDetails({ nemaConfig: draftData.nemaConfiguration }),
        );
      }

      // ✅ Providing Charger
      if (draftData.chargerProvidedByUser !== undefined) {
        const providingValue = draftData.chargerProvidedByUser ? "Yes" : "No";
        dispatch(setEVProvidingCharger(providingValue as any));
      }

      // ✅ Charger Status - with type safety
      if (
        draftData.chargerStatus &&
        isValidChargerStatus(draftData.chargerStatus)
      ) {
        dispatch(
          updateEVChargerDetails({
            chargerStatus: draftData.chargerStatus as any,
          }),
        );
      }
    }
  }, [draftData]);

  // ─── Handlers ──────────────────────────────────────────────────────────────────
  const handleChargerTypeSelect = (value: string) => {
    dispatch(setEVChargerType(value as any));
    // Reset dependent fields
    if (value !== "Plug-in") {
      dispatch(updateEVChargerDetails({ nemaConfig: "" }));
    }
    if (value === "I want help deciding") {
      dispatch(
        updateEVChargerDetails({
          nemaConfig: "",
          providingCharger: "",
          chargerStatus: "",
        }),
      );
    }
  };

  const handleProvidingChargerSelect = (value: string) => {
    dispatch(setEVProvidingCharger(value as any));
    if (value === "No") {
      dispatch(updateEVChargerDetails({ chargerStatus: "" }));
    }
  };

  const handleNemaConfigChange = (text: string) => {
    dispatch(updateEVChargerDetails({ nemaConfig: text }));
  };

  const handleChargerStatusSelect = (value: string) => {
    dispatch(updateEVChargerDetails({ chargerStatus: value as any }));
  };

  const isPlugIn = chargerType === "Plug-in";
  const isHardwired = chargerType === "Hardwired";
  const showConditionalFields = isPlugIn || isHardwired;
  const showChargerStatus = showConditionalFields && providingCharger === "Yes";

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    // ✅ Draft first, then Redux as fallback
    const finalFullName = draftData?.fullName || contactDetails.fullName || "";
    const finalEmail = draftData?.emailAddress || contactDetails.email || "";
    const finalPhone = draftData?.phoneNumber || contactDetails.phone || "";
    const finalPreferredContact =
      draftData?.preferredContactMethod ||
      contactDetails.preferredContact ||
      "Call";
    const finalStreetAddress =
      draftData?.streetAddress || serviceAddress.streetAddress || "";
    const finalApartment =
      draftData?.apartmentUnit || serviceAddress.apartment || "";
    const finalCity = draftData?.city || serviceAddress.city || "";
    const finalState = draftData?.state || serviceAddress.state || "";
    const finalZipCode = draftData?.zipCode || serviceAddress.zipCode || "";
    const finalPropertyType =
      draftData?.propertyType || projectBasics.propertyType || "";
    const finalOwnershipStatus =
      draftData?.ownershipStatus || projectBasics.ownershipStatus || "";
    const finalTimeline =
      draftData?.timelineUrgency || projectBasics.timeline || "";

    // ✅ Get ALL Redux values for fallback
    const reduxChargerType =
      categoryData?.categoryId === "2"
        ? (categoryData.details as any)?.chargerType || ""
        : "";
    const reduxNemaConfig =
      categoryData?.categoryId === "2"
        ? (categoryData.details as any)?.nemaConfig || ""
        : "";
    const reduxProvidingCharger =
      categoryData?.categoryId === "2"
        ? (categoryData.details as any)?.providingCharger || ""
        : "";
    const reduxChargerStatus =
      categoryData?.categoryId === "2"
        ? (categoryData.details as any)?.chargerStatus || ""
        : "";
    const reduxInstallationLocation =
      categoryData?.categoryId === "2"
        ? (categoryData.details as any)?.installationLocation || ""
        : "";
    const reduxPanelLocation =
      categoryData?.categoryId === "2"
        ? (categoryData.details as any)?.panelLocation || ""
        : "";
    const reduxPanelDistance =
      categoryData?.categoryId === "2"
        ? (categoryData.details as any)?.panelDistance || ""
        : "";
    const reduxChargerAreaPhotos =
      categoryData?.categoryId === "2"
        ? (categoryData.details as any)?.chargerAreaPhotos || []
        : [];
    const reduxPanelPhotos =
      categoryData?.categoryId === "2"
        ? (categoryData.details as any)?.panelPhotos || []
        : [];
    const reduxAdditionalInfo =
      categoryData?.categoryId === "2"
        ? (categoryData.details as any)?.additionalInfo || ""
        : "";

    // ✅ Build payload with correct ordering: draft → Redux → values → fallback
    const payload = {
      // ─── Common fields ──────────────────────────────────────────────────────
      fullName: draftData?.fullName || finalFullName || "",
      emailAddress: draftData?.emailAddress || finalEmail || "",
      phoneNumber: draftData?.phoneNumber || finalPhone || "",
      preferredContactMethod:
        draftData?.preferredContactMethod || finalPreferredContact || "Call",
      streetAddress: draftData?.streetAddress || finalStreetAddress || "",
      apartmentUnit: draftData?.apartmentUnit || finalApartment || "",
      city: draftData?.city || finalCity || "",
      state: draftData?.state || finalState || "",
      zipCode: draftData?.zipCode || finalZipCode || "",
      propertyType: draftData?.propertyType || finalPropertyType || "",
      ownershipStatus: draftData?.ownershipStatus || finalOwnershipStatus || "",
      timelineUrgency: draftData?.timelineUrgency || finalTimeline || "",

      // ─── EV Charger specific (draft → Redux → values → fallback) ──────────
      chargerConnectionType:
        (isEvCharger && draftData.chargerConnectionType) ||
        reduxChargerType ||
        chargerType ||
        "",
      nemaConfiguration:
        (isEvCharger && draftData.nemaConfiguration) ||
        reduxNemaConfig ||
        nemaConfig ||
        "",
      chargerProvidedByUser:
        isEvCharger && draftData.chargerProvidedByUser !== undefined
          ? draftData.chargerProvidedByUser
          : reduxProvidingCharger === "Yes" || providingCharger === "Yes",
      chargerStatus:
        (isEvCharger && draftData.chargerStatus) ||
        reduxChargerStatus ||
        chargerStatus ||
        "",
      installationLocation:
        (isEvCharger && draftData.installationLocation) ||
        reduxInstallationLocation ||
        "",
      panelLocation:
        (isEvCharger && draftData.panelLocation) || reduxPanelLocation || "",
      panelDistance:
        (isEvCharger && draftData.panelDistance) || reduxPanelDistance || "",

      // ─── Photos (draft → Redux) ─────────────────────────────────────────────
      areaPhoto:
        (isEvCharger && draftData.areaPhoto) ||
        (reduxChargerAreaPhotos?.length > 0 ? reduxChargerAreaPhotos[0] : ""),
      panelPhotos:
        (isEvCharger && draftData.panelPhotos) || reduxPanelPhotos || [],

      // ─── Additional Info ────────────────────────────────────────────────────
      additionalInformation:
        (isEvCharger && draftData.additionalInformation) ||
        reduxAdditionalInfo ||
        "",

      // ─── Status ──────────────────────────────────────────────────────────────
      status: "draft" as const,
      completionPercentage,
    };

    const formData = createFormData(payload);

    try {
      if (serviceCallId) {
        await updateDraft(serviceCallId, serviceType, formData);
      } else {
        await createDraft(serviceType, formData);
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

  // ─── Continue handler ────────────────────────────────────────────────────────
  const handleContinue = () => {
    router.push({
      pathname: "/(tabs)/quotes/quote/ev-charger/installation-location",
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
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />

          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Project details"
            subtitle="Step 1 of your EV service questions"
          />

          {/* Charger Type */}
          <View className="mb-4">
            <SectionLabel label="Is your EV charger hardwired or a plug-in?" />
            {CHARGER_TYPES.map((option) => (
              <SelectOption
                key={option}
                label={option}
                selected={chargerType === option}
                onPress={() => handleChargerTypeSelect(option)}
              />
            ))}
          </View>

          {showConditionalFields && (
            <>
              {/* NEMA Config - only for Plug-in */}
              {isPlugIn && (
                <View className="mb-4">
                  <SectionLabel
                    label="What NEMA configuration do you need?"
                    hasInfo
                    onInfoPress={() => setShowNemaChart((prev) => !prev)}
                  />

                  <TextInput
                    placeholder="14-50, 6-50, 14-30, unsure, etc."
                    placeholderTextColor="#AABCD0"
                    value={nemaConfig}
                    onChangeText={handleNemaConfigChange}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: 12,
                      borderWidth: 1.5,
                      borderColor: "#E2E8F0",
                      paddingHorizontal: 14,
                      paddingVertical: 13,
                      fontFamily: "Inter-Regular",
                      fontSize: 13.5,
                      color: "#1E293B",
                      shadowColor: "#94A3B8",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.07,
                      shadowRadius: 3,
                      elevation: 1,
                    }}
                  />

                  {/* NEMA Chart — inline toggle */}
                  {showNemaChart && (
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
                          onPress={() => setShowNemaChart(false)}
                          className="w-[26px] h-[26px] rounded-full items-center justify-center"
                          style={{ backgroundColor: "#BAE6FD" }}
                        >
                          <Ionicons name="close" size={14} color="#0369A1" />
                        </Pressable>
                      </View>

                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        style={{ backgroundColor: "#F0F9FF", maxHeight: 500 }}
                      >
                        <CustomSvg
                          xml={nemaChart}
                          width={screenWidth - 48}
                          height={600}
                        />
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}

              {/* Providing Charger */}
              <View className="mb-4">
                <SectionLabel label="Will you be providing the charger?" />
                {PROVIDING_OPTIONS.map((option) => (
                  <SelectOption
                    key={option}
                    label={option}
                    selected={providingCharger === option}
                    onPress={() => handleProvidingChargerSelect(option)}
                  />
                ))}
              </View>

              {/* Charger Status */}
              {showChargerStatus && (
                <View className="mb-4">
                  <SectionLabel label="What is the status of the charger?" />
                  {CHARGER_STATUS_OPTIONS.map((option) => (
                    <SelectOption
                      key={option}
                      label={option}
                      selected={chargerStatus === option}
                      onPress={() => handleChargerStatusSelect(option)}
                    />
                  ))}
                </View>
              )}
            </>
          )}

          <View className="mb-[4%]">
            <GradientButton
              label="Continue"
              onPress={handleContinue}
              disabled={isSaving}
            />
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
