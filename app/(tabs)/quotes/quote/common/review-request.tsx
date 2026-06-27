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
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
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

export default function ReviewRequest() {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  // ─── Redux state ───────────────────────────────────────────────────────
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

  // ─── Draft data from API ───────────────────────────────────────────────
  const { data: draftData, isLoading: isLoadingDraft } = useDraftDetails(
    serviceCallId,
    serviceType,
  );
  const ownershipStatusRaw =
    draftData?.ownershipStatus || projectBasics.ownershipStatus;
  const ownershipStatusOther = projectBasics.ownershipStatusOther;
  // ─── draftData or Redux fallback ───────────────────────────────────────
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
      ownershipStatusRaw === "Other" && ownershipStatusOther
        ? ownershipStatusOther // "Other" হলে actual text দেখাও
        : ownershipStatusRaw,
    timeline: draftData?.timelineUrgency || projectBasics.timeline,
  };

  // ─── onSuccess — কোনো API call নেই, শুধু navigate ─────────────────────
  const handleSubmitSuccess = () => {
    router.push({
      pathname: "/(tabs)/quotes/quote/common/submit-quote",
      params: {
        serviceCallId: serviceCallId,
        serviceType: serviceType,
      },
    });
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

  // ─── Common props for all ReviewForms ──────────────────────────────────
  const reviewFormProps = {
    draftData,
    categoryData,
    onSuccess: handleSubmitSuccess,
    setIsSubmitting,
    isSubmitting,
    serviceCallId,
    serviceType,
  };

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

          {/* ─── Common Review Section ─────────────────────────────────── */}
          <ReviewSection
            contactDetails={finalValues}
            serviceAddress={finalValues}
            projectBasics={finalValues}
          />

          {/* ─── Category Specific Review ──────────────────────────────── */}

          {/* 1 - Service Call */}
          {categoryData?.categoryId === "1" && categoryData.details && (
            <ServiceCallReviewForm {...reviewFormProps} />
          )}

          {/* 2 - EV Charger */}
          {categoryData?.categoryId === "2" && categoryData.details && (
            <EVChargerReviewForm {...reviewFormProps} />
          )}

          {/* 3 - Panel Upgrade */}
          {categoryData?.categoryId === "3" && categoryData.details && (
            <PanelUpgradeReviewForm {...reviewFormProps} />
          )}

          {/* 4 - Remodeling */}
          {categoryData?.categoryId === "4" && categoryData.details && (
            <RemodelingReviewForm {...reviewFormProps} />
          )}

          {/* 5 - Accessory Building */}
          {categoryData?.categoryId === "5" && categoryData.details && (
            <AccessoryBuildingReviewForm {...reviewFormProps} />
          )}

          {/* 6 - Hot Tub */}
          {categoryData?.categoryId === "6" && categoryData.details && (
            <HotTubReviewForm {...reviewFormProps} />
          )}

          {/* 7 - Dock Power */}
          {categoryData?.categoryId === "7" && categoryData.details && (
            <DockPowerReviewForm {...reviewFormProps} />
          )}

          {/* 8 - Electrical Inspection */}
          {categoryData?.categoryId === "8" && categoryData.details && (
            <ElectricalInspectionReviewForm {...reviewFormProps} />
          )}

          {/* 9 - Generator */}
          {categoryData?.categoryId === "9" && categoryData.details && (
            <GeneratorReviewForm {...reviewFormProps} />
          )}

          {/* 10 - New Construction */}
          {categoryData?.categoryId === "10" && categoryData.details && (
            <NewConstructionReviewForm {...reviewFormProps} />
          )}

          {/* 11 - Surge Protection */}
          {categoryData?.categoryId === "11" && categoryData.details && (
            <SurgeProtectionReviewForm {...reviewFormProps} />
          )}

          {/* 12 - Starlink */}
          {categoryData?.categoryId === "12" && categoryData.details && (
            <StarlinkReviewForm {...reviewFormProps} />
          )}

          {/* 13 - Dedicated Circuit */}
          {categoryData?.categoryId === "13" && categoryData.details && (
            <DedicatedCircuitReviewForm {...reviewFormProps} />
          )}

          {/* 14 - Exhaust Fan */}
          {categoryData?.categoryId === "14" && categoryData.details && (
            <ExhaustFanReviewForm {...reviewFormProps} />
          )}

          {/* 15 - Outlets */}
          {categoryData?.categoryId === "15" && categoryData.details && (
            <OutletsReviewForm {...reviewFormProps} />
          )}

          {/* 16 - Switches */}
          {categoryData?.categoryId === "16" && categoryData.details && (
            <SwitchesReviewForm {...reviewFormProps} />
          )}

          {/* 17 - Lighting */}
          {categoryData?.categoryId === "17" && categoryData.details && (
            <LightingReviewForm {...reviewFormProps} />
          )}

          {/* 18 - Ceiling Fan */}
          {categoryData?.categoryId === "18" && categoryData.details && (
            <CeilingFanReviewForm {...reviewFormProps} />
          )}

          {/* ─── Edit Button ───────────────────────────────────────────── */}
          <SavedEditAction title="Edit" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
