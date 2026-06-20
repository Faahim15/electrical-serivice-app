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
  updateExhaustFanDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { ExhaustFanRecord } from "@/src/types/quotes/exhaust-fan.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 5;
const TOTAL_STEPS = 6;

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function FanPhotos() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "area" | "panel" | null
  >(null);
  const [localAreaPhotos, setLocalAreaPhotos] = useState<string[]>([]);
  const [localPanelPhotos, setLocalPanelPhotos] = useState<string[]>([]);
  const isInitialMount = useRef(true);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Exhaust Fan";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as ExhaustFanRecord | undefined;

  const [uploadImages] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const { propertyType, ownershipStatus, timeline } = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );
  const categoryData = useSelector(
    (state: RootState) => state.serviceForm.categoryData,
  );

  // ─── Ensure category is set ──────────────────────────────────────────────────
  useEffect(() => {
    if (!categoryData || categoryData.categoryId !== "14") {
      dispatch(selectCategory("14"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxAreaPhotos =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.photosOfInstallationArea || []
      : [];
  const reduxPanelPhotos =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.panelPhotos || []
      : [];

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxAreaPhotos) !== JSON.stringify(localAreaPhotos);
    if (photosChanged && !isInitialMount.current) {
      setLocalAreaPhotos(reduxAreaPhotos);
    }
  }, [reduxAreaPhotos]);

  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxPanelPhotos) !== JSON.stringify(localPanelPhotos);
    if (photosChanged && !isInitialMount.current) {
      setLocalPanelPhotos(reduxPanelPhotos);
    }
  }, [reduxPanelPhotos]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;

    // Use photosOfInstallationArea - matches both API and Redux
    if (draft.photosOfInstallationArea?.length) {
      setLocalAreaPhotos(draft.photosOfInstallationArea);
      dispatch(
        updateExhaustFanDetails({
          photosOfInstallationArea: draft.photosOfInstallationArea,
        }),
      );
    }

    // Combine panel close-up and wide shot photos
    if (
      draft.photosOfPanelCloseUp?.length ||
      draft.photosOfPanelWideShot?.length
    ) {
      const allPanelPhotos = [
        ...(draft.photosOfPanelCloseUp || []),
        ...(draft.photosOfPanelWideShot || []),
      ];
      setLocalPanelPhotos(allPanelPhotos);
      dispatch(updateExhaustFanDetails({ panelPhotos: allPanelPhotos }));
    }
    isInitialMount.current = false;
  }, [draft]);

  // ─── Upload helpers ──────────────────────────────────────────────────────────
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

  const handleAreaUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("area");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      return url;
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  const handlePanelUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("panel");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      return url;
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  const deleteImageHandler = async (imageUrl: string) => {
    await deleteImage({ imageUrl }).unwrap();
  };

  // ─── Photo change handlers ──────────────────────────────────────────────────
  const handleAreaPhotosChange = (photos: string[]) => {
    setLocalAreaPhotos(photos);
  };

  const handlePanelPhotosChange = (photos: string[]) => {
    setLocalPanelPhotos(photos);
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
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
      photosOfInstallationArea: localAreaPhotos || [],
      panelPhotos: localPanelPhotos || [],
      status: "draft" as const,
      completionPercentage,
    };

    try {
      if (serviceCallId) {
        await updateDraft(serviceCallId, serviceType, createFormData(payload));
      } else {
        await createDraft(
          serviceType,
          createFormData({ serviceType, ...payload }),
        );
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

  const handleContinue = () => {
    // Save final values to Redux before navigating
    if (localAreaPhotos.length > 0) {
      dispatch(
        updateExhaustFanDetails({
          photosOfInstallationArea: localAreaPhotos,
        }),
      );
    }
    if (localPanelPhotos.length > 0) {
      dispatch(updateExhaustFanDetails({ panelPhotos: localPanelPhotos }));
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/exhaust-fan/fan-additional" as any,
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
              pathname: "/(tabs)/quotes/quote/exhaust-fan/fan-details" as any,
              params: { serviceCallId, serviceType },
            })
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Photos Needed"
            subtitle="Upload photos of the installation area and electrical panel"
          />

          <PhotoUploadSection
            label="Upload photos of the installation area"
            photos={localAreaPhotos}
            onPhotosChange={handleAreaPhotosChange}
            onUploadSingle={handleAreaUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "area"}
          />

          <PhotoUploadSection
            label="Upload photos of your electrical panel"
            photos={localPanelPhotos}
            onPhotosChange={handlePanelPhotosChange}
            onUploadSingle={handlePanelUploadSingle}
            onDeleteSingle={deleteImageHandler}
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
