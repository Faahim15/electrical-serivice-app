import { nemaChart } from "@/assets/images/svg/tabs-svg";
import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import CustomSvg from "@/src/components/shared/CustomSvg";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  setEVChargerType,
  setEVProvidingCharger,
  updateEVChargerDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  EVChargerDetailsFormValues,
  evChargerDetailsSchema,
} from "@/src/schemas/quotes/ev-charger/ev-chargerDetailsSchema";
import { verticalScale } from "@/src/utils/Scaling";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

  // ─── API hooks ────────────────────────────────────────────────────────────────
  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);

  // ─── Get current values from Redux ───────────────────────────────────────────
  const reduxChargerType =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.chargerType
      : "";
  const reduxNemaConfig =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.nemaConfig
      : "";
  const reduxProvidingCharger =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.providingCharger
      : "";
  const reduxChargerStatus =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.chargerStatus
      : "";
  // Add this helper function at the top of the file, after imports
  const createFormData = (payload: Record<string, any>) => {
    const formData = new FormData();
    // Add data as JSON string (as per API requirement)
    formData.append("data", JSON.stringify(payload));
    return formData;
  };
  // ─── React Hook Form ──────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<EVChargerDetailsFormValues>({
    resolver: zodResolver(evChargerDetailsSchema),
    mode: "onChange",
    defaultValues: {
      chargerType: reduxChargerType || "",
      nemaConfig: reduxNemaConfig || "",
      providingCharger: reduxProvidingCharger || "",
      chargerStatus: reduxChargerStatus || "",
    },
  });

  const watchedChargerType = watch("chargerType");
  const watchedProvidingCharger = watch("providingCharger");

  const isPlugIn = watchedChargerType === "Plug-in";
  const isHardwired = watchedChargerType === "Hardwired";
  const showConditionalFields = isPlugIn || isHardwired;
  const showChargerStatus =
    showConditionalFields && watchedProvidingCharger === "Yes";

  // ─── Prefill from API draft ───────────────────────────────────────────────────
  useEffect(() => {
    if (draftData) {
      const draft = draftData as any;

      if (draft.chargerConnectionType) {
        setValue("chargerType", draft.chargerConnectionType);
        dispatch(setEVChargerType(draft.chargerConnectionType));
      }
      if (draft.nemaConfiguration) {
        setValue("nemaConfig", draft.nemaConfiguration);
        dispatch(
          updateEVChargerDetails({ nemaConfig: draft.nemaConfiguration }),
        );
      }
      if (draft.chargerProvidedByUser !== undefined) {
        const providingValue = draft.chargerProvidedByUser ? "Yes" : "No";
        setValue("providingCharger", providingValue);
        dispatch(setEVProvidingCharger(providingValue as any));
      }
      if (draft.chargerStatus) {
        setValue("chargerStatus", draft.chargerStatus);
        dispatch(
          updateEVChargerDetails({ chargerStatus: draft.chargerStatus }),
        );
      }
    }
  }, [draftData]);

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const values = getValues();

    // Get all required data from Redux or draft
    const finalFullName = draftData?.fullName || contactDetails.fullName;
    const finalEmail = draftData?.emailAddress || contactDetails.email;
    const finalPhone = draftData?.phoneNumber || contactDetails.phone;
    const finalPreferredContact =
      draftData?.preferredContactMethod || contactDetails.preferredContact;
    const finalStreetAddress =
      draftData?.streetAddress || serviceAddress.streetAddress;
    const finalApartment = draftData?.apartmentUnit || serviceAddress.apartment;
    const finalCity = draftData?.city || serviceAddress.city;
    const finalState = draftData?.state || serviceAddress.state;
    const finalZipCode = draftData?.zipCode || serviceAddress.zipCode;
    const finalPropertyType =
      draftData?.propertyType || projectBasics.propertyType;
    const finalOwnershipStatus =
      draftData?.ownershipStatus || projectBasics.ownershipStatus;
    const finalTimeline = draftData?.timelineUrgency || projectBasics.timeline;

    const payload = {
      fullName: finalFullName || "",
      emailAddress: finalEmail || "",
      phoneNumber: finalPhone || "",
      preferredContactMethod: finalPreferredContact || "Call",
      streetAddress: finalStreetAddress || "",
      apartmentUnit: finalApartment || "",
      city: finalCity || "",
      state: finalState || "",
      zipCode: finalZipCode || "",
      propertyType: finalPropertyType || "",
      ownershipStatus: finalOwnershipStatus || "",
      timelineUrgency: finalTimeline || "",
      chargerConnectionType: values.chargerType || "",
      nemaConfiguration: values.nemaConfig || "",
      chargerProvidedByUser: values.providingCharger === "Yes",
      chargerStatus: values.chargerStatus || "",
      status: "draft" as const,
      completionPercentage,
    };

    // Create FormData from payload
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
      toast.error("Failed to save draft. Please try again.");
    }
  };

  // ─── Continue handler ────────────────────────────────────────────────────────
  const onSubmit = (values: EVChargerDetailsFormValues) => {
    // Dispatch to Redux
    dispatch(setEVChargerType(values.chargerType as any));
    if (values.nemaConfig) {
      dispatch(updateEVChargerDetails({ nemaConfig: values.nemaConfig }));
    }
    if (values.providingCharger) {
      dispatch(setEVProvidingCharger(values.providingCharger as any));
    }
    if (values.chargerStatus) {
      dispatch(
        updateEVChargerDetails({ chargerStatus: values.chargerStatus as any }),
      );
    }

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
              <Controller
                key={option}
                control={control}
                name="chargerType"
                render={({ field: { value, onChange } }) => (
                  <SelectOption
                    label={option}
                    selected={value === option}
                    onPress={() => onChange(option)}
                  />
                )}
              />
            ))}
            {errors.chargerType && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.chargerType.message}
              </Text>
            )}
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

                  <Controller
                    control={control}
                    name="nemaConfig"
                    render={({ field: { value, onChange } }) => (
                      <TextInput
                        placeholder="14-50, 6-50, 14-30, unsure, etc."
                        placeholderTextColor="#AABCD0"
                        value={value}
                        onChangeText={onChange}
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: 12,
                          borderWidth: 1.5,
                          borderColor: errors.nemaConfig
                            ? "#EF4444"
                            : "#E2E8F0",
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
                    )}
                  />
                  {errors.nemaConfig && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.nemaConfig.message}
                    </Text>
                  )}

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
                  <Controller
                    key={option}
                    control={control}
                    name="providingCharger"
                    render={({ field: { value, onChange } }) => (
                      <SelectOption
                        label={option}
                        selected={value === option}
                        onPress={() => onChange(option)}
                      />
                    )}
                  />
                ))}
                {errors.providingCharger && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.providingCharger.message}
                  </Text>
                )}
              </View>

              {/* Charger Status */}
              {showChargerStatus && (
                <View className="mb-4">
                  <SectionLabel label="What is the status of the charger?" />
                  {CHARGER_STATUS_OPTIONS.map((option) => (
                    <Controller
                      key={option}
                      control={control}
                      name="chargerStatus"
                      render={({ field: { value, onChange } }) => (
                        <SelectOption
                          label={option}
                          selected={value === option}
                          onPress={() => onChange(option)}
                        />
                      )}
                    />
                  ))}
                  {errors.chargerStatus && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.chargerStatus.message}
                    </Text>
                  )}
                </View>
              )}
            </>
          )}

          <View className="mb-[4%]">
            <GradientButton
              label="Continue"
              onPress={handleSubmit(onSubmit)}
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
