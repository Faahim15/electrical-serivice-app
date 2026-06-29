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
import {
  selectCategory,
  updateEVChargerDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  EVChargerInstallationLocationFormValues,
  evChargerInstallationLocationSchema,
} from "@/src/schemas/quotes/ev-charger/ev-chargerDetailsSchema";
import { EvChargerInstallationResponse } from "@/src/types/evCharger.api.types";
import { verticalScale } from "@/src/utils/Scaling";
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

// ✅ Type guard - checks if draft is EV Charger
const isEvChargerDraft = (
  draft: any,
): draft is EvChargerInstallationResponse => {
  return (
    draft &&
    typeof draft === "object" &&
    draft.chargerConnectionType !== undefined
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

  // ─── Ensure category is set ──────────────────────────────────────────────────
  useEffect(() => {
    if (!categoryData || categoryData.categoryId !== "2") {
      dispatch(selectCategory("2"));
    }
  }, []);

  // ─── Get current values from Redux ───────────────────────────────────────────
  const reduxInstallationLocation =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.installationLocation || ""
      : "";
  const reduxInstallationLocationOther =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.installationLocationOther || ""
      : "";

  // ─── Get ALL Redux values for fallback ──────────────────────────────────────
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

  // Determine if the saved value is a custom "Other" value
  const isOtherSelected =
    reduxInstallationLocation &&
    !LOCATIONS.includes(reduxInstallationLocation as any) &&
    reduxInstallationLocation !== "";

  // ─── API hooks ────────────────────────────────────────────────────────────────
  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);

  // ─── Check if draft is EV Charger ────────────────────────────────────────────
  const isEvCharger = isEvChargerDraft(draftData);

  // ─── React Hook Form ──────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
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
    if (!draftData) return;

    if (isEvCharger) {
      const apiLocation = draftData.installationLocation;
      const formValues: Partial<EVChargerInstallationLocationFormValues> = {};

      if (apiLocation) {
        if (LOCATIONS.includes(apiLocation as any)) {
          formValues.installationLocation = apiLocation;
          formValues.installationLocationOther = "";
          dispatch(
            updateEVChargerDetails({
              installationLocation: apiLocation as any,
              installationLocationOther: "",
            }),
          );
        } else {
          formValues.installationLocation = "Other";
          formValues.installationLocationOther = apiLocation;
          dispatch(
            updateEVChargerDetails({
              installationLocation: "Other",
              installationLocationOther: apiLocation,
            }),
          );
        }
      }

      if (Object.keys(formValues).length > 0) {
        reset(formValues);
      }
    }
  }, [draftData]);

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const values = getValues();

    // Determine the final installationLocation value for API
    let finalInstallationLocation = "";
    if (values.installationLocation === "Other") {
      finalInstallationLocation = values.installationLocationOther || "";
    } else {
      finalInstallationLocation = values.installationLocation || "";
    }

    // ✅ Build payload - draft first, then Redux, then values/fallback
    const payload = {
      // ─── Common fields (draft → Redux → fallback) ──────────────────────────
      fullName: draftData?.fullName || contactDetails.fullName || "",
      emailAddress: draftData?.emailAddress || contactDetails.email || "",
      phoneNumber: draftData?.phoneNumber || contactDetails.phone || "",
      preferredContactMethod:
        draftData?.preferredContactMethod ||
        contactDetails.preferredContact ||
        "Call",
      streetAddress:
        draftData?.streetAddress || serviceAddress.streetAddress || "",
      apartmentUnit: draftData?.apartmentUnit || serviceAddress.apartment || "",
      city: draftData?.city || serviceAddress.city || "",
      state: draftData?.state || serviceAddress.state || "",
      zipCode: draftData?.zipCode || serviceAddress.zipCode || "",
      propertyType: draftData?.propertyType || projectBasics.propertyType || "",
      ownershipStatus:
        draftData?.ownershipStatus || projectBasics.ownershipStatus || "",
      timelineUrgency:
        draftData?.timelineUrgency || projectBasics.timeline || "",

      // ─── EV Charger specific (draft → Redux → values → fallback) ────────────
      chargerConnectionType:
        (isEvCharger && draftData.chargerConnectionType) ||
        reduxChargerType ||
        "",
      nemaConfiguration:
        (isEvCharger && draftData.nemaConfiguration) || reduxNemaConfig || "",
      chargerProvidedByUser:
        isEvCharger && draftData.chargerProvidedByUser !== undefined
          ? draftData.chargerProvidedByUser
          : reduxProvidingCharger === "Yes",
      chargerStatus:
        (isEvCharger && draftData.chargerStatus) || reduxChargerStatus || "",

      // ─── Current screen's field (draft → values → fallback) ──────────────────
      installationLocation:
        (isEvCharger && draftData.installationLocation) ||
        finalInstallationLocation ||
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
  const onSubmit = (values: EVChargerInstallationLocationFormValues) => {
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
          contentContainerStyle={{ paddingBottom: verticalScale(132) }}
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
