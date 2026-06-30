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
  updateExhaustFanDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  ExhaustFanPanelPhotosFormData,
  exhaustFanPanelPhotosSchema,
} from "@/src/schemas/upload-photos/upload-photos.schema";
import { ExhaustFanRecord } from "@/src/types/quotes/exhaust-fan.api.types";
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

const CURRENT_STEP = 5;
const TOTAL_STEPS = 7;

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
  const isUpdatingFromRedux = useRef(false);

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

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
    trigger,
  } = useForm<ExhaustFanPanelPhotosFormData>({
    resolver: zodResolver(exhaustFanPanelPhotosSchema),
    mode: "onChange",
    defaultValues: {
      panelClosePhotos: reduxPanelClosePhotos || [],
      panelWidePhotos: reduxPanelWidePhotos || [],
    },
  });

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxPanelClosePhotos) !==
      JSON.stringify(localPanelClosePhotos);
    if (photosChanged && !isInitialMount.current) {
      isUpdatingFromRedux.current = true;
      setLocalPanelClosePhotos(reduxPanelClosePhotos);
      setValue("panelClosePhotos", reduxPanelClosePhotos);
      trigger("panelClosePhotos");
      setTimeout(() => {
        isUpdatingFromRedux.current = false;
      }, 0);
    }
  }, [reduxPanelClosePhotos]);

  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxPanelWidePhotos) !==
      JSON.stringify(localPanelWidePhotos);
    if (photosChanged && !isInitialMount.current) {
      isUpdatingFromRedux.current = true;
      setLocalPanelWidePhotos(reduxPanelWidePhotos);
      setValue("panelWidePhotos", reduxPanelWidePhotos);
      trigger("panelWidePhotos");
      setTimeout(() => {
        isUpdatingFromRedux.current = false;
      }, 0);
    }
  }, [reduxPanelWidePhotos]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;

    // Panel close-up photos - matches API field
    if (draft.photosOfPanelCloseUp?.length) {
      const photos = draft.photosOfPanelCloseUp;
      setLocalPanelClosePhotos(photos);
      dispatch(
        updateExhaustFanDetails({
          panelClosePhotos: photos,
        }),
      );
      reset({
        panelClosePhotos: photos,
        panelWidePhotos: draft.photosOfPanelWideShot || [],
      });
    }

    // Panel wide shot photos - matches API field
    if (draft.photosOfPanelWideShot?.length) {
      const photos = draft.photosOfPanelWideShot;
      setLocalPanelWidePhotos(photos);
      dispatch(
        updateExhaustFanDetails({
          panelWidePhotos: photos,
        }),
      );
      reset({
        panelClosePhotos: draft.photosOfPanelCloseUp || [],
        panelWidePhotos: photos,
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

  const handlePanelCloseUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("panelClose");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("panelClosePhotos");
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
      trigger("panelWidePhotos");
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
    if (!isUpdatingFromRedux.current) {
      setLocalPanelClosePhotos(photos);
      setValue("panelClosePhotos", photos);
      trigger("panelClosePhotos");
    }
  };

  const handlePanelWidePhotosChange = (photos: string[]) => {
    if (!isUpdatingFromRedux.current) {
      setLocalPanelWidePhotos(photos);
      setValue("panelWidePhotos", photos);
      trigger("panelWidePhotos");
    }
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const currentPanelClosePhotos = control._formValues.panelClosePhotos || [];
    const currentPanelWidePhotos = control._formValues.panelWidePhotos || [];

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
      photosOfPanelCloseUp:
        draft?.photosOfPanelCloseUp || currentPanelClosePhotos || [],
      photosOfPanelWideShot:
        draft?.photosOfPanelWideShot || currentPanelWidePhotos || [],

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
  const handleContinue = async (data: ExhaustFanPanelPhotosFormData) => {
    // Save final values to Redux before navigating
    if (data.panelClosePhotos.length > 0) {
      dispatch(
        updateExhaustFanDetails({
          panelClosePhotos: data.panelClosePhotos,
        }),
      );
    }
    if (data.panelWidePhotos.length > 0) {
      dispatch(
        updateExhaustFanDetails({
          panelWidePhotos: data.panelWidePhotos,
        }),
      );
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/exhaust-fan/fan-additional" as any,
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

          {/* Panel Close Photos with Controller */}
          <Controller
            control={control}
            name="panelClosePhotos"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload photos of your electrical panel up close so we can see the breakers / panel label"
                  photos={value || []}
                  onPhotosChange={handlePanelClosePhotosChange}
                  onUploadSingle={handlePanelCloseUploadSingle}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "panelClose"}
                />
                {error && (
                  <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Panel Wide Photos with Controller */}
          <Controller
            control={control}
            name="panelWidePhotos"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload photos of your electrical panel about 10 ft away"
                  photos={value || []}
                  onPhotosChange={handlePanelWidePhotosChange}
                  onUploadSingle={handlePanelWideUploadSingle}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "panelWide"}
                />
                {error && (
                  <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
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
