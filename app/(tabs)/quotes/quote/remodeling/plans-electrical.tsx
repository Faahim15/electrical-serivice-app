import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
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
import { updateRemodelingDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { RemodelingRecord } from "@/src/types/quotes/remodeling.api.types";
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
import { z } from "zod";

const SERVICE_TYPE = "Remodeling";
const CURRENT_STEP = 5;
const TOTAL_STEPS = 9;

// ─── Zod Schema ──────────────────────────────────────────────────────────────
const remodelingUploadSchema = z.object({
  planPhotos: z
    .array(z.string())
    .min(1, "Please upload at least one photo of the plans/drawings"),
});

type RemodelingUploadFormData = z.infer<typeof remodelingUploadSchema>;

export default function PlansElectrical() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"plans" | null>(
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
  const draft = draftData as RemodelingRecord | undefined;

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

  const panelLocation = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "4" && data.details)
      return data.details.panelLocation;
    return "";
  });

  const panelLocationOther = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "4" && data.details)
      return data.details.panelLocationOther;
    return "";
  });

  const remodlingArea = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "4" && data.details)
      return data.details.remodlingArea;
    return "";
  });

  const hasPlans = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "4" && data.details) return data.details.hasPlans;
    return "" as const;
  });

  const planPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "4" && data.details)
      return data.details.planPhotos ?? [];
    return [];
  });

  const electricalNeeds = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "4" && data.details)
      return data.details.electricalNeeds;
    return "";
  });

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<RemodelingUploadFormData>({
    resolver: zodResolver(remodelingUploadSchema),
    mode: "onChange",
    defaultValues: {
      planPhotos: planPhotos || [],
    },
  });

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.hasPlansDrawings !== undefined) {
      dispatch(
        updateRemodelingDetails({
          hasPlans: draft.hasPlansDrawings ? "Yes" : "No",
        }),
      );
    }
    if (draft.plansDrawings?.length) {
      dispatch(updateRemodelingDetails({ planPhotos: draft.plansDrawings }));
      setValue("planPhotos", draft.plansDrawings);
    }
    if (draft.electricalNeeds) {
      dispatch(
        updateRemodelingDetails({ electricalNeeds: draft.electricalNeeds }),
      );
    }
    trigger("planPhotos");
  }, [draft]);

  // ─── Sync Redux state with React Hook Form ──────────────────────────────
  useEffect(() => {
    if (planPhotos.length > 0) {
      setValue("planPhotos", planPhotos);
      trigger("planPhotos");
    }
  }, [planPhotos, setValue, trigger]);

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

  const handlePlansUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("plans");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("planPhotos");
      return url;
    } catch (error) {
      console.error("[Remodeling] Plans upload error:", error);
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
  const handleContinue = async (data: RemodelingUploadFormData) => {
    // Only proceed if hasPlans is "Yes" and photos are uploaded
    if (hasPlans === "Yes" && data.planPhotos.length === 0) {
      toast.error("Please upload the plans/drawings");
      return;
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/remodeling/permit-info",
      params: { serviceType, serviceCallId },
    });
  };

  // ─── Check if form is valid ──────────────────────────────────────────────
  const isFormValid = () => {
    if (hasPlans === "Yes") {
      return isValid && uploadingSection === null && !isSaving;
    }
    // If hasPlans is "No", no validation needed for photos
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
              pathname: "/(tabs)/quotes/quote/remodeling/project-basics",
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
          contentContainerStyle={{ paddingBottom: verticalScale(120) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />
          <AuthHeading
            title="Plans and electrical needs"
            subtitle="Help us understand the scope"
          />

          <OptionGrid
            label="Do you have any plans/drawings for the remodel?"
            options={["Yes", "No"]}
            selected={hasPlans}
            onSelect={(val) =>
              dispatch(updateRemodelingDetails({ hasPlans: val as any }))
            }
            numColumns={1}
          />

          {hasPlans === "Yes" && (
            <Controller
              control={control}
              name="planPhotos"
              render={({ field: { value }, fieldState: { error } }) => (
                <View>
                  <PhotoUploadSection
                    label="Please upload the plans/drawings"
                    photos={value || []}
                    onPhotosChange={(p) => {
                      dispatch(updateRemodelingDetails({ planPhotos: p }));
                      setValue("planPhotos", p);
                      trigger("planPhotos");
                    }}
                    onUploadSingle={handlePlansUploadSingle}
                    onDeleteSingle={deleteImageHandler}
                    isUploading={uploadingSection === "plans"}
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

          <TextAreaInput
            label="What are the electrical needs for the remodel?"
            placeholder="Please describe receptacles, switches, lighting, etc."
            value={electricalNeeds}
            onChangeText={(text) =>
              dispatch(updateRemodelingDetails({ electricalNeeds: text }))
            }
            minHeight={120}
          />

          <GradientButton
            label="Continue"
            onPress={handleSubmit(handleContinue)}
            disabled={!isFormValid()}
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
