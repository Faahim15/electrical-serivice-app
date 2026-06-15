import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { AccessoryBuildingReview } from "@/src/components/quote/review/AccessoryBuildingReview";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import { DockPowerReview } from "@/src/components/quote/review/DockPowerReview";
import { ElectricalInspectionReview } from "@/src/components/quote/review/ElectricalInspectionReview";
import { EVChargerReview } from "@/src/components/quote/review/EVChargerRow";
import { GeneratorReview } from "@/src/components/quote/review/GeneratorReview";
import { HotTubReview } from "@/src/components/quote/review/HotTubReview";
import { NewConstructionReview } from "@/src/components/quote/review/NewConstructionReview";
import { PanelUpgradeReview } from "@/src/components/quote/review/PanelUpgradeReview";
import { RemodelingReview } from "@/src/components/quote/review/RemodelingReview";
import { ReviewRow } from "@/src/components/quote/review/ReviewRow";
import { ReviewSectionTitle } from "@/src/components/quote/review/ReviewSectionTitle";
import { ServiceCallReview } from "@/src/components/quote/review/ServiceCallReview";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { SERVICE_CATEGORIES } from "@/src/constants/tabs.home.constant";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useCreateServiceCallMutation } from "@/src/redux/api-slices/quote/quote-api";
import { clearServiceForm } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  CreateServiceCallPayload,
  ServiceCallResponse,
} from "@/src/types/quotes.api.types";
import { CATEGORY_TOTAL_STEPS } from "@/src/utils/CategorySteps";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

export default function ReviewRequest() {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createServiceCall] = useCreateServiceCallMutation();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  // ─── Redux state ──────────────────────────────────────────────────────────────
  const selectedCategoryId = useSelector(
    (state: RootState) => state.serviceForm.selectedCategoryId,
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

  const selectedCategory = SERVICE_CATEGORIES.find(
    (c) => c.id === selectedCategoryId,
  );

  const serviceType =
    serviceTypeParam || selectedCategory?.title || "Service Call";
  const totalSteps = CATEGORY_TOTAL_STEPS[selectedCategory?.id ?? ""] ?? 8;

  // ─── Get draft data from API (if editing an existing draft) ───────────────────
  const { data: draftData, isLoading: isLoadingDraft } = useDraftDetails(
    serviceCallId,
    serviceType,
  );
  const draft = draftData as ServiceCallResponse | undefined;

  // ─── Use values from API (draft) or fallback to Redux ─────────────────────────
  const finalFullName = draft?.fullName || contactDetails.fullName;
  const finalEmail = draft?.emailAddress || contactDetails.email;
  const finalPhone = draft?.phoneNumber || contactDetails.phone;
  const finalPreferredContact =
    draft?.preferredContactMethod || contactDetails.preferredContact;
  const finalStreetAddress =
    draft?.streetAddress || serviceAddress.streetAddress;
  const finalApartment = draft?.apartmentUnit || serviceAddress.apartment;
  const finalCity = draft?.city || serviceAddress.city;
  const finalState = draft?.state || serviceAddress.state;
  const finalZipCode = draft?.zipCode || serviceAddress.zipCode;
  const finalPropertyType = draft?.propertyType || projectBasics.propertyType;
  const finalOwnershipStatus =
    draft?.ownershipStatus || projectBasics.ownershipStatus;
  const finalTimeline = draft?.timelineUrgency || projectBasics.timeline;

  // Category-specific values for Service Call (categoryId: "1")
  const getFinalServiceCallDetails = () => {
    if (categoryData?.categoryId === "1" && categoryData.details) {
      const details = categoryData.details as any;
      return {
        issueDescription:
          draft?.issueDescription || details.projectDetails || "",
        preferredTime: draft?.preferredTime || details.preferredTime || "",
        schedulingPreference: draft?.schedulingPreference?.length
          ? draft.schedulingPreference
          : details.schedulingDays || [],
        panelPhotos: draft?.panelPhotos?.length
          ? draft.panelPhotos
          : details.panelPhotos || [],
        workAreaPhotos: draft?.workAreaPhotos?.length
          ? draft.workAreaPhotos
          : details.workAreaPhotos || [],
        extraReferencePhotos: draft?.extraReferencePhotos?.length
          ? draft.extraReferencePhotos
          : details.referencePhotos || [],
        notes: draft?.notes || details.additionalNotes || "",
        quickTags: draft?.quickTags?.length
          ? draft.quickTags
          : details.quickTags || [],
      };
    }
    return {
      issueDescription: "",
      preferredTime: "",
      schedulingPreference: [],
      panelPhotos: [],
      workAreaPhotos: [],
      extraReferencePhotos: [],
      notes: "",
      quickTags: [],
    };
  };

  const serviceCallDetails = getFinalServiceCallDetails();

  const handleSubmit = async () => {
    // Validate required fields
    if (!finalFullName) {
      toast.error("Please enter your full name");
      return;
    }
    if (!finalEmail) {
      toast.error("Please enter your email address");
      return;
    }
    if (!finalPhone) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!finalStreetAddress) {
      toast.error("Please enter your street address");
      return;
    }
    if (!finalCity) {
      toast.error("Please enter your city");
      return;
    }
    if (!finalState) {
      toast.error("Please enter your state");
      return;
    }
    if (!finalZipCode) {
      toast.error("Please enter your zip code");
      return;
    }
    if (!finalPropertyType) {
      toast.error("Please select property type");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build payload based on category
      let payload: CreateServiceCallPayload = {
        serviceType: serviceType,
        fullName: finalFullName,
        phoneNumber: finalPhone,
        emailAddress: finalEmail,
        preferredContactMethod: finalPreferredContact,
        streetAddress: finalStreetAddress,
        apartmentUnit: finalApartment,
        city: finalCity,
        state: finalState,
        zipCode: finalZipCode,
        propertyType: finalPropertyType,
        ownershipStatus: finalOwnershipStatus,
        timelineUrgency: finalTimeline,
        status: "submitted",
        completionPercentage: 100,
      };

      // Add category-specific fields for Service Call
      if (categoryData?.categoryId === "1") {
        payload = {
          ...payload,
          issueDescription: serviceCallDetails.issueDescription,
          preferredTime: serviceCallDetails.preferredTime,
          schedulingPreference: serviceCallDetails.schedulingPreference,
          panelPhotos: serviceCallDetails.panelPhotos,
          workAreaPhotos: serviceCallDetails.workAreaPhotos,
          extraReferencePhotos: serviceCallDetails.extraReferencePhotos,
          notes: serviceCallDetails.notes,
          quickTags: serviceCallDetails.quickTags,
        };
      }

      console.log("Submitting payload:", payload);

      const result = await createServiceCall(payload).unwrap();

      console.log("Submit result:", result);

      if (result.success) {
        // Clear all Redux state after successful submission
        dispatch(clearServiceForm());

        toast.success("Service request submitted successfully!");
        router.push("/(tabs)/home");
      } else {
        toast.error(result.message || "Failed to submit request");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(
        error?.data?.message || "Failed to submit request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingDraft && serviceCallId) {
    return (
      <ScreenWrapper paddingHorizontal={20}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text className="text-[#64748B] mt-4">Loading your request...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <BackButton />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(120) }}
        >
          <StepProgressBar currentStep={totalSteps} totalSteps={totalSteps} />

          {selectedCategory && <CategoryTag title={selectedCategory.title} />}

          <Text className="text-[#1E293B] text-[22px] font-Inter_Bold mb-1">
            Review your request
          </Text>
          <Text className="text-[#64748B] text-[13.5px] font-Inter_Regular mb-5">
            Check your answers before sending
          </Text>

          {/* Contact Details */}
          <ReviewSectionTitle title="Contact Details" />
          <ReviewRow label="Full Name" value={finalFullName} />
          <ReviewRow label="Email Address" value={finalEmail} />
          <ReviewRow label="Phone Number" value={finalPhone} />
          <ReviewRow label="Preferred Contact" value={finalPreferredContact} />

          {/* Service Address */}
          <ReviewSectionTitle title="Service Address" />
          <ReviewRow label="Street Address" value={finalStreetAddress} />
          <ReviewRow label="Apartment / Unit" value={finalApartment} />
          <ReviewRow label="City" value={finalCity} />
          <ReviewRow label="State" value={finalState} />
          <ReviewRow label="Zip Code" value={finalZipCode} />

          {/* Project Basics */}
          <ReviewSectionTitle title="Project Basics" />
          <ReviewRow label="Property Type" value={finalPropertyType} />
          <ReviewRow label="Ownership Status" value={finalOwnershipStatus} />
          <ReviewRow label="Timeline / Urgency" value={finalTimeline} />

          {/* Category Specific - Service Call */}
          {categoryData?.categoryId === "1" && (
            <ServiceCallReview
              details={{
                projectDetails: serviceCallDetails.issueDescription,
                preferredTime: serviceCallDetails.preferredTime,
                schedulingDays: serviceCallDetails.schedulingPreference,
                additionalNotes: serviceCallDetails.notes,
                quickTags: serviceCallDetails.quickTags,
                panelPhotos: serviceCallDetails.panelPhotos,
                workAreaPhotos: serviceCallDetails.workAreaPhotos,
                referencePhotos: serviceCallDetails.extraReferencePhotos,
              }}
            />
          )}

          {/* Add other category reviews here as needed */}
          {categoryData?.categoryId === "2" && categoryData.details && (
            <EVChargerReview details={categoryData.details} />
          )}
          {categoryData?.categoryId === "3" && categoryData.details && (
            <PanelUpgradeReview details={categoryData.details} />
          )}
          {categoryData?.categoryId === "4" && categoryData.details && (
            <RemodelingReview details={categoryData.details} />
          )}
          {categoryData?.categoryId === "5" && categoryData.details && (
            <AccessoryBuildingReview details={categoryData.details} />
          )}
          {categoryData?.categoryId === "6" && categoryData.details && (
            <HotTubReview details={categoryData.details} />
          )}
          {categoryData?.categoryId === "7" && categoryData.details && (
            <DockPowerReview details={categoryData.details} />
          )}
          {categoryData?.categoryId === "8" && categoryData.details && (
            <ElectricalInspectionReview details={categoryData.details} />
          )}
          {categoryData?.categoryId === "9" && categoryData.details && (
            <GeneratorReview details={categoryData.details} />
          )}
          {categoryData?.categoryId === "10" && categoryData.details && (
            <NewConstructionReview details={categoryData.details} />
          )}

          <GradientButton
            label={isSubmitting ? "Submitting..." : "Submit"}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />

          <SavedEditAction title="Edit" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
