import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import TextAreaInput from "@/src/components/shared/TextAreaInput";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import { updateServiceCallDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { ServiceCallResponse } from "@/src/types/quotes.api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";
import { z } from "zod";

// ─── Schema ──────────────────────────────────────────────────────────────────
const projectDetailsSchema = z.object({
  projectDetails: z.string().trim().min(1, "Please explain the issue"),
});

type ProjectDetailsFormValues = z.infer<typeof projectDetailsSchema>;

const CURRENT_STEP = 4;
const SERVICE_TYPE = "Service Call";

export default function ProjectDetails() {
  const dispatch = useDispatch();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || SERVICE_TYPE;

  // ─── Redux selectors ──────────────────────────────────────────────────────
  const projectDetails = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "1") {
      return data?.details?.projectDetails;
    }
    return "";
  });

  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const { propertyType, ownershipStatus, timeline } = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  const totalSteps = 8;
  const completionPercentage = Math.round((CURRENT_STEP / totalSteps) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);

  // ─── Cast to ServiceCallResponse ─────────────────────────────────────────
  const draft = draftData as ServiceCallResponse | undefined;

  // ─── RHF Setup ───────────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProjectDetailsFormValues>({
    resolver: zodResolver(projectDetailsSchema),
    mode: "onChange",
    defaultValues: {
      projectDetails: projectDetails || "",
    },
  });

  // ─── Prefill from API draft ───────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;

    const value = draft.issueDescription || projectDetails || "";
    setValue("projectDetails", value, { shouldValidate: true });
    dispatch(updateServiceCallDetails({ projectDetails: value }));
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
      issueDescription: values.projectDetails || "",
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
      toast.error("Failed to save draft. Please try again.");
    }
  };

  // ─── Continue ─────────────────────────────────────────────────────────────
  const onSubmit = (values: ProjectDetailsFormValues) => {
    dispatch(
      updateServiceCallDetails({ projectDetails: values.projectDetails }),
    );
    router.push({
      pathname: "/(tabs)/quotes/quote/service-call/final-projectQ",
      params: { serviceType, serviceCallId },
    });
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
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <StepProgressBar currentStep={CURRENT_STEP} totalSteps={totalSteps} />

          <CategoryTag title={serviceType} />

          <AuthHeading title="Project details" />

          <Controller
            control={control}
            name="projectDetails"
            render={({ field: { value, onChange } }) => (
              <TextAreaInput
                label="Explain the issue you are having"
                placeholder="Explain the issue details, concerns, or special requirements..."
                value={value}
                error={errors.projectDetails?.message}
                onChangeText={(text) => {
                  onChange(text);
                  dispatch(updateServiceCallDetails({ projectDetails: text }));
                }}
              />
            )}
          />

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
