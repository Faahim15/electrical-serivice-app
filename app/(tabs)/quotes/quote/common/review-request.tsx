import {
  EVChargerReviewForm,
  ReviewSection,
  ServiceCallReviewForm,
} from "@/src/components/common";
import AccessoryBuildingReviewForm from "@/src/components/common/AccessoryBuildingReviewForm";
import CeilingFanReviewForm from "@/src/components/common/CeilingFanReviewForm";
import DedicatedCircuitReviewForm from "@/src/components/common/DedicatedCircuitReviewForm";
import DockPowerReviewForm from "@/src/components/common/DockPowerReviewForm";
import ElectricalInspectionReviewForm from "@/src/components/common/ElectricalInspectionReviewForm";
import ExhaustFanReviewForm from "@/src/components/common/ExhaustedFanReviewForm";
import GeneratorReviewForm from "@/src/components/common/GeneratorReviewForm";
import HotTubReviewForm from "@/src/components/common/HotTubReviewForm";
import LightingReviewForm from "@/src/components/common/LightingReviewForm";
import NewConstructionReviewForm from "@/src/components/common/NewConstructionReviewForm";
import OutletsReviewForm from "@/src/components/common/OutletsReviewForm";
import PanelUpgradeReviewForm from "@/src/components/common/PanelUpgradeReviewForm";
import RemodelingReviewForm from "@/src/components/common/RemodelingReviewForm";
import SavedEditAction from "@/src/components/common/SavedButton";
import StarlinkReviewForm from "@/src/components/common/StarLinkReviewForm";
import SurgeProtectionReviewForm from "@/src/components/common/SurgeProtectionReviewForm";
import SwitchesReviewForm from "@/src/components/common/SwitchesReivewForm";
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

          {/* Service Call - ID 1 */}
          {categoryData?.categoryId === "1" && categoryData.details && (
            <ServiceCallReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* EV Charger - ID 2 */}
          {categoryData?.categoryId === "2" && categoryData.details && (
            <EVChargerReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Panel Upgrade - ID 3 */}
          {categoryData?.categoryId === "3" && categoryData.details && (
            <PanelUpgradeReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Remodeling - ID 4 */}
          {categoryData?.categoryId === "4" && categoryData.details && (
            <RemodelingReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Accessory Building - ID 5 */}
          {categoryData?.categoryId === "5" && categoryData.details && (
            <AccessoryBuildingReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Hot Tub - ID 6 */}
          {categoryData?.categoryId === "6" && categoryData.details && (
            <HotTubReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Dock Power - ID 7 */}
          {categoryData?.categoryId === "7" && categoryData.details && (
            <DockPowerReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Electrical Inspection - ID 8 */}
          {categoryData?.categoryId === "8" && categoryData.details && (
            <ElectricalInspectionReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Generator - ID 9 */}
          {categoryData?.categoryId === "9" && categoryData.details && (
            <GeneratorReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* New Construction - ID 10 */}
          {categoryData?.categoryId === "10" && categoryData.details && (
            <NewConstructionReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Whole Home Surge Protection - ID 11 */}
          {categoryData?.categoryId === "11" && categoryData.details && (
            <SurgeProtectionReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Starlink Installation - ID 12 */}
          {categoryData?.categoryId === "12" && categoryData.details && (
            <StarlinkReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Dedicated Circuit - ID 13 */}
          {categoryData?.categoryId === "13" && categoryData.details && (
            <DedicatedCircuitReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Exhaust Fan - ID 14 */}
          {categoryData?.categoryId === "14" && categoryData.details && (
            <ExhaustFanReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Outlets - ID 15 */}
          {categoryData?.categoryId === "15" && categoryData.details && (
            <OutletsReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Switches - ID 16 */}
          {categoryData?.categoryId === "16" && categoryData.details && (
            <SwitchesReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Lighting - ID 17 */}
          {categoryData?.categoryId === "17" && categoryData.details && (
            <LightingReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* Ceiling Fan - ID 18 */}
          {categoryData?.categoryId === "18" && categoryData.details && (
            <CeilingFanReviewForm
              draftData={draftData}
              categoryData={categoryData}
              onSuccess={handleSubmitSuccess}
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
              serviceCallId={serviceCallId}
              serviceType={serviceType}
            />
          )}

          {/* ─── Edit Button ──────────────────────────────────────────────────── */}
          <SavedEditAction title="Edit" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
