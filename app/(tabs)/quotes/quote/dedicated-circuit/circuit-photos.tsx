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
  updateDedicatedCircuitDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  DedicatedCircuitPhotosFormData,
  dedicatedCircuitPhotosSchema,
} from "@/src/schemas/upload-photos/upload-photos.schema";
import { DedicatedCircuitRecord } from "@/src/types/quotes/dedicated-circuit.api.types";
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

const CURRENT_STEP = 7;
const TOTAL_STEPS = 9;

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
  const isInitialMount = useRef(true);
  const isUpdatingFromRedux = useRef(false);

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
  const reduxWhyNeedDedicatedCircuit =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.whyNeedDedicatedCircuit || ""
      : "";
  const reduxElectricalPanelLocation =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.electricalPanelLocation || ""
      : "";
  const reduxWhereWillDedicatedCircuitInstalled =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.whereWillDedicatedCircuitInstalled || ""
      : "";
  const reduxAboveBelowArea =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.aboveBelowArea || ""
      : "";
  const reduxDistance =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)
          ?.distanceElectricalPanelToInstallationArea || ""
      : "";
  const reduxAmpsNeeded =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.ampsNeeded || ""
      : "";
  const reduxVoltsNeeded =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.voltsNeeded || ""
      : "";
  const reduxNEMAConfiguration =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.NEMAConfiguration || ""
      : "";
  const reduxAdditionalNotes =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.additionalNotes || ""
      : "";

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
    trigger,
  } = useForm<DedicatedCircuitPhotosFormData>({
    resolver: zodResolver(dedicatedCircuitPhotosSchema),
    mode: "onChange",
    defaultValues: {
      photosOfElectricalMeter: reduxMeterPhotos || [],
      photosOfInstallationLocation: reduxPathPhotos || [],
    },
  });

  // ─── Sync photos from Redux to form ──────────────────────────────────────────
  useEffect(() => {
    if (reduxMeterPhotos.length > 0 && !isInitialMount.current) {
      isUpdatingFromRedux.current = true;
      setValue("photosOfElectricalMeter", reduxMeterPhotos);
      trigger("photosOfElectricalMeter");
      setTimeout(() => {
        isUpdatingFromRedux.current = false;
      }, 0);
    }
  }, [reduxMeterPhotos, setValue, trigger]);

  useEffect(() => {
    if (reduxPathPhotos.length > 0 && !isInitialMount.current) {
      isUpdatingFromRedux.current = true;
      setValue("photosOfInstallationLocation", reduxPathPhotos);
      trigger("photosOfInstallationLocation");
      setTimeout(() => {
        isUpdatingFromRedux.current = false;
      }, 0);
    }
  }, [reduxPathPhotos, setValue, trigger]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;

    if (draft.photosOfElectricalMeter?.length) {
      const photos = draft.photosOfElectricalMeter;
      dispatch(
        updateDedicatedCircuitDetails({
          photosOfElectricalMeter: photos,
        }),
      );
      reset({
        photosOfElectricalMeter: photos,
        photosOfInstallationLocation: draft.photosOfInstallationLocation || [],
      });
    }

    if (draft.photosOfInstallationLocation?.length) {
      const photos = draft.photosOfInstallationLocation;
      dispatch(
        updateDedicatedCircuitDetails({
          photosOfInstallationLocation: photos,
        }),
      );
      reset({
        photosOfElectricalMeter: draft.photosOfElectricalMeter || [],
        photosOfInstallationLocation: photos,
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

  const handleMeterUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("meter");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("photosOfElectricalMeter");
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
      trigger("photosOfInstallationLocation");
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

  // ─── Handlers ──────────────────────────────────────────────────────────────────
  const handleMeterPhotosChange = (photos: string[]) => {
    if (!isUpdatingFromRedux.current) {
      setValue("photosOfElectricalMeter", photos);
      trigger("photosOfElectricalMeter");
    }
  };

  const handlePathPhotosChange = (photos: string[]) => {
    if (!isUpdatingFromRedux.current) {
      setValue("photosOfInstallationLocation", photos);
      trigger("photosOfInstallationLocation");
    }
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
    const currentMeterPhotos =
      control._formValues.photosOfElectricalMeter || [];
    const currentPathPhotos =
      control._formValues.photosOfInstallationLocation || [];

    const payload = {
      // Contact Details
      fullName: draft?.fullName || fullName || "",
      phoneNumber: draft?.phoneNumber || phone || "",
      emailAddress: draft?.emailAddress || email || "",
      preferredContactMethod:
        draft?.preferredContactMethod || preferredContact || "Call",

      // Address Details
      streetAddress: draft?.streetAddress || streetAddress || "",
      apartmentUnit: draft?.apartmentUnit || apartment || "",
      city: draft?.city || city || "",
      state: draft?.state || state || "",
      zipCode: draft?.zipCode || zipCode || "",

      // Project Basics
      propertyType: draft?.propertyType || propertyType || "",
      ownershipStatus: draft?.ownershipStatus || ownershipStatus || "",
      timelineUrgency: draft?.timelineUrgency || timeline || "",

      // Dedicated Circuit Specific Fields
      whyNeedDedicatedCircuit:
        draft?.whyNeedDedicatedCircuit || reduxWhyNeedDedicatedCircuit || "",
      electricalPanelLocation:
        draft?.electricalPanelLocation || reduxElectricalPanelLocation || "",
      whereWillDedicatedCircuitInstalled:
        draft?.whereWillDedicatedCircuitInstalled ||
        reduxWhereWillDedicatedCircuitInstalled ||
        "",
      aboveBelowArea: draft?.aboveBelowArea || reduxAboveBelowArea || "",
      distanceElectricalPanelToInstallationArea:
        draft?.distanceElectricalPanelToInstallationArea || reduxDistance || "",
      ampsNeeded: draft?.ampsNeeded || reduxAmpsNeeded || "",
      voltsNeeded: draft?.voltsNeeded || reduxVoltsNeeded || "",
      NEMAConfiguration:
        draft?.NEMAConfiguration || reduxNEMAConfiguration || "",
      photosOfElectricalMeter:
        draft?.photosOfElectricalMeter || currentMeterPhotos || [],
      photosOfInstallationLocation:
        draft?.photosOfInstallationLocation || currentPathPhotos || [],

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
  const handleContinue = async (data: DedicatedCircuitPhotosFormData) => {
    // Save latest values to Redux before navigating
    if (data.photosOfElectricalMeter.length > 0) {
      dispatch(
        updateDedicatedCircuitDetails({
          photosOfElectricalMeter: data.photosOfElectricalMeter,
        }),
      );
    }
    if (data.photosOfInstallationLocation.length > 0) {
      dispatch(
        updateDedicatedCircuitDetails({
          photosOfInstallationLocation: data.photosOfInstallationLocation,
        }),
      );
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/dedicated-circuit/circuit-additional",
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

          {/* Meter Photos with Controller */}
          <Controller
            control={control}
            name="photosOfElectricalMeter"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload photos of your electrical meter (up close so we can see the numbers and about 10 ft away.)"
                  photos={value || []}
                  onPhotosChange={handleMeterPhotosChange}
                  onUploadSingle={handleMeterUploadSingle}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "meter"}
                />
                {error && (
                  <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Installation Location Photos with Controller */}
          <Controller
            control={control}
            name="photosOfInstallationLocation"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload a photo showing path from circuit to panel install location"
                  photos={value || []}
                  onPhotosChange={handlePathPhotosChange}
                  onUploadSingle={handlePathUploadSingle}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "path"}
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
