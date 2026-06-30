import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import PhotoUploadSection from "@/src/components/quote/PhotoUploadSection";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import TextAreaInput from "@/src/components/shared/TextAreaInput";
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
import { useDraftSave } from "@/src/hooks/useDraftSave";
import {
  useDeleteImageMutation,
  useUploadImagesMutation,
} from "@/src/redux/api-slices/quote/quote-api";
import {
  selectCategory,
  updateSurgeProtectionDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  SurgeProtectionPhotosFormData,
  surgeProtectionPhotosSchema,
} from "@/src/schemas/upload-photos/upload-photos.schema";
import { HomeSurgeProtectionRecord } from "@/src/types/quotes/home-surge-protection.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 4;
const TOTAL_STEPS = 5;

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function SurgeDetails() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"panel" | null>(
    null,
  );

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Home Surge Protection";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as HomeSurgeProtectionRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "11") {
      dispatch(selectCategory("11"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const panelPhotos =
    categoryData?.categoryId === "11"
      ? (categoryData.details as any)?.panelPhotos || []
      : [];
  const additionalNotes =
    categoryData?.categoryId === "11"
      ? (categoryData.details as any)?.additionalNotes || ""
      : "";

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<SurgeProtectionPhotosFormData>({
    resolver: zodResolver(surgeProtectionPhotosSchema),
    mode: "onChange",
    defaultValues: {
      panelPhotos: panelPhotos || [],
    },
  });

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    // Map draft fields to Redux - API uses photosOfElectricalPanel
    if (draft.photosOfElectricalPanel?.length) {
      dispatch(
        updateSurgeProtectionDetails({
          panelPhotos: draft.photosOfElectricalPanel,
        }),
      );
      setValue("panelPhotos", draft.photosOfElectricalPanel);
    }
    if (draft.additionalNotes) {
      dispatch(
        updateSurgeProtectionDetails({
          additionalNotes: draft.additionalNotes,
        }),
      );
    }
    trigger("panelPhotos");
  }, [draft]);

  // ─── Sync Redux state with React Hook Form ──────────────────────────────
  useEffect(() => {
    if (panelPhotos.length > 0) {
      setValue("panelPhotos", panelPhotos);
      trigger("panelPhotos");
    }
  }, [panelPhotos, setValue, trigger]);

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

  const handlePanelUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("panel");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("panelPhotos");
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
      // API expects photosOfElectricalPanel, not panelPhotos
      photosOfElectricalPanel:
        draft?.photosOfElectricalPanel || panelPhotos || [],
      additionalNotes: draft?.additionalNotes || additionalNotes || "",
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

  // ─── Handle Continue with Validation ──────────────────────────────────────
  const handleContinue = async (data: SurgeProtectionPhotosFormData) => {
    router.push({
      pathname: "/(tabs)/quotes/quote/common/review-request",
      params: { serviceCallId, serviceType },
    });
  };

  // ─── Check if form is valid ──────────────────────────────────────────────
  const isFormValid = isValid && uploadingSection === null && !isSaving;

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BackButton
          onPress={() =>
            router.push({
              pathname: "/(tabs)/quotes/quote/common/project-basics",
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
            title="Home Surge Protection"
            subtitle="Protect your home from power surges"
          />

          <Controller
            control={control}
            name="panelPhotos"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload photos of your electrical panel up close so we can see the breakers/panel label and about 10 ft away"
                  photos={value || []}
                  onPhotosChange={(p) => {
                    dispatch(updateSurgeProtectionDetails({ panelPhotos: p }));
                    setValue("panelPhotos", p);
                    trigger("panelPhotos");
                  }}
                  onUploadSingle={handlePanelUploadSingle}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "panel"}
                />
                {error && (
                  <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          <TextAreaInput
            label="Additional notes (optional)"
            placeholder="Any additional information you'd like to share"
            value={draft?.additionalNotes || additionalNotes}
            onChangeText={(text) =>
              dispatch(updateSurgeProtectionDetails({ additionalNotes: text }))
            }
            minHeight={120}
          />

          <GradientButton
            label="Continue"
            onPress={handleSubmit(handleContinue)}
            disabled={!isFormValid}
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
