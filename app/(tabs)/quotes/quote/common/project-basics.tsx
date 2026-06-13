import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import InfoBanner from "@/src/components/quote/InfoBanner";
import OptionGrid from "@/src/components/quote/OptionGrid";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import TimelineOption from "@/src/components/quote/TimelineOption";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import TextAreaInput from "@/src/components/shared/TextAreaInput";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  selectCategory,
  updateProjectBasics,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  ProjectBasicsFormValues,
  projectBasicsSchema,
} from "@/src/schemas/quotes/common/projectBasicsSchema";
import { CATEGORY_TOTAL_STEPS } from "@/src/utils/CategorySteps";
import { verticalScale } from "@/src/utils/Scaling";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 3;

export default function ProjectBasics() {
  const dispatch = useDispatch();

  const { serviceType: serviceTypeParam, serviceCallId } =
    useLocalSearchParams<{
      serviceType: string;
      serviceCallId: string;
    }>();

  const { propertyType, ownershipStatus, timeline, ownershipStatusOther } =
    useSelector((state: RootState) => state.serviceForm.projectBasics);
  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const selectedCategory = useSelector(
    (state: RootState) => state.categoryRoute.selectedCategory,
  );

  const serviceType = serviceTypeParam || selectedCategory?.title || "N/A";
  const totalSteps = CATEGORY_TOTAL_STEPS[selectedCategory?.id ?? ""] ?? 8;
  const completionPercentage = Math.round((CURRENT_STEP / totalSteps) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);

  // ─── RHF Setup ──────────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<ProjectBasicsFormValues>({
    resolver: zodResolver(projectBasicsSchema),
    defaultValues: {
      propertyType: propertyType || "",
      ownershipStatus: ownershipStatus || "",
      ownershipStatusOther: ownershipStatusOther || "",
      timeline: timeline || "",
    },
  });

  const watchedOwnershipStatus = watch("ownershipStatus");

  // ─── Prefill from draft API ──────────────────────────────────────────────────
  useEffect(() => {
    if (!draftData) return;

    const values = {
      propertyType: draftData.propertyType || propertyType || "",
      ownershipStatus: draftData.ownershipStatus || ownershipStatus || "",
      ownershipStatusOther: ownershipStatusOther || "",
      timeline: draftData.timelineUrgency || timeline || "",
    };

    setValue("propertyType", values.propertyType);
    setValue("ownershipStatus", values.ownershipStatus);
    setValue("timeline", values.timeline);

    dispatch(
      updateProjectBasics({
        propertyType: values.propertyType as any,
        ownershipStatus: values.ownershipStatus as any,
        timeline: values.timeline as any,
      }),
    );
  }, [draftData]);

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const values = getValues();

    const resolvedEmail = draftData?.emailAddress || email || "";
    const resolvedFullName = draftData?.fullName || fullName || "";
    const resolvedPhone = draftData?.phoneNumber || phone || "";
    const resolvedPreferredContact =
      draftData?.preferredContactMethod || preferredContact || "Call";

    console.log("resolved", resolvedEmail);

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
      propertyType: values.propertyType || "",
      ownershipStatus: values.ownershipStatus || "",
      timelineUrgency: values.timeline || "",
      status: "draft" as const,
      completionPercentage,
    };

    try {
      if (serviceCallId) {
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

  // ─── Continue handler ────────────────────────────────────────────────────────
  const onSubmit = (values: ProjectBasicsFormValues) => {
    dispatch(updateProjectBasics(values as any));

    const params = { serviceType, serviceCallId };

    if (selectedCategory?.id === "1" || serviceType === "Service Call") {
      dispatch(selectCategory("1"));
      router.push({
        pathname: "/(tabs)/quotes/quote/service-call/project-details",
        params,
      });
    } else if (
      selectedCategory?.id === "2" ||
      serviceType === "EV Charger Installation"
    ) {
      dispatch(selectCategory("2"));
      router.push({
        pathname: "/(tabs)/quotes/quote/ev-charger/ev-projectDetails",
        params,
      });
    } else if (
      selectedCategory?.id === "3" ||
      serviceType === "Panel Upgrade"
    ) {
      dispatch(selectCategory("3"));
      router.push({
        pathname: "/(tabs)/quotes/quote/panel-upgrade/service-type",
        params,
      });
    } else if (selectedCategory?.id === "4") {
      dispatch(selectCategory("4"));
      router.push({
        pathname: "/(tabs)/quotes/quote/remodeling/project-basics",
        params,
      });
    } else if (selectedCategory?.id === "5") {
      dispatch(selectCategory("5"));
      router.push({
        pathname: "/(tabs)/quotes/quote/accessory-building/building-basics",
        params,
      });
    } else if (selectedCategory?.id === "6") {
      dispatch(selectCategory("6"));
      router.push({
        pathname: "/(tabs)/quotes/quote/hot-tub/hot-tub-info",
        params,
      });
    } else if (selectedCategory?.id === "7") {
      dispatch(selectCategory("7"));
      router.push({
        pathname: "/(tabs)/quotes/quote/dock-power/dock-basics",
        params,
      });
    } else if (selectedCategory?.id === "8") {
      dispatch(selectCategory("8"));
      router.push({
        pathname: "/(tabs)/quotes/quote/electrical-inspection/inspection-type",
        params,
      });
    } else if (selectedCategory?.id === "9") {
      dispatch(selectCategory("9"));
      router.push({
        pathname: "/(tabs)/quotes/quote/generator/generator-type",
        params,
      });
    } else if (selectedCategory?.id === "10") {
      dispatch(selectCategory("10"));
      router.push({
        pathname: "/(tabs)/quotes/quote/new-construction/project-status",
        params,
      });
    }
  };

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(120) }}
        >
          <StepProgressBar currentStep={CURRENT_STEP} totalSteps={totalSteps} />
          <CategoryTag title={serviceType} />
          <AuthHeading
            title="Project basics"
            subtitle="A few details to help us understand the job"
          />

          <Controller
            control={control}
            name="propertyType"
            render={({ field: { value, onChange } }) => (
              <OptionGrid
                label="Property Type"
                required
                options={["House", "Condo", "Apartment", "Commercial"]}
                selected={value}
                onSelect={(val) => {
                  onChange(val);
                  dispatch(updateProjectBasics({ propertyType: val as any }));
                }}
                numColumns={2}
              />
            )}
          />
          {errors.propertyType && (
            <Text className="text-red-500 text-xs mb-2">
              {errors.propertyType.message}
            </Text>
          )}

          <Controller
            control={control}
            name="ownershipStatus"
            render={({ field: { value, onChange } }) => (
              <OptionGrid
                label="Ownership Status"
                required
                options={["Owner", "Tenant", "Property Manager", "Other"]}
                selected={value}
                onSelect={(val) => {
                  onChange(val);
                  dispatch(
                    updateProjectBasics({ ownershipStatus: val as any }),
                  );
                }}
                numColumns={1}
              />
            )}
          />
          {errors.ownershipStatus && (
            <Text className="text-red-500 text-xs mb-2">
              {errors.ownershipStatus.message}
            </Text>
          )}

          {watchedOwnershipStatus === "Other" && (
            <Controller
              control={control}
              name="ownershipStatusOther"
              render={({ field: { value, onChange } }) => (
                <TextAreaInput
                  label="Please specify"
                  placeholder="Describe your ownership status"
                  value={value ?? ""}
                  onChangeText={(text) => {
                    onChange(text);
                    dispatch(
                      updateProjectBasics({ ownershipStatusOther: text }),
                    );
                  }}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="timeline"
            render={({ field: { value, onChange } }) => (
              <TimelineOption
                selected={value}
                onSelect={(val) => {
                  onChange(val);
                  dispatch(updateProjectBasics({ timeline: val as any }));
                }}
              />
            )}
          />
          {errors.timeline && (
            <Text className="text-red-500 text-xs mb-2">
              {errors.timeline.message}
            </Text>
          )}

          <InfoBanner message="The more accurate your details, the faster we can respond with a quote." />

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
