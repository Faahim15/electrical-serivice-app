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
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  selectCategory,
  toggleServiceCallTag,
  updateContactDetails,
  updateProjectBasics,
  updateServiceAddress,
  updateServiceCallDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { ServiceCallResponse } from "@/src/types/quotes.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { createSelector } from "@reduxjs/toolkit";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  const hasLoadedDraft = useRef(false);
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
      console.log("Initializing category to 1");
      dispatch(selectCategory("1"));
    }
  }, []);

  // Load draft data into local state and Redux
  useEffect(() => {
    if (!draft || hasLoadedDraft.current) return;

    console.log("Loading draft data into Redux:", draft);

    // Update contact details
    if (draft.fullName) {
      dispatch(updateContactDetails({ fullName: draft.fullName }));
    }
    if (draft.emailAddress) {
      dispatch(updateContactDetails({ email: draft.emailAddress }));
    }
    if (draft.phoneNumber) {
      dispatch(updateContactDetails({ phone: draft.phoneNumber }));
    }
    if (draft.preferredContactMethod) {
      dispatch(
        updateContactDetails({
          preferredContact: draft.preferredContactMethod as
            | "Call"
            | "Text"
            | "Email",
        }),
      );
    }

    // Update service address
    if (draft.streetAddress) {
      dispatch(updateServiceAddress({ streetAddress: draft.streetAddress }));
    }
    if (draft.apartmentUnit !== undefined) {
      dispatch(updateServiceAddress({ apartment: draft.apartmentUnit }));
    }
    if (draft.city) {
      dispatch(updateServiceAddress({ city: draft.city }));
    }
    if (draft.state) {
      dispatch(updateServiceAddress({ state: draft.state }));
    }
    if (draft.zipCode) {
      dispatch(updateServiceAddress({ zipCode: draft.zipCode }));
    }

    // Update project basics
    if (draft.propertyType) {
      dispatch(
        updateProjectBasics({ propertyType: draft.propertyType as any }),
      );
    }
    if (draft.ownershipStatus) {
      dispatch(
        updateProjectBasics({ ownershipStatus: draft.ownershipStatus as any }),
      );
    }
    if (draft.timelineUrgency) {
      dispatch(updateProjectBasics({ timeline: draft.timelineUrgency as any }));
    }

    // Update service call details - NOTES
    if (draft.notes) {
      console.log("Setting additional notes from draft:", draft.notes);
      setLocalNotes(draft.notes);
      dispatch(updateServiceCallDetails({ additionalNotes: draft.notes }));
    }

    if (draft.issueDescription) {
      dispatch(
        updateServiceCallDetails({ projectDetails: draft.issueDescription }),
      );
    }

    if (draft.preferredTime) {
      const validPreferredTime =
        draft.preferredTime === "AM (8-11)" ||
        draft.preferredTime === "PM (12-2)"
          ? (draft.preferredTime as "AM (8-11)" | "PM (12-2)")
          : "";
      if (validPreferredTime) {
        dispatch(
          updateServiceCallDetails({ preferredTime: validPreferredTime }),
        );
      }
    }

    if (draft.schedulingPreference && draft.schedulingPreference.length > 0) {
      dispatch(
        updateServiceCallDetails({
          schedulingDays: draft.schedulingPreference,
        }),
      );
    }

    if (draft.panelPhotos && draft.panelPhotos.length > 0) {
      dispatch(updateServiceCallDetails({ panelPhotos: draft.panelPhotos }));
    }

    if (draft.workAreaPhotos && draft.workAreaPhotos.length > 0) {
      dispatch(
        updateServiceCallDetails({ workAreaPhotos: draft.workAreaPhotos }),
      );
    }

    if (draft.extraReferencePhotos && draft.extraReferencePhotos.length > 0) {
      dispatch(
        updateServiceCallDetails({
          referencePhotos: draft.extraReferencePhotos,
        }),
      );
    }

    // Update QUICK TAGS
    if (draft.quickTags && draft.quickTags.length > 0) {
      console.log("Setting quick tags from draft:", draft.quickTags);
      setLocalQuickTags(draft.quickTags);
      const currentTags = [...reduxQuickTags];
      if (currentTags.length > 0) {
        currentTags.forEach((tag: string) => {
          dispatch(toggleServiceCallTag(tag));
        });
      }
      draft.quickTags.forEach((tag) => {
        console.log("Adding tag to Redux:", tag);
        dispatch(toggleServiceCallTag(tag));
      });
    }

    hasLoadedDraft.current = true;

    setTimeout(() => {
      console.log("After load - reduxAdditionalNotes:", reduxAdditionalNotes);
      console.log("After load - reduxQuickTags:", reduxQuickTags);
      console.log("After load - localNotes:", localNotes);
      console.log("After load - localQuickTags:", localQuickTags);
    }, 100);
  }, [draft, dispatch]);

  // Use either Redux or local state
  const displayNotes = localNotes || reduxAdditionalNotes;
  const displayQuickTags =
    localQuickTags.length > 0 ? localQuickTags : reduxQuickTags;

  // ─── Helper to convert payload to FormData ──────────────────────────────────
  const createFormData = (payload: Record<string, any>) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    return formData;
  };

  const handleSaveForLater = async () => {
    const payload = {
      serviceType,
      fullName: draft?.fullName || "",
      emailAddress: draft?.emailAddress || "",
      phoneNumber: draft?.phoneNumber || "",
      preferredContactMethod: draft?.preferredContactMethod || "Call",
      streetAddress: draft?.streetAddress || "",
      apartmentUnit: draft?.apartmentUnit || "",
      city: draft?.city || "",
      state: draft?.state || "",
      zipCode: draft?.zipCode || "",
      propertyType: draft?.propertyType || "",
      ownershipStatus: draft?.ownershipStatus || "",
      timelineUrgency: draft?.timelineUrgency || "",
      issueDescription: draft?.issueDescription || "",
      preferredTime: draft?.preferredTime || "",
      schedulingPreference: draft?.schedulingPreference || [],
      panelPhotos: draft?.panelPhotos || [],
      workAreaPhotos: draft?.workAreaPhotos || [],
      extraReferencePhotos: draft?.extraReferencePhotos || [],
      notes: displayNotes || "",
      quickTags: displayQuickTags || [],
      status: "draft" as const,
      completionPercentage: Math.round((CURRENT_STEP / TOTAL_STEPS) * 100),
    };

    console.log("Saving payload:", payload);
    console.log("Saving notes:", displayNotes);
    console.log("Saving quickTags:", displayQuickTags);

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
    if (localQuickTags.includes(tag)) {
      setLocalQuickTags(localQuickTags.filter((t) => t !== tag));
    } else {
      setLocalQuickTags([...localQuickTags, tag]);
    }
    dispatch(toggleServiceCallTag(tag));
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
