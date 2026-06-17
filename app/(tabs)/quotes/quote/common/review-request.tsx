import {
  EVChargerReviewForm,
  ReviewSection,
  ServiceCallReviewForm,
} from "@/src/components/common";
import PanelUpgradeReviewForm from "@/src/components/common/PanelUpgradeReviewForm";
import SavedEditAction from "@/src/components/common/SavedButton";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { SERVICE_CATEGORIES } from "@/src/constants/tabs.home.constant";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { clearServiceForm } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
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

  // ─── Get draft data from API ──────────────────────────────────────────────────
  const { data: draftData, isLoading: isLoadingDraft } = useDraftDetails(
    serviceCallId,
    serviceType,
  );

  // ─── Use values from API (draft) or fallback to Redux ────────────────────────
  const finalValues = {
    fullName: draftData?.fullName || contactDetails.fullName,
    email: draftData?.emailAddress || contactDetails.email,
    phone: draftData?.phoneNumber || contactDetails.phone,
    preferredContact:
      draftData?.preferredContactMethod || contactDetails.preferredContact,
    streetAddress: draftData?.streetAddress || serviceAddress.streetAddress,
    apartment: draftData?.apartmentUnit || serviceAddress.apartment,
    city: draftData?.city || serviceAddress.city,
    state: draftData?.state || serviceAddress.state,
    zipCode: draftData?.zipCode || serviceAddress.zipCode,
    propertyType: draftData?.propertyType || projectBasics.propertyType,
    ownershipStatus:
      draftData?.ownershipStatus || projectBasics.ownershipStatus,
    timeline: draftData?.timelineUrgency || projectBasics.timeline,
  };

  const handleSubmitSuccess = () => {
    dispatch(clearServiceForm());
    toast.success("Service request submitted successfully!");
    router.push("/(tabs)/home");
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

          {/* ─── Common Review Section ────────────────────────────────────────── */}
          <ReviewSection
            contactDetails={finalValues}
            serviceAddress={finalValues}
            projectBasics={finalValues}
          />

          {/* ─── Category Specific Review ─────────────────────────────────────── */}

          {/* Service Call */}
          {categoryData?.categoryId === "1" && categoryData.details && (
            <ServiceCallReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
            />
          )}

          {/* EV Charger Installation */}
          {categoryData?.categoryId === "2" && categoryData.details && (
            <EVChargerReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Panel Upgrade / Replacement */}
          {categoryData?.categoryId === "3" && categoryData.details && (
            <PanelUpgradeReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
            />
          )}

          {/* TODO: Add review forms for remaining categories:
            categoryId === "4"  → Remodeling
            categoryId === "5"  → Accessory Building / Shed Power
            categoryId === "6"  → Hot Tub Installation
            categoryId === "7"  → Dock Power
            categoryId === "8"  → Electrical Inspection
            categoryId === "9"  → Generator Installation
            categoryId === "10" → New Construction
          */}

          <SavedEditAction title="Edit" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
