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
import { updateGeneratorDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { GeneratorRecord } from "@/src/types/quotes/generator.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 7;
const TOTAL_STEPS = 7;

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function GeneratorPhotosNeeded() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "panel" | "generator" | "inlet" | "meter" | "install" | null
  >(null);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Generator Installation";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as GeneratorRecord | undefined;

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

  const generatorDetails = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "9" && data.details) {
      return data.details;
    }
    return null;
  });

  const panelPhotos = generatorDetails?.panelPhotos || [];
  const generatorPhotos = generatorDetails?.generatorPhotos || [];
  const installLocationPhotos = generatorDetails?.installLocationPhotos || [];
  const meterPhotos = generatorDetails?.meterPhotos || [];
  const hasGenerator = generatorDetails?.hasGenerator || "";
  const generatorType = generatorDetails?.generatorType || "";

  const hasExisting = hasGenerator === "Yes";
  const isWholeHomeStandby = generatorType === "Whole Home Standby";

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.electricPanelPhotos?.length) {
      dispatch(
        updateGeneratorDetails({ panelPhotos: draft.electricPanelPhotos }),
      );
    }
    if (draft.photosOfWhereGeneratorWillBeInlet?.length) {
      dispatch(
        updateGeneratorDetails({
          generatorPhotos: draft.photosOfWhereGeneratorWillBeInlet,
        }),
      );
    }
    if (draft.generatorInstallationLocationPhotos?.length) {
      dispatch(
        updateGeneratorDetails({
          installLocationPhotos: draft.generatorInstallationLocationPhotos,
        }),
      );
    }
    if (draft.photosOfElectricalMeter?.length) {
      dispatch(
        updateGeneratorDetails({ meterPhotos: draft.photosOfElectricalMeter }),
      );
    }
    if (draft.photosOfReceptacleOnGenerator?.length) {
      dispatch(
        updateGeneratorDetails({
          generatorPhotos: draft.photosOfReceptacleOnGenerator,
        }),
      );
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

  const handleUploadSingle = async (
    localUri: string,
    section: "panel" | "generator" | "inlet" | "meter" | "install",
  ): Promise<string> => {
    try {
      setUploadingSection(section);
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
      electricPanelPhotos: panelPhotos || [],
      photosOfWhereGeneratorWillBeInlet: generatorPhotos || [],
      generatorInstallationLocationPhotos: installLocationPhotos || [],
      photosOfElectricalMeter: meterPhotos || [],
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
              pathname: "/(tabs)/quotes/quote/generator/backup-needs",
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

          <AuthHeading title="Photos needed" subtitle="" />

          <PhotoUploadSection
            label="Please upload clear photos of your electrical panel up close so we can see the breakers/panel label and about 10 ft away"
            photos={panelPhotos}
            onPhotosChange={(p) =>
              dispatch(updateGeneratorDetails({ panelPhotos: p }))
            }
            onUploadSingle={(uri) => handleUploadSingle(uri, "panel")}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "panel"}
          />

          {hasExisting && (
            <PhotoUploadSection
              label="Upload photo of the receptacle on the generator"
              photos={generatorPhotos}
              onPhotosChange={(p) =>
                dispatch(updateGeneratorDetails({ generatorPhotos: p }))
              }
              onUploadSingle={(uri) => handleUploadSingle(uri, "generator")}
              onDeleteSingle={deleteImageHandler}
              isUploading={uploadingSection === "generator"}
            />
          )}

          {!isWholeHomeStandby && (
            <PhotoUploadSection
              label="Upload photo of where your generator inlet will be"
              photos={generatorPhotos}
              onPhotosChange={(p) =>
                dispatch(updateGeneratorDetails({ generatorPhotos: p }))
              }
              onUploadSingle={(uri) => handleUploadSingle(uri, "inlet")}
              onDeleteSingle={deleteImageHandler}
              isUploading={uploadingSection === "inlet"}
            />
          )}

          {isWholeHomeStandby && (
            <PhotoUploadSection
              label="Upload photo of your electrical meter"
              photos={meterPhotos}
              onPhotosChange={(p) =>
                dispatch(updateGeneratorDetails({ meterPhotos: p }))
              }
              onUploadSingle={(uri) => handleUploadSingle(uri, "meter")}
              onDeleteSingle={deleteImageHandler}
              isUploading={uploadingSection === "meter"}
            />
          )}

          <PhotoUploadSection
            label="Upload photo of where you would like the generator installed"
            photos={installLocationPhotos}
            onPhotosChange={(p) =>
              dispatch(updateGeneratorDetails({ installLocationPhotos: p }))
            }
            onUploadSingle={(uri) => handleUploadSingle(uri, "install")}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "install"}
          />

          <GradientButton
            label="Continue"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/quotes/quote/common/review-request",
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
