import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import InfoBanner from "@/src/components/quote/InfoBanner";
import MultiSelectList from "@/src/components/quote/MultiSelectList";
import OptionGrid from "@/src/components/quote/OptionGrid";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  toggleSchedulingDay,
  updateServiceCallDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { ServiceCallResponse } from "@/src/types/quotes.api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSelector } from "@reduxjs/toolkit";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";
import { z } from "zod";

// ─── Schema ──────────────────────────────────────────────────────────────────
const finalProjectSchema = z.object({
  preferredTime: z.string().min(1, "Please select a preferred time"),
  schedulingDays: z.array(z.string()).min(1, "Please select at least one day"),
});

type FinalProjectFormValues = z.infer<typeof finalProjectSchema>;

const DAYS = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays"];
const CURRENT_STEP = 5;
const SERVICE_TYPE = "Service Call";

// ─── Memoized Selectors ───────────────────────────────────────────────────────
const selectCategoryData = (state: RootState) => state.serviceForm.categoryData;
const selectSelectedCategory = (state: RootState) =>
  state.categoryRoute.selectedCategory;
const selectContactDetails = (state: RootState) =>
  state.serviceForm.contactDetails;
const selectServiceAddress = (state: RootState) =>
  state.serviceForm.serviceAddress;
const selectProjectBasics = (state: RootState) =>
  state.serviceForm.projectBasics;

const selectSchedulingDays = createSelector(
  [selectCategoryData, selectSelectedCategory],
  (data, selectedCategory) => {
    if (
      selectedCategory?.id === "1" &&
      data?.categoryId === "1" &&
      data.details
    ) {
      return data.details.schedulingDays ?? ([] as string[]);
    }
    return [] as string[];
  },
);

const selectPreferredTime = createSelector(
  [selectCategoryData, selectSelectedCategory],
  (data, selectedCategory) => {
    if (
      selectedCategory?.id === "1" &&
      data?.categoryId === "1" &&
      data.details
    ) {
      return data.details.preferredTime ?? "";
    }
    return "";
  },
);

const selectIssueDescription = createSelector([selectCategoryData], (data) => {
  if (data?.categoryId === "1") return data?.details?.projectDetails ?? "";
  return "";
});

export default function FinalProjectQuestions() {
  const dispatch = useDispatch();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || SERVICE_TYPE;

  // ─── Redux selectors ──────────────────────────────────────────────────────
  const schedulingDays = useSelector(selectSchedulingDays);
  const preferredTime = useSelector(selectPreferredTime);
  const issueDescription = useSelector(selectIssueDescription);

  const { fullName, email, phone, preferredContact } =
    useSelector(selectContactDetails);
  const { streetAddress, apartment, city, state, zipCode } =
    useSelector(selectServiceAddress);
  const { propertyType, ownershipStatus, timeline } =
    useSelector(selectProjectBasics);

  const totalSteps = 8;
  const completionPercentage = Math.round((CURRENT_STEP / totalSteps) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as ServiceCallResponse | undefined;

  // ─── RHF Setup ───────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FinalProjectFormValues>({
    resolver: zodResolver(finalProjectSchema),
    mode: "onChange",
    defaultValues: {
      preferredTime: preferredTime || "",
      schedulingDays: schedulingDays || [],
    },
  });

  // ─── Prefill from API draft ───────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;

    if (draft.preferredTime) {
      setValue("preferredTime", draft.preferredTime, { shouldValidate: true });
      dispatch(
        updateServiceCallDetails({ preferredTime: draft.preferredTime as any }),
      );
    }

    if (draft.schedulingPreference?.length) {
      setValue("schedulingDays", draft.schedulingPreference, {
        shouldValidate: true,
      });
      draft.schedulingPreference.forEach((day) => {
        dispatch(toggleSchedulingDay(day));
      });
    }
  }, [draftData]);

  // ─── Save for Later ───────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const values = getValues();

    const resolvedEmail = draft?.emailAddress || email || "";
    const resolvedFullName = draft?.fullName || fullName || "";
    const resolvedPhone = draft?.phoneNumber || phone || "";
    const resolvedPreferredContact =
      draft?.preferredContactMethod || preferredContact || "Call";

    const payload = {
      fullName: resolvedFullName,
      emailAddress: resolvedEmail,
      phoneNumber: resolvedPhone,
      preferredContactMethod: resolvedPreferredContact,
      streetAddress: streetAddress || "",
      apartmentUnit: apartment || "",
      city: city || "",
      state: state || "",
      zipCode: zipCode || "",
      propertyType: propertyType || "",
      ownershipStatus: ownershipStatus || "",
      timelineUrgency: timeline || "",
      issueDescription: issueDescription || "",
      preferredTime: values.preferredTime || "",
      schedulingPreference: values.schedulingDays || [],
      status: "draft" as const,
      completionPercentage,
    };

    try {
      if (serviceCallId) {
        console.log({ payload });
        await updateDraft(serviceCallId, serviceType, payload);
      } else {
        await createDraft(serviceType, {
          serviceType,
          ...payload,
        });
      }

      toast.success("Draft saved successfully!");
      router.push("/(tabs)/home/saved-draft");
    } catch (err: any) {
      console.log({ err });

      toast.error("Failed to save draft. Please try again.");
    }
  };

  // ─── Continue ─────────────────────────────────────────────────────────────
  const onSubmit = (values: FinalProjectFormValues) => {
    dispatch(
      updateServiceCallDetails({ preferredTime: values.preferredTime as any }),
    );
    router.push({
      pathname: "/(tabs)/quotes/quote/service-call/upload-photos",
      params: { serviceType, serviceCallId },
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
              pathname: "/(tabs)/quotes/quote/service-call/project-details",
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
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <StepProgressBar currentStep={CURRENT_STEP} totalSteps={totalSteps} />

          <CategoryTag title={serviceType} />

          <AuthHeading title="Final project questions" />

          <Controller
            control={control}
            name="preferredTime"
            render={({ field: { value, onChange } }) => (
              <>
                <OptionGrid
                  label="Preferred time for Service"
                  options={["AM (8-11)", "PM (12-2)"]}
                  selected={value}
                  onSelect={(val) => {
                    onChange(val);
                    dispatch(
                      updateServiceCallDetails({ preferredTime: val as any }),
                    );
                  }}
                  numColumns={1}
                />
                {errors.preferredTime && (
                  <Text className="text-red-500 text-xs mb-2">
                    {errors.preferredTime.message}
                  </Text>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name="schedulingDays"
            render={({ field: { value, onChange } }) => (
              <>
                <MultiSelectList
                  label="Scheduling preference"
                  options={DAYS}
                  selected={value}
                  onToggle={(val) => {
                    const updated = value.includes(val)
                      ? value.filter((d) => d !== val)
                      : [...value, val];
                    onChange(updated);
                    dispatch(toggleSchedulingDay(val));
                  }}
                />
                {errors.schedulingDays && (
                  <Text className="text-red-500 text-xs mb-2">
                    {errors.schedulingDays.message}
                  </Text>
                )}
              </>
            )}
          />

          <InfoBanner message="You can add extra details and photos next." />

          <GradientButton label="Continue" onPress={handleSubmit(onSubmit)} />
          <SavedEditAction
            onPress={handleSaveForLater}
            title={isSaving ? "Saving..." : "Save for Later"}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
