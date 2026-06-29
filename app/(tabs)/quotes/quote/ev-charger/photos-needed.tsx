import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import PhotoUploadSection from "@/src/components/quote/PhotoUploadSection";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
import { useDraftSave } from "@/src/hooks/useDraftSave";
import {
  useDeleteImageMutation,
  useUploadImagesMutation,
} from "@/src/redux/api-slices/quote/quote-api";
import {
  selectCategory,
  updateEVChargerDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { EvChargerInstallationResponse } from "@/src/types/evCharger.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 7;
const TOTAL_STEPS = 9;

const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

const isEvChargerDraft = (
  draft: any,
): draft is EvChargerInstallationResponse => {
  return (
    draft &&
    typeof draft === "object" &&
    draft.chargerConnectionType !== undefined
  );
};

export default function PhotosNeeded() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "area" | "panel" | null
  >(null);

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

  useEffect(() => {
    if (!categoryData || categoryData.categoryId !== "2") {
      dispatch(selectCategory("2"));
    }
  }, []);

  // ─── Get current values from Redux ───────────────────────────────────────────
  const chargerAreaPhotos: string[] =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.chargerAreaPhotos || []
      : [];
  const panelPhotos: string[] =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.panelPhotos || []
      : [];

  const reduxChargerType =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.chargerType || ""
      : "";
  const reduxNemaConfig =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.nemaConfig || ""
      : "";
  const reduxProvidingCharger =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.providingCharger || ""
      : "";
  const reduxChargerStatus =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.chargerStatus || ""
      : "";
  const reduxInstallationLocation =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.installationLocation || ""
      : "";
  const reduxPanelLocation =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.panelLocation || ""
      : "";
  const reduxPanelDistance =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.panelDistance || ""
      : "";
  const reduxAdditionalInfo =
    categoryData?.categoryId === "2"
      ? (categoryData.details as any)?.additionalInfo || ""
      : "";

  // ─── API hooks ────────────────────────────────────────────────────────────────
  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const isEvCharger = isEvChargerDraft(draftData);
  const [uploadImages] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

  // ─── Prefill from API draft ───────────────────────────────────────────────────
  useEffect(() => {
    if (!draftData) return;
    if (isEvCharger) {
      dispatch(
        updateEVChargerDetails({
          chargerAreaPhotos: draftData.areaPhoto ? [draftData.areaPhoto] : [],
        }),
      );
      dispatch(
        updateEVChargerDetails({
          panelPhotos:
            (draftData?.panelPhotos?.length as any) > 0
              ? draftData.panelPhotos
              : [],
        }),
      );
    }
  }, [draftData]);

  // ─── Upload helpers ───────────────────────────────────────────────────────────
  const uploadImage = async (localUri: string): Promise<string> => {
    const formData = new FormData();
    formData.append("images", {
      uri: localUri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);
    const res = await uploadImages(formData).unwrap();
    return res.data[0];
  };

  // ─── Area photo handlers ──────────────────────────────────────────────────────
  const handleAreaPhotosChange = (updated: string[]) => {
    dispatch(updateEVChargerDetails({ chargerAreaPhotos: updated }));
  };

  const handleAreaUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("area");
      const uploadedUrl = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      return uploadedUrl;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload photo.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  // ─── Panel photo handlers ─────────────────────────────────────────────────────
  const handlePanelPhotosChange = (updated: string[]) => {
    dispatch(updateEVChargerDetails({ panelPhotos: updated }));
  };

  const handlePanelUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("panel");
      const uploadedUrl = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      return uploadedUrl;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload photo.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  // ─── Delete handler ───────────────────────────────────────────────────────────
  const handleDeleteSingle = async (imageUrl: string) => {
    try {
      await deleteImage({ imageUrl }).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete photo.");
      throw error;
    }
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const payload = {
      fullName: draftData?.fullName || contactDetails.fullName || "",
      emailAddress: draftData?.emailAddress || contactDetails.email || "",
      phoneNumber: draftData?.phoneNumber || contactDetails.phone || "",
      preferredContactMethod:
        draftData?.preferredContactMethod ||
        contactDetails.preferredContact ||
        "Call",
      streetAddress:
        draftData?.streetAddress || serviceAddress.streetAddress || "",
      apartmentUnit: draftData?.apartmentUnit || serviceAddress.apartment || "",
      city: draftData?.city || serviceAddress.city || "",
      state: draftData?.state || serviceAddress.state || "",
      zipCode: draftData?.zipCode || serviceAddress.zipCode || "",
      propertyType: draftData?.propertyType || projectBasics.propertyType || "",
      ownershipStatus:
        draftData?.ownershipStatus || projectBasics.ownershipStatus || "",
      timelineUrgency:
        draftData?.timelineUrgency || projectBasics.timeline || "",
      chargerConnectionType:
        (isEvCharger && draftData.chargerConnectionType) ||
        reduxChargerType ||
        "",
      nemaConfiguration:
        (isEvCharger && draftData.nemaConfiguration) || reduxNemaConfig || "",
      chargerProvidedByUser:
        isEvCharger && draftData.chargerProvidedByUser !== undefined
          ? draftData.chargerProvidedByUser
          : reduxProvidingCharger === "Yes",
      chargerStatus:
        (isEvCharger && draftData.chargerStatus) || reduxChargerStatus || "",
      installationLocation:
        (isEvCharger && draftData.installationLocation) ||
        reduxInstallationLocation ||
        "",
      panelLocation:
        (isEvCharger && draftData.panelLocation) || reduxPanelLocation || "",
      panelDistance:
        (isEvCharger && draftData.panelDistance) || reduxPanelDistance || "",
      areaPhoto:
        (isEvCharger && draftData.areaPhoto) ||
        (chargerAreaPhotos.length > 0 ? chargerAreaPhotos[0] : ""),
      panelPhotos: (isEvCharger && draftData.panelPhotos) || panelPhotos || [],
      additionalInformation:
        (isEvCharger && draftData.additionalInformation) ||
        reduxAdditionalInfo ||
        "",
      status: "draft" as const,
      completionPercentage,
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
      toast.error(
        error?.data?.message || "Failed to save draft. Please try again.",
      );
    }
  };

  // ─── Continue handler ────────────────────────────────────────────────────────
  const handleContinue = () => {
    router.push({
      pathname: "/(tabs)/quotes/quote/ev-charger/additional-info",
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
              pathname: "/(tabs)/quotes/quote/ev-charger/panel-location",
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
            title="Photos needed"
            subtitle="Upload photos of the installation area and electrical panel"
          />

          <PhotoUploadSection
            label="Upload photo of area you want EV charger installed"
            photos={chargerAreaPhotos || []}
            maxPhotos={1}
            onPhotosChange={handleAreaPhotosChange}
            onUploadSingle={handleAreaUploadSingle}
            onDeleteSingle={handleDeleteSingle}
            isUploading={uploadingSection === "area"}
          />

          <PhotoUploadSection
            label="Upload photos of your electrical panel up close so we can see the breakers/panel label and about 10 ft away"
            photos={panelPhotos || []}
            onPhotosChange={handlePanelPhotosChange}
            onUploadSingle={handlePanelUploadSingle}
            onDeleteSingle={handleDeleteSingle}
            isUploading={uploadingSection === "panel"}
          />

          <GradientButton
            label="Continue"
            onPress={handleContinue}
            disabled={isSaving || uploadingSection !== null}
          />
          <SavedEditAction
            onPress={handleSaveForLater}
            title={isSaving ? "Saving..." : "Save for Later"}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
