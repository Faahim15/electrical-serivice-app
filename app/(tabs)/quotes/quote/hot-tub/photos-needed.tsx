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
  updateHotTubDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  HotTubPhotosFormData,
  hotTubPhotosSchema,
} from "@/src/schemas/upload-photos/upload-photos.schema";
import { HotTubRecord } from "@/src/types/quotes/hot-tub.api.types";
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
const CURRENT_STEP = 7;
const TOTAL_STEPS = 9;

// ─── Zod Schema ──────────────────────────────────────────────────────────────

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function PhotosNeeded() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "panel" | "installLocation" | "receptacle" | null
  >(null);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Hot tub installation";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as HotTubRecord | undefined;

  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const { propertyType, ownershipStatus, timeline } = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  const [uploadImages] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

  // ─── Ensure category is selected so selectors return correct data ────────────
  useEffect(() => {
    dispatch(selectCategory("6"));
  }, []);

  const panelPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "6" && data.details)
      return data.details.panelPhotos || [];
    return [];
  });

  const installLocationPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "6" && data.details)
      return data.details.installLocationPhotos || [];
    return [];
  });

  const receptaclePhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "6" && data.details)
      return data.details.receptaclePhotos || [];
    return [];
  });

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<HotTubPhotosFormData>({
    resolver: zodResolver(hotTubPhotosSchema),
    mode: "onChange",
    defaultValues: {
      panelPhotos: panelPhotos || [],
      installLocationPhotos: installLocationPhotos || [],
      receptaclePhotos: receptaclePhotos || [],
    },
  });

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;

    let hasChanges = false;

    if (draft.panelPhotos?.length) {
      dispatch(updateHotTubDetails({ panelPhotos: draft.panelPhotos }));
      setValue("panelPhotos", draft.panelPhotos);
      hasChanges = true;
    }
    if (draft.hotTubPhotos?.length) {
      dispatch(
        updateHotTubDetails({ installLocationPhotos: draft.hotTubPhotos }),
      );
      setValue("installLocationPhotos", draft.hotTubPhotos);
      hasChanges = true;
    }
    if (draft.receptaclePhotos?.length) {
      dispatch(
        updateHotTubDetails({ receptaclePhotos: draft.receptaclePhotos }),
      );
      setValue("receptaclePhotos", draft.receptaclePhotos);
      hasChanges = true;
    }
    trigger(["panelPhotos", "installLocationPhotos", "receptaclePhotos"]);
  }, [draft]);

  // ─── Sync Redux state with React Hook Form ──────────────────────────────
  useEffect(() => {
    if (panelPhotos.length > 0) {
      setValue("panelPhotos", panelPhotos);
      trigger("panelPhotos");
    }
  }, [panelPhotos, setValue, trigger]);

  useEffect(() => {
    if (installLocationPhotos.length > 0) {
      setValue("installLocationPhotos", installLocationPhotos);
      trigger("installLocationPhotos");
    }
  }, [installLocationPhotos, setValue, trigger]);

  useEffect(() => {
    if (receptaclePhotos.length > 0) {
      setValue("receptaclePhotos", receptaclePhotos);
      trigger("receptaclePhotos");
    }
  }, [receptaclePhotos, setValue, trigger]);

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

  const handleInstallLocationUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("installLocation");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("installLocationPhotos");
      return url;
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  const handleReceptacleUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("receptacle");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("receptaclePhotos");
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
      panelPhotos: draft?.panelPhotos || panelPhotos || [],
      hotTubPhotos: draft?.hotTubPhotos || installLocationPhotos || [],
      receptaclePhotos: draft?.receptaclePhotos || receptaclePhotos || [],
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
  const handleContinue = async (data: HotTubPhotosFormData) => {
    router.push({
      pathname: "/(tabs)/quotes/quote/hot-tub/additional-info",
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
              pathname: "/(tabs)/quotes/quote/hot-tub/location-details",
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

          {/* Panel Photos with Controller */}
          <Controller
            control={control}
            name="panelPhotos"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload photos of your electrical panel"
                  photos={value || []}
                  onPhotosChange={(p) => {
                    dispatch(updateHotTubDetails({ panelPhotos: p }));
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

          {/* Install Location Photos with Controller */}
          <Controller
            control={control}
            name="installLocationPhotos"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload a photo of where your hot tub will be installed"
                  photos={value || []}
                  onPhotosChange={(p) => {
                    dispatch(updateHotTubDetails({ installLocationPhotos: p }));
                    setValue("installLocationPhotos", p);
                    trigger("installLocationPhotos");
                  }}
                  onUploadSingle={handleInstallLocationUploadSingle}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "installLocation"}
                />
                {error && (
                  <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Receptacle Photos with Controller */}
          <Controller
            control={control}
            name="receptaclePhotos"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload a photo of where the receptacle or disconnect might be installed"
                  photos={value || []}
                  onPhotosChange={(p) => {
                    dispatch(updateHotTubDetails({ receptaclePhotos: p }));
                    setValue("receptaclePhotos", p);
                    trigger("receptaclePhotos");
                  }}
                  onUploadSingle={handleReceptacleUploadSingle}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "receptacle"}
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
