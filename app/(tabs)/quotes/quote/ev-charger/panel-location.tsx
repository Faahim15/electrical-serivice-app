import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
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
  EVChargerPanelLocationFormValues,
  evChargerPanelLocationSchema,
} from "@/src/schemas/quotes/ev-charger/ev-chargerPanelLocationSchema";
import { EvChargerInstallationResponse } from "@/src/types/evCharger.api.types";
import { ServiceCallResponse } from "@/src/types/quotes.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
const TOTAL_STEPS = 9;

const PANEL_LOCATIONS = [
  "Basement (Finished)",
  "Basement (Unfinished)",
  "Garage (Finished)",
  "Garage (Unfinished)",
  "Other (please specify)",
];

const PANEL_DISTANCES = [
  "Less than 25 ft",
  "25–50 ft",
  "50–100 ft",
  "More than 100 ft",
  "Unsure",
];

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

export default function PanelLocation() {
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
  const reduxPanelLocation =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.panelLocation
      : "";
  const reduxPanelDistance =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.panelDistance
      : "";
  const reduxPanelLocationOther =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.panelLocationOther
      : "";

  // Determine if the saved value is a custom "Other" value
  const isOtherSelected =
    reduxPanelLocation &&
    !PANEL_LOCATIONS.includes(reduxPanelLocation as any) &&
    reduxPanelLocation !== "";

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
  } = useForm<EVChargerPanelLocationFormValues>({
    resolver: zodResolver(evChargerPanelLocationSchema),
    mode: "onChange",
    defaultValues: {
      panelLocation: isOtherSelected
        ? "Other (please specify)"
        : reduxPanelLocation || "",
      panelLocationOther: isOtherSelected
        ? reduxPanelLocation
        : reduxPanelLocationOther || "",
      panelDistance: reduxPanelDistance || "",
    },
  });

  const watchedPanelLocation = watch("panelLocation");

  // ─── Prefill from API draft ───────────────────────────────────────────────────
  useEffect(() => {
    if (draftData && isEvChargerDraft(draftData)) {
      const apiPanelLocation = draftData.panelLocation;
      const apiPanelDistance = draftData.panelDistance;

      if (apiPanelLocation) {
        if (PANEL_LOCATIONS.includes(apiPanelLocation as any)) {
          setValue("panelLocation", apiPanelLocation);
          setValue("panelLocationOther", "");
          dispatch(
            updateEVChargerDetails({
              panelLocation: apiPanelLocation as any,
              panelLocationOther: "",
            }),
          );
        } else {
          setValue("panelLocation", "Other (please specify)");
          setValue("panelLocationOther", apiPanelLocation);
          dispatch(
            updateEVChargerDetails({
              panelLocation: "Other (please specify)",
              panelLocationOther: apiPanelLocation,
            }),
          );
        }
      }

      if (apiPanelDistance) {
        setValue("panelDistance", apiPanelDistance);
        dispatch(
          updateEVChargerDetails({
            panelDistance: apiPanelDistance as any,
          }),
        );
      }
    }
  }, [draftData]);

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const values = getValues();

    // Determine the final panelLocation value for API
    let finalPanelLocation = "";
    if (values.panelLocation === "Other (please specify)") {
      finalPanelLocation = values.panelLocationOther || "";
    } else {
      finalPanelLocation = values.panelLocation || "";
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
    let finalInstallationLocation = previousData.installationLocation;

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
      finalInstallationLocation =
        draftData.installationLocation || finalInstallationLocation;
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
      installationLocation: finalInstallationLocation || "",
      panelLocation: finalPanelLocation || "",
      panelDistance: values.panelDistance || "",
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
  const onSubmit = (values: EVChargerPanelLocationFormValues) => {
    // Store both values in Redux
    dispatch(
      updateEVChargerDetails({
        panelLocation: values.panelLocation as any,
        panelLocationOther: values.panelLocationOther || "",
        panelDistance: values.panelDistance as any,
      }),
    );

    router.push({
      pathname: "/(tabs)/quotes/quote/ev-charger/photos-needed",
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
              pathname: "/(tabs)/quotes/quote/ev-charger/installation-location",
              params: { serviceCallId, serviceType },
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
            title="Panel location"
            subtitle="Help us understand your electrical panel"
          />

          <Controller
            control={control}
            name="panelLocation"
            render={({ field: { value, onChange } }) => (
              <>
                <OptionGrid
                  label="Where is your electrical panel located?"
                  options={PANEL_LOCATIONS}
                  selected={value || ""}
                  onSelect={(val) => {
                    onChange(val);
                    if (val !== "Other (please specify)") {
                      setValue("panelLocationOther", "");
                    }
                  }}
                  numColumns={1}
                />
                {errors.panelLocation && (
                  <Text className="text-red-500 text-xs mb-2">
                    {errors.panelLocation.message}
                  </Text>
                )}
              </>
            )}
          />

          {watchedPanelLocation === "Other (please specify)" && (
            <Controller
              control={control}
              name="panelLocationOther"
              render={({ field: { value, onChange } }) => (
                <TextAreaInput
                  label="Please specify"
                  placeholder="Describe your panel location"
                  value={value || ""}
                  onChangeText={onChange}
                  error={errors.panelLocationOther?.message}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="panelDistance"
            render={({ field: { value, onChange } }) => (
              <>
                <OptionGrid
                  label="What is the approximate distance of the electrical panel from charger install location?"
                  sublabel={true}
                  options={PANEL_DISTANCES}
                  selected={value || ""}
                  onSelect={onChange}
                  numColumns={1}
                />
                {errors.panelDistance && (
                  <Text className="text-red-500 text-xs mb-2">
                    {errors.panelDistance.message}
                  </Text>
                )}
              </>
            )}
          />

          <View className="mt-[3%]">
            <GradientButton
              label="Continue"
              onPress={handleSubmit(onSubmit)}
              disabled={isSaving}
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
