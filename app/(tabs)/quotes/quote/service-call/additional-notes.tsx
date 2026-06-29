import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import InfoBanner from "@/src/components/quote/InfoBanner";
import QuickTags from "@/src/components/quote/QuickTags";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import TextAreaInput from "@/src/components/shared/TextAreaInput";
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
import { useDraftSave } from "@/src/hooks/useDraftSave";
import {
  selectCategory,
  updateServiceCallDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { ServiceCallResponse } from "@/src/types/quotes.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { createSelector } from "@reduxjs/toolkit";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 7;
const TOTAL_STEPS = 8;

const QUICK_TAGS = [
  "Limited access",
  "Existing damage",
  "Urgent issue",
  "Need estimate first",
];

// ─── Selectors ─────────────────────────────────────────────────────────────
const selectCategoryData_ = (state: RootState) =>
  state.serviceForm.categoryData;
const selectContactDetails_ = (state: RootState) =>
  state.serviceForm.contactDetails;
const selectServiceAddress_ = (state: RootState) =>
  state.serviceForm.serviceAddress;
const selectProjectBasics_ = (state: RootState) =>
  state.serviceForm.projectBasics;

const selectAdditionalNotes = createSelector([selectCategoryData_], (data) => {
  if (
    data?.categoryId === "1" &&
    data?.details &&
    "additionalNotes" in data.details
  ) {
    return data.details.additionalNotes || "";
  }
  return "";
});

const selectQuickTags = createSelector([selectCategoryData_], (data) => {
  if (
    data?.categoryId === "1" &&
    data?.details &&
    "quickTags" in data.details
  ) {
    return data.details.quickTags || [];
  }
  return [] as string[];
});

export default function AdditionalNotes() {
  const dispatch = useDispatch();
  const [localNotes, setLocalNotes] = useState("");
  const [localQuickTags, setLocalQuickTags] = useState<string[]>([]);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  // ─── Redux selectors ──────────────────────────────────────────────────────
  const reduxAdditionalNotes = useSelector(selectAdditionalNotes);
  const reduxQuickTags = useSelector(selectQuickTags);
  const categoryData = useSelector(selectCategoryData_);

  // ─── All Redux state for fallbacks ────────────────────────────────────────
  const { fullName, email, phone, preferredContact } = useSelector(
    selectContactDetails_,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    selectServiceAddress_,
  );
  const { propertyType, ownershipStatus, timeline } =
    useSelector(selectProjectBasics_);

  // ─── Service call specific Redux state ────────────────────────────────────
  const issueDescription = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "1") return data?.details?.projectDetails;
    return "";
  });
  const preferredTime = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "1") return data?.details?.preferredTime;
    return "";
  });
  const schedulingDays = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "1") return data?.details?.schedulingDays;
    return [];
  });
  const panelPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "1") return data?.details?.panelPhotos;
    return [];
  });
  const workAreaPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "1") return data?.details?.workAreaPhotos;
    return [];
  });
  const referencePhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "1") return data?.details?.referencePhotos;
    return [];
  });

  const selectedCategory = useSelector(
    (state: RootState) => state.categoryRoute.selectedCategory,
  );

  const serviceType =
    serviceTypeParam || selectedCategory?.title || "Service Call";

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const isLoading = isSaving;

  // ─── Prefill data from existing draft ──────────────────────────────────
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as ServiceCallResponse | undefined;

  // Initialize category if not exists
  useEffect(() => {
    if (!categoryData || categoryData.categoryId !== "1") {
      dispatch(selectCategory("1"));
    }
  }, []);

  // Load draft data
  useEffect(() => {
    if (!draft) return;

    // ─── Load additional notes ──────────────────────────────────────────────
    if (draft.notes) {
      setLocalNotes(draft.notes);
      dispatch(updateServiceCallDetails({ additionalNotes: draft.notes }));
    }

    // ─── Load quick tags ────────────────────────────────────────────────────
    if (draft.quickTags && draft.quickTags.length > 0) {
      setLocalQuickTags(draft.quickTags);
      dispatch(updateServiceCallDetails({ quickTags: draft.quickTags }));
    }
  }, [draft]);

  // ─── Helper to convert payload to FormData ──────────────────────────────────
  const createFormData = (payload: Record<string, any>) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    return formData;
  };

  const handleSaveForLater = async () => {
    // ✅ draft first, then Redux as fallback for ALL fields
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
      issueDescription: draft?.issueDescription || issueDescription || "",
      preferredTime: draft?.preferredTime || preferredTime || "",
      schedulingPreference: draft?.schedulingPreference || schedulingDays || [],
      panelPhotos: draft?.panelPhotos || panelPhotos || [],
      workAreaPhotos: draft?.workAreaPhotos || workAreaPhotos || [],
      extraReferencePhotos:
        draft?.extraReferencePhotos || referencePhotos || [],
      notes: draft?.notes || reduxAdditionalNotes || "",
      quickTags: draft?.quickTags || reduxQuickTags || [],
      status: "draft" as const,
      completionPercentage: Math.round((CURRENT_STEP / TOTAL_STEPS) * 100),
    };

    try {
      if (serviceCallId) {
        await updateDraft(serviceCallId, serviceType, createFormData(payload));
      } else {
        await createDraft(serviceType, createFormData(payload));
      }

      toast.success("Draft saved successfully!");
      router.push("/(tabs)/home/saved-draft");
    } catch (error: any) {
      console.log({ error });
      toast.error("Failed to save draft. Please try again.");
    }
  };

  const handleContinue = () => {
    router.push("/(tabs)/quotes/quote/common/review-request");
  };

  const handleNotesChange = (text: string) => {
    setLocalNotes(text);
    dispatch(updateServiceCallDetails({ additionalNotes: text }));
  };

  const handleTagToggle = (tag: string) => {
    let updatedTags;
    if (localQuickTags.includes(tag)) {
      updatedTags = localQuickTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...localQuickTags, tag];
    }
    setLocalQuickTags(updatedTags);
    dispatch(updateServiceCallDetails({ quickTags: updatedTags }));
  };

  // Use Redux as single source of truth for display
  const displayNotes = reduxAdditionalNotes;
  const displayQuickTags = reduxQuickTags;

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BackButton
          onPress={() =>
            router.push({
              pathname: "/(tabs)/quotes/quote/service-call/upload-photos",
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
          contentContainerStyle={{ paddingBottom: verticalScale(120) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />

          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Additional notes"
            subtitle="Anything else we should know?"
          />

          <TextAreaInput
            label="Your notes (optional)"
            placeholder="Add any additional details, concerns, or special requirements..."
            value={displayNotes}
            onChangeText={handleNotesChange}
            minHeight={160}
          />

          <QuickTags
            tags={QUICK_TAGS}
            selected={displayQuickTags}
            onToggle={handleTagToggle}
          />

          <InfoBanner message="The more details you provide, the more accurate your quote will be." />

          <GradientButton
            label="Continue"
            onPress={handleContinue}
            disabled={isLoading}
          />

          <SavedEditAction
            onPress={handleSaveForLater}
            title={isLoading ? "Saving..." : "Save for Later"}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
