import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import TextAreaInput from "@/src/components/shared/TextAreaInput";
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
import { useDraftSave } from "@/src/hooks/useDraftSave";
import { updateEVChargerDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  EVChargerInstallationLocationFormValues,
  evChargerInstallationLocationSchema,
} from "@/src/schemas/quotes/ev-charger/ev-chargerDetailsSchema";
import { EvChargerInstallationResponse } from "@/src/types/evCharger.api.types";
import { ServiceCallResponse } from "@/src/types/quotes.api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
const TOTAL_STEPS = 9;

const LOCATIONS = ["Garage", "Carport", "Driveway", "Other"];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

// Type guard to check if draft is EV Charger type
const isEvChargerDraft = (
  draft: ServiceCallResponse | EvChargerInstallationResponse,
): draft is EvChargerInstallationResponse => {
  return (
    (draft as EvChargerInstallationResponse).chargerConnectionType !== undefined
  );
};

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

export default function InstallationLocation() {
  const dispatch = useDispatch();

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

  // ─── Get current values from Redux ───────────────────────────────────────────
  const reduxInstallationLocation =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.installationLocation
      : "";
  const reduxInstallationLocationOther =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.installationLocationOther
      : "";

  // Determine if the saved value is a custom "Other" value (not in LOCATIONS array)
  const isOtherSelected =
    reduxInstallationLocation &&
    !LOCATIONS.includes(reduxInstallationLocation as any) &&
    reduxInstallationLocation !== "";

  // ─── API hooks ────────────────────────────────────────────────────────────────
  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);

  // ─── React Hook Form ──────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<EVChargerInstallationLocationFormValues>({
    resolver: zodResolver(evChargerInstallationLocationSchema),
    mode: "onChange",
    defaultValues: {
      installationLocation: isOtherSelected
        ? "Other"
        : reduxInstallationLocation || "",
      installationLocationOther: isOtherSelected
        ? reduxInstallationLocation
        : reduxInstallationLocationOther || "",
    },
  });

  const watchedInstallationLocation = watch("installationLocation");

  // ─── Prefill from API draft ───────────────────────────────────────────────────
  useEffect(() => {
    if (draftData && isEvChargerDraft(draftData)) {
      const apiLocation = draftData.installationLocation;

      if (apiLocation) {
        // Check if the API value is one of the predefined options
        if (LOCATIONS.includes(apiLocation as any)) {
          // It's a standard option
          setValue("installationLocation", apiLocation);
          setValue("installationLocationOther", "");
          dispatch(
            updateEVChargerDetails({
              installationLocation: apiLocation as any,
              installationLocationOther: "",
            }),
          );
        } else {
          // It's a custom "Other" value
          setValue("installationLocation", "Other");
          setValue("installationLocationOther", apiLocation);
          dispatch(
            updateEVChargerDetails({
              installationLocation: "Other",
              installationLocationOther: apiLocation,
            }),
          );
        }
      }
    }
  }, [draftData]);

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const values = getValues();

    // Determine the final installationLocation value for API
    // If "Other" is selected, use the custom text from installationLocationOther
    // Otherwise, use the selected value
    let finalInstallationLocation = "";
    if (values.installationLocation === "Other") {
      finalInstallationLocation = values.installationLocationOther || "";
    } else {
      finalInstallationLocation = values.installationLocation || "";
    }

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

    // Get previous step data from Redux or draft
    const previousData =
      categoryData?.categoryId === "2" ? (categoryData.details as any) : {};

    let finalChargerType = previousData.chargerType;
    let finalNemaConfig = previousData.nemaConfig;
    let finalProvidingCharger = previousData.providingCharger;
    let finalChargerStatus = previousData.chargerStatus;

    if (draftData && isEvChargerDraft(draftData)) {
      finalChargerType = draftData.chargerConnectionType || finalChargerType;
      finalNemaConfig = draftData.nemaConfiguration || finalNemaConfig;
      finalProvidingCharger =
        draftData.chargerProvidedByUser !== undefined
          ? draftData.chargerProvidedByUser
            ? "Yes"
            : "No"
          : finalProvidingCharger;
      finalChargerStatus = draftData.chargerStatus || finalChargerStatus;
    }

    // Build payload matching the EV Charger API structure
    const payload = {
      fullName: finalFullName || "",
      phoneNumber: finalPhone || "",
      emailAddress: finalEmail || "",
      preferredContactMethod: finalPreferredContact || "Call",
      streetAddress: finalStreetAddress || "",
      apartmentUnit: finalApartment || "",
      city: finalCity || "",
      state: finalState || "",
      zipCode: finalZipCode || "",
      propertyType: finalPropertyType || "",
      ownershipStatus: finalOwnershipStatus || "",
      timelineUrgency: finalTimeline || "",
      chargerConnectionType: finalChargerType || "",
      nemaConfiguration: finalNemaConfig || "",
      chargerProvidedByUser: finalProvidingCharger === "Yes",
      chargerStatus: finalChargerStatus || "",
      installationLocation: finalInstallationLocation,
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
      toast.error(
        error?.data?.message || "Failed to save draft. Please try again.",
      );
    }
  };

  // ─── Continue handler ────────────────────────────────────────────────────────
  const onSubmit = (values: EVChargerInstallationLocationFormValues) => {
    // Store both values in Redux
    dispatch(
      updateEVChargerDetails({
        installationLocation: values.installationLocation as any,
        installationLocationOther: values.installationLocationOther || "",
      }),
    );

    router.push({
      pathname: "/(tabs)/quotes/quote/ev-charger/panel-location",
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
              pathname: "/(tabs)/quotes/quote/ev-charger/ev-projectDetails",
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
            title="Installation location"
            subtitle="Tell us where you need the charger"
          />

          <View className="mb-4">
            <Text className="text-[#1E293B] text-[13.5px] font-Inter_SemiBold mb-3">
              Where do you want the EV charger installed?
            </Text>

            {LOCATIONS.map((option) => (
              <Controller
                key={option}
                control={control}
                name="installationLocation"
                render={({ field: { value, onChange } }) => (
                  <SelectOption
                    label={option}
                    selected={value === option}
                    onPress={() => {
                      onChange(option);
                      if (option !== "Other") {
                        setValue("installationLocationOther", "");
                      }
                    }}
                  />
                )}
              />
            ))}

            {errors.installationLocation && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.installationLocation.message}
              </Text>
            )}

            {watchedInstallationLocation === "Other" && (
              <Controller
                control={control}
                name="installationLocationOther"
                render={({ field: { value, onChange } }) => (
                  <TextAreaInput
                    label="Please specify"
                    placeholder="Describe your installation location"
                    value={value || ""}
                    onChangeText={onChange}
                    error={errors.installationLocationOther?.message}
                  />
                )}
              />
            )}
          </View>

          <GradientButton
            label="Continue"
            onPress={handleSubmit(onSubmit)}
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
