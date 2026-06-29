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
import { updateDockPowerDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { DockPowerRecord } from "@/src/types/quotes/dock-power.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 8;
const TOTAL_STEPS = 10;

const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function DockPhotosNeeded() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "existing" | "panel" | null
  >(null);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{ serviceCallId?: string; serviceType?: string }>();

  const serviceType = serviceTypeParam || "Dock Power";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as DockPowerRecord | undefined;

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

  const reduxExistingSpacePhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.existingSpacePhotos || [];
    return [];
  });

  const reduxPanelPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.panelPhotos || [];
    return [];
  });

  // ─── Local state ──────────────────────────────────────────────────────────────
  const [existingSpacePhotos, setExistingSpacePhotos] = useState<string[]>(
    reduxExistingSpacePhotos || [],
  );
  const [panelPhotos, setPanelPhotos] = useState<string[]>(
    reduxPanelPhotos || [],
  );

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.existingSpacePhotos?.length) {
      setExistingSpacePhotos(draft.existingSpacePhotos);
      dispatch(
        updateDockPowerDetails({
          existingSpacePhotos: draft.existingSpacePhotos,
        }),
      );
    }
    if (draft.panelPhotos?.length) {
      setPanelPhotos(draft.panelPhotos);
      dispatch(updateDockPowerDetails({ panelPhotos: draft.panelPhotos }));
    }
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

  const handleExistingUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("existing");
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

  const handleExistingPhotosChange = (updated: string[]) => {
    setExistingSpacePhotos(updated);
    dispatch(updateDockPowerDetails({ existingSpacePhotos: updated }));
  };

  const handlePanelPhotosChange = (updated: string[]) => {
    setPanelPhotos(updated);
    dispatch(updateDockPowerDetails({ panelPhotos: updated }));
  };

  const deleteImageHandler = async (imageUrl: string) => {
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
      isDockBuilt: draft?.isDockBuilt ?? false,
      electricalNeedsDetails: draft?.electricalNeedsDetails || "",
      receptacleCount: draft?.receptacleCount ?? 0,
      electricalServiceType: draft?.electricalServiceType || "",
      subPanelSize: draft?.subPanelSize || "",
      panelLocation: draft?.panelLocation || "",
      routeDistanceDetails: draft?.routeDistanceDetails || "",
      privateUtilitiesDetails: draft?.privateUtilitiesDetails || "",
      hasPlansDrawings: draft?.hasPlansDrawings ?? false,
      plansDrawingsPhotos: draft?.plansDrawingsPhotos || [],
      permitApplied: draft?.permitApplied ?? false,
      existingSpacePhotos: draft?.existingSpacePhotos?.length
        ? draft.existingSpacePhotos
        : existingSpacePhotos.length
          ? existingSpacePhotos
          : reduxExistingSpacePhotos,
      panelPhotos: draft?.panelPhotos?.length
        ? draft.panelPhotos
        : panelPhotos.length
          ? panelPhotos
          : reduxPanelPhotos,
      additionalInformation: draft?.additionalInformation || "",
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
    } catch {
      toast.error("Failed to save draft. Please try again.");
    }
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
              pathname: "/(tabs)/quotes/quote/dock-power/plans-permit",
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
          <AuthHeading title="Photos needed" subtitle="" />

          <PhotoUploadSection
            label="Upload photos of the dock and surrounding area"
            photos={existingSpacePhotos}
            onPhotosChange={handleExistingPhotosChange}
            onUploadSingle={handleExistingUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "existing"}
          />

          <PhotoUploadSection
            label="Please upload clear photo of electrical panel up close so we can see the numbers and about 10 ft away."
            photos={panelPhotos}
            onPhotosChange={handlePanelPhotosChange}
            onUploadSingle={handlePanelUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "panel"}
          />

          <GradientButton
            label="Continue"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/quotes/quote/dock-power/addtional-info",
                params: { serviceCallId, serviceType },
              })
            }
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
