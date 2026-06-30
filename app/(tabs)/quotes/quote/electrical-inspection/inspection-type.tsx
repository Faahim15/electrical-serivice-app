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
import { updateElectricalInspectionDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  ElectricalInspectionPhotosFormData,
  electricalInspectionPhotosSchema,
} from "@/src/schemas/upload-photos/upload-photos.schema";
import { ElectricRecord } from "@/src/types/quotes/electric.api.types";
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
const TOTAL_STEPS = 6;

const INSPECTION_TYPES = [
  "Whole House",
  "Accessory Building",
  "Partial House",
  "Electrical Service only",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function InspectionType() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"panel" | null>(
    null,
  );

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Electrical Systems Inspection";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as ElectricRecord | undefined;

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

  const inspectionType = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "8" && data.details)
      return data.details.inspectionType;
    return "";
  });

  const squareFootage = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "8" && data.details)
      return data.details.squareFootage;
    return "";
  });

  const panelCount = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "8" && data.details)
      return data.details.panelCount;
    return "";
  });

  const panelPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "8" && data.details)
      return data.details.panelPhotos || [];
    return [];
  });

  const showSquareFootage =
    inspectionType === "Whole House" ||
    inspectionType === "Accessory Building" ||
    inspectionType === "Partial House";

  const showPanelSection = inspectionType === "Electrical Service only";

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<ElectricalInspectionPhotosFormData>({
    resolver: zodResolver(electricalInspectionPhotosSchema),
    mode: "onChange",
    defaultValues: {
      panelPhotos: panelPhotos || [],
    },
  });

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;

    // Prefill inspection type
    if (draft.inspectionType) {
      dispatch(
        updateElectricalInspectionDetails({
          inspectionType: draft.inspectionType as any,
        }),
      );
    }

    // Prefill square footage (if exists)
    if (draft.squareFootage) {
      dispatch(
        updateElectricalInspectionDetails({
          squareFootage: draft.squareFootage,
        }),
      );
    }

    // Prefill panel count (if exists)
    if (draft.panelNeedForInspected) {
      dispatch(
        updateElectricalInspectionDetails({
          panelCount: String(draft.panelNeedForInspected),
        }),
      );
    }

    // Prefill panel photos
    if (draft.panelPhotos?.length) {
      dispatch(
        updateElectricalInspectionDetails({
          panelPhotos: draft.panelPhotos,
        }),
      );
      setValue("panelPhotos", draft.panelPhotos);
    }

    // Prefill additional info
    if (draft.additionalInformation) {
      dispatch(
        updateElectricalInspectionDetails({
          additionalInfo: draft.additionalInformation,
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
    // Get values from Redux
    const squareFootageValue = showSquareFootage ? squareFootage || "" : "";
    const panelCountValue = showPanelSection ? Number(panelCount || 0) : 0;

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
      inspectionType: draft?.inspectionType || inspectionType || "",
      panelNeedForInspected: draft?.panelNeedForInspected || panelCountValue,
      panelPhotos: draft?.panelPhotos || panelPhotos || [],
      additionalInformation: draft?.additionalInformation || "",
      squareFootage: draft?.squareFootage || squareFootageValue,
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

  // ─── Handle Continue ──────────────────────────────────────────────────────
  const handleContinue = () => {
    // For "Electrical Service only", validate photos
    if (showPanelSection) {
      // Trigger form validation
      handleSubmit(
        (data) => {
          router.push({
            pathname:
              "/(tabs)/quotes/quote/electrical-inspection/additional-info",
            params: { serviceCallId, serviceType },
          });
        },
        (errors) => {
          // Validation failed - show toast
          toast.error("Please upload photos of the electrical panel");
        },
      )();
    } else {
      // For other inspection types, just navigate
      router.push({
        pathname: "/(tabs)/quotes/quote/electrical-inspection/additional-info",
        params: { serviceCallId, serviceType },
      });
    }
  };

  // ─── Check if form is valid ──────────────────────────────────────────────
  const isFormValid = () => {
    if (showPanelSection) {
      return isValid && uploadingSection === null && !isSaving;
    }
    // If not showing panel section, no validation needed for photos
    return uploadingSection === null && !isSaving;
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

          <AuthHeading title="Inspection type" subtitle="" />

          <OptionGrid
            label="What do you need inspected?"
            options={INSPECTION_TYPES}
            selected={inspectionType}
            onSelect={(val) =>
              dispatch(
                updateElectricalInspectionDetails({
                  inspectionType: val as any,
                  squareFootage: "",
                  panelCount: "",
                  panelPhotos: [],
                }),
              )
            }
            numColumns={1}
          />

          {showSquareFootage && (
            <CustomInput
              label="What is the square footage of the building?"
              textInputConfig={{
                placeholder: "Type here",
                keyboardType: "number-pad",
                value: squareFootage,
                onChangeText: (text) =>
                  dispatch(
                    updateElectricalInspectionDetails({ squareFootage: text }),
                  ),
              }}
            />
          )}

          {showPanelSection && (
            <>
              <CustomInput
                label="How many panels will be inspected?"
                textInputConfig={{
                  placeholder: "Type here",
                  keyboardType: "number-pad",
                  value: panelCount,
                  onChangeText: (text) =>
                    dispatch(
                      updateElectricalInspectionDetails({ panelCount: text }),
                    ),
                }}
              />
              <Controller
                control={control}
                name="panelPhotos"
                render={({ field: { value }, fieldState: { error } }) => (
                  <View>
                    <PhotoUploadSection
                      label="Please upload clear photos of your electrical panel up close so we can see the breakers/panel label and about 10 ft away."
                      photos={value || []}
                      onPhotosChange={(p) => {
                        dispatch(
                          updateElectricalInspectionDetails({ panelPhotos: p }),
                        );
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
            </>
          )}

          <View className="mt-[3%]">
            <GradientButton
              label="Continue"
              onPress={handleContinue}
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
