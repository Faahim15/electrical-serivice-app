import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import PhotoUploadSection from "@/src/components/quote/PhotoUploadSection";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
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
import { ServiceCallResponse } from "@/src/types/quotes.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 7;
const TOTAL_STEPS = 9;

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

// Type guard to check if draft is EV Charger type
const isEvChargerDraft = (
  draft: ServiceCallResponse | EvChargerInstallationResponse,
): draft is EvChargerInstallationResponse => {
  return (
    (draft as EvChargerInstallationResponse).chargerConnectionType !== undefined
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

  // ─── Ensure category is set ──────────────────────────────────────────────────
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

  console.log("=== PhotosNeeded Component ===");
  console.log("chargerAreaPhotos from Redux:", chargerAreaPhotos);
  console.log("panelPhotos from Redux:", panelPhotos);
  console.log("categoryData:", categoryData);

  // ─── API hooks ────────────────────────────────────────────────────────────────
  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const [uploadImages] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

  // ─── Prefill from API draft ───────────────────────────────────────────────────
  useEffect(() => {
    if (draftData && isEvChargerDraft(draftData)) {
      console.log("Draft data loaded:", draftData);

      // First, ensure category is set to EV Charger
      if (!categoryData || categoryData.categoryId !== "2") {
        dispatch(selectCategory("2"));
      }

      // Set area photo
      if (draftData.areaPhoto) {
        console.log("Setting area photo from draft:", draftData.areaPhoto);
        dispatch(
          updateEVChargerDetails({
            chargerAreaPhotos: [draftData.areaPhoto],
          }),
        );
      } else {
        // Ensure empty array if no photo
        dispatch(
          updateEVChargerDetails({
            chargerAreaPhotos: [],
          }),
        );
      }

      // Set panel photos
      if (draftData.panelPhotos && draftData.panelPhotos.length > 0) {
        console.log("Setting panel photos from draft:", draftData.panelPhotos);
        dispatch(
          updateEVChargerDetails({
            panelPhotos: draftData.panelPhotos,
          }),
        );
      } else {
        // Ensure empty array if no photos
        dispatch(
          updateEVChargerDetails({
            panelPhotos: [],
          }),
        );
      }
    }
  }, [draftData]);

  // ─── Upload single image ─────────────────────────────────────────────────────
  const uploadSingleImage = async (localUri: string): Promise<string> => {
    console.log("Uploading image:", localUri);
    const formData = new FormData();
    formData.append("images", {
      uri: localUri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    const res = await uploadImages(formData).unwrap();
    console.log("Upload response:", res);
    return res.data[0];
  };

  // ─── Delete single image ─────────────────────────────────────────────────────
  const deleteSingleImage = async (imageUrl: string) => {
    console.log("Deleting image:", imageUrl);
    await deleteImage({ imageUrl }).unwrap();
  };

  // ─── Handle Area Photos Change ──────────────────────────────────────────────
  const handleAreaPhotosChange = (updated: string[]) => {
    console.log("Area photos changed - new array:", updated);
    // Ensure category is set before updating
    if (!categoryData || categoryData.categoryId !== "2") {
      dispatch(selectCategory("2"));
    }
    dispatch(updateEVChargerDetails({ chargerAreaPhotos: updated }));
  };

  // ─── Handle Panel Photos Change ──────────────────────────────────────────────
  const handlePanelPhotosChange = (updated: string[]) => {
    console.log("Panel photos changed - new array:", updated);
    // Ensure category is set before updating
    if (!categoryData || categoryData.categoryId !== "2") {
      dispatch(selectCategory("2"));
    }
    dispatch(updateEVChargerDetails({ panelPhotos: updated }));
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    // Get all required data from Redux or draft
    const finalFullName = draftData?.fullName || contactDetails.fullName;
    const finalEmail = draftData?.emailAddress || contactDetails.email;
    const finalPhone = draftData?.phoneNumber || contactDetails.phone;
    const finalPreferredContact =
      draftData?.preferredContactMethod || contactDetails.preferredContact;
    const finalStreetAddress =
      draftData?.streetAddress || serviceAddress.streetAddress;
    const finalApartment = draftData?.apartmentUnit || serviceAddress.apartment;
    const finalCity = draftData?.city || serviceAddress.city;
    const finalState = draftData?.state || serviceAddress.state;
    const finalZipCode = draftData?.zipCode || serviceAddress.zipCode;
    const finalPropertyType =
      draftData?.propertyType || projectBasics.propertyType;
    const finalOwnershipStatus =
      draftData?.ownershipStatus || projectBasics.ownershipStatus;
    const finalTimeline = draftData?.timelineUrgency || projectBasics.timeline;

    // Get previous step data from Redux or draft
    const previousData =
      categoryData?.categoryId === "2" ? (categoryData.details as any) : {};

    let finalChargerType = previousData.chargerType;
    let finalNemaConfig = previousData.nemaConfig;
    let finalProvidingCharger = previousData.providingCharger;
    let finalChargerStatus = previousData.chargerStatus;
    let finalInstallationLocation = previousData.installationLocation;
    let finalPanelLocation = previousData.panelLocation;
    let finalPanelDistance = previousData.panelDistance;

    if (draftData && isEvChargerDraft(draftData)) {
      finalChargerType = draftData.chargerConnectionType || finalChargerType;
      finalNemaConfig = draftData.nemaConfiguration || finalNemaConfig;
      finalProvidingCharger =
        draftData.chargerProvidedByUser !== undefined
          ? draftData.chargerProvidedByUser
            ? "Yes"
            : "No"
          : finalProvidingCharger;
      finalChargerStatus = draftData.chargerStatus || finalChargerStatus;
      finalInstallationLocation =
        draftData.installationLocation || finalInstallationLocation;
      finalPanelLocation = draftData.panelLocation || finalPanelLocation;
      finalPanelDistance = draftData.panelDistance || finalPanelDistance;
    }

    // Build payload matching the EV Charger API structure
    const payload = {
      fullName: finalFullName || "",
      phoneNumber: finalPhone || "",
      emailAddress: finalEmail || "",
      preferredContactMethod: finalPreferredContact || "Call",
      streetAddress: finalStreetAddress || "",
      apartmentUnit: finalApartment || "",
      city: finalCity || "",
      state: finalState || "",
      zipCode: finalZipCode || "",
      propertyType: finalPropertyType || "",
      ownershipStatus: finalOwnershipStatus || "",
      timelineUrgency: finalTimeline || "",
      chargerConnectionType: finalChargerType || "",
      nemaConfiguration: finalNemaConfig || "",
      chargerProvidedByUser: finalProvidingCharger === "Yes",
      chargerStatus: finalChargerStatus || "",
      installationLocation: finalInstallationLocation || "",
      panelLocation: finalPanelLocation || "",
      panelDistance: finalPanelDistance || "",
      areaPhoto: chargerAreaPhotos.length > 0 ? chargerAreaPhotos[0] : "",
      panelPhotos: panelPhotos || [],
      status: "draft" as const,
      completionPercentage,
    };

    const formData = createFormData(payload);

    try {
      if (serviceCallId) {
        await updateDraft(serviceCallId, serviceType, formData);
      } else {
        await createDraft(serviceType, formData);
      }
      toast.success("Draft saved successfully!");
      router.push("/(tabs)/home/saved-draft");
    } catch (error: any) {
      console.log("Save draft error:", error);
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
            onUploadSingle={uploadSingleImage}
            onDeleteSingle={deleteSingleImage}
            isUploading={uploadingSection === "area"}
          />

          <PhotoUploadSection
            label="Upload photos of your electrical panel up close so we can see the breakers/panel label and about 10 ft away"
            photos={panelPhotos || []}
            onPhotosChange={handlePanelPhotosChange}
            onUploadSingle={uploadSingleImage}
            onDeleteSingle={deleteSingleImage}
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
