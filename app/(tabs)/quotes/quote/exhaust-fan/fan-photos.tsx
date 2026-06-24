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
import { verticalScale } from "@/src/utils/Scaling";
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
    "panelClose" | "panelWide" | null
  >(null);
  const [localPanelClosePhotos, setLocalPanelClosePhotos] = useState<string[]>(
    [],
  );
  const [localPanelWidePhotos, setLocalPanelWidePhotos] = useState<string[]>(
    [],
  );
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
  const reduxPanelClosePhotos =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.panelClosePhotos || []
      : [];
  const reduxPanelWidePhotos =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.panelWidePhotos || []
      : [];

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxPanelClosePhotos) !==
      JSON.stringify(localPanelClosePhotos);
    if (photosChanged && !isInitialMount.current) {
      setLocalPanelClosePhotos(reduxPanelClosePhotos);
    }
  }, [reduxPanelClosePhotos]);

  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxPanelWidePhotos) !==
      JSON.stringify(localPanelWidePhotos);
    if (photosChanged && !isInitialMount.current) {
      setLocalPanelWidePhotos(reduxPanelWidePhotos);
    }
  }, [reduxPanelWidePhotos]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;

    // Panel close-up photos - matches API field
    if (draft.photosOfPanelCloseUp?.length) {
      setLocalPanelClosePhotos(draft.photosOfPanelCloseUp);
      dispatch(
        updateExhaustFanDetails({
          panelClosePhotos: draft.photosOfPanelCloseUp,
        }),
      );
    }

    // Panel wide shot photos - matches API field
    if (draft.photosOfPanelWideShot?.length) {
      setLocalPanelWidePhotos(draft.photosOfPanelWideShot);
      dispatch(
        updateExhaustFanDetails({
          panelWidePhotos: draft.photosOfPanelWideShot,
        }),
      );
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

  const handlePanelCloseUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("panelClose");
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

  const handlePanelWideUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("panelWide");
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
  const handlePanelClosePhotosChange = (photos: string[]) => {
    setLocalPanelClosePhotos(photos);
  };

  const handlePanelWidePhotosChange = (photos: string[]) => {
    setLocalPanelWidePhotos(photos);
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

      // ─── Panel photos - matches API fields ──────────────────────────────────
      photosOfPanelCloseUp: localPanelClosePhotos || [],
      photosOfPanelWideShot: localPanelWidePhotos || [],

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
    if (localPanelClosePhotos.length > 0) {
      dispatch(
        updateExhaustFanDetails({
          panelClosePhotos: localPanelClosePhotos,
        }),
      );
    }
    if (localPanelWidePhotos.length > 0) {
      dispatch(
        updateExhaustFanDetails({
          panelWidePhotos: localPanelWidePhotos,
        }),
      );
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
          contentContainerStyle={{ paddingBottom: verticalScale(132) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Panel Photos"
            subtitle="Upload photos of your electrical panel"
          />

          <PhotoUploadSection
            label="Upload photos of your electrical panel up close so we can see the breakers / panel label"
            photos={localPanelClosePhotos}
            onPhotosChange={handlePanelClosePhotosChange}
            onUploadSingle={handlePanelCloseUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "panelClose"}
          />

          <PhotoUploadSection
            label="Upload photos of your electrical panel about 10 ft away"
            photos={localPanelWidePhotos}
            onPhotosChange={handlePanelWidePhotosChange}
            onUploadSingle={handlePanelWideUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "panelWide"}
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
