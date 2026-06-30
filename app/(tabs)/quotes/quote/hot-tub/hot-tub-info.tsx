import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
import PhotoUploadSection from "@/src/components/quote/PhotoUploadSection";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import CustomInput from "@/src/components/shared/CustomInput";
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
import { HotTubRecord } from "@/src/types/quotes/hot-tub.api.types";
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
import { z } from "zod";

const SERVICE_TYPE = "Hot tub installation";
const CURRENT_STEP = 4;
const TOTAL_STEPS = 9;

// ─── Zod Schema ──────────────────────────────────────────────────────────────
const hotTubInfoSchema = z.object({
  userManualPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the user manual"),
});

type HotTubInfoFormData = z.infer<typeof hotTubInfoSchema>;

export default function HotTubInfo() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"manual" | null>(
    null,
  );

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || SERVICE_TYPE;
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as HotTubRecord | undefined;

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

  // ✅ Add key to force re-render when values change
  const hasUserManual = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "6" && data.details)
      return data.details.hasUserManual;
    return "" as const;
  });

  const userManualPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "6" && data.details)
      return data.details.userManualPhotos ?? [];
    return [];
  });

  const manufacturer = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "6" && data.details)
      return data.details.manufacturer;
    return "";
  });

  const modelNumber = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "6" && data.details)
      return data.details.modelNumber;
    return "";
  });

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<HotTubInfoFormData>({
    resolver: zodResolver(hotTubInfoSchema),
    mode: "onChange",
    defaultValues: {
      userManualPhotos: userManualPhotos || [],
    },
  });

  // ✅ Ensure category is selected
  useEffect(() => {
    dispatch(selectCategory("6"));
  }, []);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;

    let hasChanges = false;

    if (draft.hasDigitalManual !== undefined) {
      dispatch(
        updateHotTubDetails({
          hasUserManual: draft.hasDigitalManual ? "Yes" : "No",
        }),
      );
      hasChanges = true;
    }
    if (draft.manualDocument?.length) {
      dispatch(updateHotTubDetails({ userManualPhotos: draft.manualDocument }));
      setValue("userManualPhotos", draft.manualDocument);
      hasChanges = true;
    }
    if (draft.hotTubManufacturer) {
      dispatch(updateHotTubDetails({ manufacturer: draft.hotTubManufacturer }));
      hasChanges = true;
    }
    if (draft.hotTubModelNumber) {
      dispatch(updateHotTubDetails({ modelNumber: draft.hotTubModelNumber }));
      hasChanges = true;
    }
    trigger("userManualPhotos");
  }, [draft]);

  // ─── Sync Redux state with React Hook Form ──────────────────────────────
  useEffect(() => {
    if (userManualPhotos.length > 0) {
      setValue("userManualPhotos", userManualPhotos);
      trigger("userManualPhotos");
    }
  }, [userManualPhotos, setValue, trigger]);

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

  const handleManualUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("manual");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("userManualPhotos");
      return url;
    } catch (error) {
      console.error("[HotTub] Manual upload error:", error);
      toast.error("Failed to upload photo. Please try again.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  const deleteImageHandler = async (imageUrl: string) => {
    await deleteImage({ imageUrl }).unwrap();
  };

  // ─── Helper ──────────────────────────────────────────────────────────────────
  const createFormData = (payload: Record<string, any>) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    return formData;
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
      hasDigitalManual:
        draft?.hasDigitalManual !== undefined
          ? draft.hasDigitalManual
          : hasUserManual === "Yes",
      manualDocument: draft?.manualDocument || userManualPhotos || [],
      hotTubManufacturer: draft?.hotTubManufacturer || manufacturer || "",
      hotTubModelNumber: draft?.hotTubModelNumber || modelNumber || "",
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
  const handleContinue = async (data: HotTubInfoFormData) => {
    router.push({
      pathname: "/(tabs)/quotes/quote/hot-tub/electrical-requirements",
      params: { serviceType, serviceCallId },
    });
  };

  // ─── Check if form is valid ──────────────────────────────────────────────
  const isFormValid = () => {
    if (hasUserManual === "Yes") {
      return isValid && uploadingSection === null && !isSaving;
    }
    // If hasUserManual is "No", no validation needed for photos
    return uploadingSection === null && !isSaving;
  };

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BackButton />
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
          <AuthHeading title="Hot tub information" subtitle="" />

          <OptionGrid
            key={`manual-${hasUserManual}`}
            label="Do you have a digital copy of the user manual?"
            options={["Yes", "No"]}
            selected={hasUserManual}
            onSelect={(val) =>
              dispatch(
                updateHotTubDetails({
                  hasUserManual: val as any,
                  userManualPhotos: [],
                  manufacturer: "",
                  modelNumber: "",
                }),
              )
            }
            numColumns={1}
          />

          {hasUserManual === "Yes" && (
            <Controller
              control={control}
              name="userManualPhotos"
              render={({ field: { value }, fieldState: { error } }) => (
                <View>
                  <PhotoUploadSection
                    label="Upload the document"
                    photos={value || []}
                    maxPhotos={1}
                    onPhotosChange={(p) => {
                      dispatch(updateHotTubDetails({ userManualPhotos: p }));
                      setValue("userManualPhotos", p);
                      trigger("userManualPhotos");
                    }}
                    onUploadSingle={handleManualUploadSingle}
                    onDeleteSingle={deleteImageHandler}
                    isUploading={uploadingSection === "manual"}
                  />
                  {error && (
                    <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />
          )}

          {hasUserManual === "No" && (
            <>
              <CustomInput
                key={`manufacturer-${manufacturer}`}
                label="Hot tub manufacturer"
                textInputConfig={{
                  placeholder: "Type here",
                  value: manufacturer,
                  onChangeText: (text) =>
                    dispatch(updateHotTubDetails({ manufacturer: text })),
                }}
              />
              <CustomInput
                key={`model-${modelNumber}`}
                label="Hot tub model number"
                textInputConfig={{
                  placeholder: "Type here",
                  value: modelNumber,
                  onChangeText: (text) =>
                    dispatch(updateHotTubDetails({ modelNumber: text })),
                }}
              />
            </>
          )}
          <View className="mt-[3%]">
            <GradientButton
              label="Continue"
              onPress={handleSubmit(handleContinue)}
              disabled={!isFormValid()}
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
