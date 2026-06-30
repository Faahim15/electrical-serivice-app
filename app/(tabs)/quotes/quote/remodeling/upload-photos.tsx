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
import { updateRemodelingDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  RemodelingUploadPhotosFormData,
  remodelingUploadPhotosSchema,
} from "@/src/schemas/upload-photos/upload-photos.schema";
import { RemodelingRecord } from "@/src/types/quotes/remodeling.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSelector } from "@reduxjs/toolkit";
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

const SERVICE_TYPE = "Remodeling";
const CURRENT_STEP = 7;
const TOTAL_STEPS = 9;

// ─── Memoized Selectors ──────────────────────────────────────────────────────
const selectCategoryData = (state: RootState) => state.serviceForm.categoryData;

const selectExistingSpacePhotos = createSelector(
  [selectCategoryData],
  (data) => {
    if (data?.categoryId === "4" && data.details) {
      return data.details.existingSpacePhotos ?? [];
    }
    return [];
  },
);

const selectPanelPhotos = createSelector([selectCategoryData], (data) => {
  if (data?.categoryId === "4" && data.details) {
    return data.details.panelPhotos ?? [];
  }
  return [];
});

const selectPanelLocation = createSelector([selectCategoryData], (data) => {
  if (data?.categoryId === "4" && data.details) {
    return data.details.panelLocation ?? "";
  }
  return "";
});

const selectPanelLocationOther = createSelector(
  [selectCategoryData],
  (data) => {
    if (data?.categoryId === "4" && data.details) {
      return data.details.panelLocationOther ?? "";
    }
    return "";
  },
);

const selectRemodlingArea = createSelector([selectCategoryData], (data) => {
  if (data?.categoryId === "4" && data.details) {
    return data.details.remodlingArea ?? "";
  }
  return "";
});

const selectHasPlans = createSelector([selectCategoryData], (data) => {
  if (data?.categoryId === "4" && data.details) {
    return data.details.hasPlans ?? "";
  }
  return "";
});

const selectPlanPhotos = createSelector([selectCategoryData], (data) => {
  if (data?.categoryId === "4" && data.details) {
    return data.details.planPhotos ?? [];
  }
  return [];
});

const selectElectricalNeeds = createSelector([selectCategoryData], (data) => {
  if (data?.categoryId === "4" && data.details) {
    return data.details.electricalNeeds ?? "";
  }
  return "";
});

const selectHasPermit = createSelector([selectCategoryData], (data) => {
  if (data?.categoryId === "4" && data.details) {
    return data.details.hasPermit ?? "";
  }
  return "";
});

const selectPermitNumber = createSelector([selectCategoryData], (data) => {
  if (data?.categoryId === "4" && data.details) {
    return data.details.permitNumber ?? "";
  }
  return "";
});

export default function RemodelingUploadPhotos() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "existing" | "panel" | null
  >(null);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || SERVICE_TYPE;
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as RemodelingRecord | undefined;

  const [uploadImages] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

  // ─── Redux state with memoized selectors ──────────────────────────────────
  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const { propertyType, ownershipStatus, timeline } = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  const panelLocation = useSelector(selectPanelLocation);
  const panelLocationOther = useSelector(selectPanelLocationOther);
  const remodlingArea = useSelector(selectRemodlingArea);
  const hasPlans = useSelector(selectHasPlans);
  const planPhotos = useSelector(selectPlanPhotos);
  const electricalNeeds = useSelector(selectElectricalNeeds);
  const hasPermit = useSelector(selectHasPermit);
  const permitNumber = useSelector(selectPermitNumber);
  const existingSpacePhotos = useSelector(selectExistingSpacePhotos);
  const panelPhotos = useSelector(selectPanelPhotos);

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<RemodelingUploadPhotosFormData>({
    resolver: zodResolver(remodelingUploadPhotosSchema),
    mode: "onChange",
    defaultValues: {
      existingSpacePhotos: existingSpacePhotos || [],
      panelPhotos: panelPhotos || [],
    },
  });

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.existingSpacePhotos?.length) {
      dispatch(
        updateRemodelingDetails({
          existingSpacePhotos: draft.existingSpacePhotos,
        }),
      );
      setValue("existingSpacePhotos", draft.existingSpacePhotos);
    }
    if (draft.panelPhotos?.length) {
      dispatch(updateRemodelingDetails({ panelPhotos: draft.panelPhotos }));
      setValue("panelPhotos", draft.panelPhotos);
    }
    trigger(["existingSpacePhotos", "panelPhotos"]);
  }, [draft]);

  // ─── Sync Redux state with React Hook Form ──────────────────────────────
  useEffect(() => {
    if (existingSpacePhotos.length > 0) {
      setValue("existingSpacePhotos", existingSpacePhotos);
      trigger("existingSpacePhotos");
    }
  }, [existingSpacePhotos, setValue, trigger]);

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

  const handleExistingUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("existing");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("existingSpacePhotos");
      return url;
    } catch (error) {
      console.error("[Remodeling] Existing space upload error:", error);
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
      trigger("panelPhotos");
      return url;
    } catch (error) {
      console.error("[Remodeling] Panel upload error:", error);
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
      panelLocation:
        panelLocation === "Other (please specify)"
          ? panelLocationOther
          : panelLocation || "",
      remodelingAreas: draft?.remodelingAreas || remodlingArea || "",
      hasPlansDrawings:
        draft?.hasPlansDrawings !== undefined
          ? draft.hasPlansDrawings
          : hasPlans === "Yes",
      plansDrawings: draft?.plansDrawings || planPhotos || [],
      electricalNeeds: draft?.electricalNeeds || electricalNeeds || "",
      permitApplied:
        draft?.permitApplied !== undefined
          ? draft.permitApplied
          : hasPermit === "Yes",
      permitNumber: draft?.permitNumber || permitNumber || "",
      existingSpacePhotos:
        draft?.existingSpacePhotos || existingSpacePhotos || [],
      panelPhotos: draft?.panelPhotos || panelPhotos || [],
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
  const handleContinue = async (data: RemodelingUploadPhotosFormData) => {
    router.push({
      pathname: "/(tabs)/quotes/quote/remodeling/additional-info",
      params: { serviceType, serviceCallId },
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
              pathname: "/(tabs)/quotes/quote/remodeling/permit-info",
              params: {
                serviceType: serviceType,
                serviceCallId: serviceCallId,
              },
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
            title="Photos needed"
            subtitle="Please upload these photos"
          />

          {/* Existing Space Photos with Controller */}
          <Controller
            control={control}
            name="existingSpacePhotos"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload photo of existing space"
                  photos={value || []}
                  onPhotosChange={(p) => {
                    dispatch(
                      updateRemodelingDetails({ existingSpacePhotos: p }),
                    );
                    setValue("existingSpacePhotos", p);
                    trigger("existingSpacePhotos");
                  }}
                  onUploadSingle={handleExistingUploadSingle}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "existing"}
                />
                {error && (
                  <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Panel Photos with Controller */}
          <Controller
            control={control}
            name="panelPhotos"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload photos of your electrical panel up close so we can see the breakers/panel label and about 10 ft away"
                  photos={value || []}
                  onPhotosChange={(p) => {
                    dispatch(updateRemodelingDetails({ panelPhotos: p }));
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
