import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
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
  updateOutletsDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { OutletRecord } from "@/src/types/quotes/outlet.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 5;
const TOTAL_STEPS = 7;

const INSTALL_TYPES = ["New install", "Replacement"];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function OutletInstall() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"install" | null>(
    null,
  );
  const [localInstallType, setLocalInstallType] = useState("");
  const [localPhotos, setLocalPhotos] = useState<string[]>([]);
  const isInitialMount = useRef(true);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Outlets";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as OutletRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "15") {
      dispatch(selectCategory("15"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxInstallType =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.installationType || ""
      : "";
  const reduxPhotos =
    categoryData?.categoryId === "15"
      ? (categoryData.details as any)?.photosOfWhereOutletsInstall || []
      : [];

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    if (reduxInstallType) setLocalInstallType(reduxInstallType);
  }, [reduxInstallType]);

  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxPhotos) !== JSON.stringify(localPhotos);
    if (photosChanged && !isInitialMount.current) {
      setLocalPhotos(reduxPhotos);
    }
  }, [reduxPhotos]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.newInstallationOrReplacement) {
      setLocalInstallType(draft.newInstallationOrReplacement);
      dispatch(
        updateOutletsDetails({
          installationType: draft.newInstallationOrReplacement,
        }),
      );
    }
    if (draft.photosOfWhereOutletsInstall?.length) {
      setLocalPhotos(draft.photosOfWhereOutletsInstall);
      dispatch(
        updateOutletsDetails({
          photosOfWhereOutletsInstall: draft.photosOfWhereOutletsInstall,
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

  const handleInstallUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("install");
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
  const handlePhotosChange = (photos: string[]) => {
    setLocalPhotos(photos);
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
      newInstallationOrReplacement: localInstallType || "",
      photosOfWhereOutletsInstall: localPhotos || [],
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
    if (localInstallType) {
      dispatch(updateOutletsDetails({ installationType: localInstallType }));
    }
    if (localPhotos.length > 0) {
      dispatch(
        updateOutletsDetails({ photosOfWhereOutletsInstall: localPhotos }),
      );
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/outlets/outlet-type",
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
              pathname: "/(tabs)/quotes/quote/outlets/outlets-details",
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
            title="Installation Type"
            subtitle="Is this a new install or replacement?"
          />

          <OptionGrid
            label="Is this a new install or replacement?"
            options={INSTALL_TYPES}
            selected={localInstallType}
            onSelect={(val) => {
              setLocalInstallType(val);
              dispatch(updateOutletsDetails({ installationType: val }));
            }}
            numColumns={1}
          />

          <PhotoUploadSection
            label="Please upload photos of where the outlet(s) will be installed."
            photos={localPhotos}
            onPhotosChange={handlePhotosChange}
            onUploadSingle={handleInstallUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "install"}
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
