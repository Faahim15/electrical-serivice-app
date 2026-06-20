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
  updateDedicatedCircuitDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { DedicatedCircuitRecord } from "@/src/types/quotes/dedicated-circuit.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 7;
const TOTAL_STEPS = 8;

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function CircuitPhotos() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "meter" | "path" | null
  >(null);
  const [localMeterPhotos, setLocalMeterPhotos] = useState<string[]>([]);
  const [localPathPhotos, setLocalPathPhotos] = useState<string[]>([]);
  const isInitialMount = useRef(true);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Dedicated Circuit";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as DedicatedCircuitRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "13") {
      dispatch(selectCategory("13"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxMeterPhotos =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.photosOfElectricalMeter || []
      : [];
  const reduxPathPhotos =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.photosOfInstallationLocation || []
      : [];

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxMeterPhotos) !== JSON.stringify(localMeterPhotos);
    if (photosChanged && !isInitialMount.current) {
      setLocalMeterPhotos(reduxMeterPhotos);
    }
  }, [reduxMeterPhotos]);

  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxPathPhotos) !== JSON.stringify(localPathPhotos);
    if (photosChanged && !isInitialMount.current) {
      setLocalPathPhotos(reduxPathPhotos);
    }
  }, [reduxPathPhotos]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.photosOfElectricalMeter?.length) {
      setLocalMeterPhotos(draft.photosOfElectricalMeter);
      dispatch(
        updateDedicatedCircuitDetails({
          photosOfElectricalMeter: draft.photosOfElectricalMeter,
        }),
      );
    }
    if (draft.photosOfInstallationLocation?.length) {
      setLocalPathPhotos(draft.photosOfInstallationLocation);
      dispatch(
        updateDedicatedCircuitDetails({
          photosOfInstallationLocation: draft.photosOfInstallationLocation,
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

  const handleMeterUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("meter");
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

  const handlePathUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("path");
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
  const handleMeterPhotosChange = (photos: string[]) => {
    setLocalMeterPhotos(photos);
  };

  const handlePathPhotosChange = (photos: string[]) => {
    setLocalPathPhotos(photos);
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
      photosOfElectricalMeter: localMeterPhotos || [],
      photosOfInstallationLocation: localPathPhotos || [],
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
    if (localMeterPhotos.length > 0) {
      dispatch(
        updateDedicatedCircuitDetails({
          photosOfElectricalMeter: localMeterPhotos,
        }),
      );
    }
    if (localPathPhotos.length > 0) {
      dispatch(
        updateDedicatedCircuitDetails({
          photosOfInstallationLocation: localPathPhotos,
        }),
      );
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/dedicated-circuit/circuit-additional",
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
              pathname: "/(tabs)/quotes/quote/dedicated-circuit/circuit-specs",
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

          <AuthHeading title="Photos Upload" subtitle="" />

          <PhotoUploadSection
            label="Upload photos of your electrical meter (up close so we can see the numbers and about 10 ft away.)"
            photos={localMeterPhotos}
            onPhotosChange={handleMeterPhotosChange}
            onUploadSingle={handleMeterUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "meter"}
          />

          <PhotoUploadSection
            label="Upload a photo showing path from circuit to panel install location"
            photos={localPathPhotos}
            onPhotosChange={handlePathPhotosChange}
            onUploadSingle={handlePathUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "path"}
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
