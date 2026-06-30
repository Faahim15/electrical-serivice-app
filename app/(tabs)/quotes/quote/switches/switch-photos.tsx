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
  updateSwitchesDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  SwitchesPhotosFormData,
  switchesPhotosSchema,
} from "@/src/schemas/upload-photos/upload-photos.schema";
import { SwitchesRecord } from "@/src/types/quotes/switches.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

const CURRENT_STEP = 6;
const TOTAL_STEPS = 8;

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function SwitchPhotos() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"photos" | null>(
    null,
  );
  const isInitialMount = useRef(true);
  const isUpdatingFromRedux = useRef(false);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Switches Installation";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as SwitchesRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "16") {
      dispatch(selectCategory("16"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const photosOfWhereSwitchesInstallationNeeded =
    categoryData?.categoryId === "16"
      ? (categoryData.details as any)
          ?.photosOfWhereSwitchesInstallationNeeded || []
      : [];

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
    trigger,
  } = useForm<SwitchesPhotosFormData>({
    resolver: zodResolver(switchesPhotosSchema),
    mode: "onChange",
    defaultValues: {
      photosOfWhereSwitchesInstallationNeeded:
        photosOfWhereSwitchesInstallationNeeded || [],
    },
  });

  // ─── Sync photos from Redux to form ──────────────────────────────────────
  useEffect(() => {
    const photosChanged =
      JSON.stringify(photosOfWhereSwitchesInstallationNeeded) !==
      JSON.stringify(
        control._formValues.photosOfWhereSwitchesInstallationNeeded,
      );
    if (photosChanged && !isInitialMount.current) {
      isUpdatingFromRedux.current = true;
      setValue(
        "photosOfWhereSwitchesInstallationNeeded",
        photosOfWhereSwitchesInstallationNeeded,
      );
      trigger("photosOfWhereSwitchesInstallationNeeded");
      setTimeout(() => {
        isUpdatingFromRedux.current = false;
      }, 0);
    }
  }, [photosOfWhereSwitchesInstallationNeeded]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.photosOfWhereSwitchesInstallationNeeded?.length) {
      const photos = draft.photosOfWhereSwitchesInstallationNeeded;
      dispatch(
        updateSwitchesDetails({
          photosOfWhereSwitchesInstallationNeeded: photos,
        }),
      );
      reset({
        photosOfWhereSwitchesInstallationNeeded: photos,
      });
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

  const handlePhotosUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("photos");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("photosOfWhereSwitchesInstallationNeeded");
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

  // ─── Photo change handler ──────────────────────────────────────────────────
  const handlePhotosChange = (photos: string[]) => {
    if (!isUpdatingFromRedux.current) {
      setValue("photosOfWhereSwitchesInstallationNeeded", photos);
      trigger("photosOfWhereSwitchesInstallationNeeded");
    }
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const details =
      categoryData?.categoryId === "16" ? (categoryData.details as any) : {};
    const currentPhotos =
      control._formValues.photosOfWhereSwitchesInstallationNeeded || [];

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

      howManySwitchesNeeded:
        draft?.howManySwitchesNeeded || details.howManySwitchesNeeded || "",
      isNewInstallationOrReplacement:
        draft?.isNewInstallationOrReplacement ||
        details.isNewInstallationOrReplacement ||
        "",
      photosOfWhereSwitchesInstallationNeeded:
        draft?.photosOfWhereSwitchesInstallationNeeded || currentPhotos || [],
      typeOfSwitchesNeeded:
        draft?.typeOfSwitchesNeeded || details.typeOfSwitchesNeeded || [],
      additionalInformation:
        draft?.additionalInformation || details.additionalInformation || "",

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

  // ─── Handle Continue with Validation ──────────────────────────────────────
  const handleContinue = async (data: SwitchesPhotosFormData) => {
    // Save final values to Redux before navigating
    if (data.photosOfWhereSwitchesInstallationNeeded.length > 0) {
      dispatch(
        updateSwitchesDetails({
          photosOfWhereSwitchesInstallationNeeded:
            data.photosOfWhereSwitchesInstallationNeeded,
        }),
      );
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/switches/addtional-info",
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
              pathname: "/(tabs)/quotes/quote/switches/switch-type",
              params: { serviceCallId, serviceType },
            })
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(32) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />

          <AuthHeading
            title="Photos"
            subtitle="Upload photos of where the switches will be installed"
          />

          <Controller
            control={control}
            name="photosOfWhereSwitchesInstallationNeeded"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Please upload a photo of where the switch(es) will be installed"
                  photos={value || []}
                  onPhotosChange={handlePhotosChange}
                  onUploadSingle={handlePhotosUploadSingle}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "photos"}
                />
                {error && (
                  <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          <View className="mt-[3%]">
            <GradientButton
              label="Continue"
              onPress={handleSubmit(handleContinue)}
              disabled={!isFormValid}
            />
          </View>
          <SavedEditAction
            onPress={handleSaveForLater}
            title={isSaving ? "Saving..." : "Save for Later"}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
