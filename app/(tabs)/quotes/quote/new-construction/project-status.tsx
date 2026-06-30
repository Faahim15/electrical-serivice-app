import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
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
import { updateNewConstructionDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  NewConstructionPhotosFormData,
  newConstructionPhotosSchema,
} from "@/src/schemas/upload-photos/upload-photos.schema";
import { NewConstructionRecord } from "@/src/types/quotes/new-construction.api.types";
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

const CONSTRUCTION_STAGES = [
  "Preliminary",
  "Foundation in",
  "Framing complete",
  "Plumbing and/or HVAC installed",
  "Ready for electrical now",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function ProjectStatus() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "plans1" | "plans2" | null
  >(null);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "New Construction";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as NewConstructionRecord | undefined;

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

  const constructionBegun = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "10" && data.details)
      return data.details.constructionBegun;
    return "";
  });

  const constructionStage = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "10" && data.details)
      return data.details.constructionStage;
    return "";
  });

  const buildingPlanPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "10" && data.details)
      return data.details.buildingPlanPhotos || [];
    return [];
  });

  const hasBuildingPlans = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "10" && data.details)
      return data.details.hasBuildingPlans;
    return "";
  });

  const buildingPlanPhotos2 = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "10" && data.details)
      return data.details.buildingPlanPhotos2 || [];
    return [];
  });

  const isYes = constructionBegun === "Yes";
  const isNo = constructionBegun === "No";

  // Determine which photos to validate
  const showPhotoValidation = isYes || (isNo && hasBuildingPlans === "Yes");

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<NewConstructionPhotosFormData>({
    resolver: zodResolver(newConstructionPhotosSchema),
    mode: "onChange",
    defaultValues: {
      buildingPlanPhotos: isYes
        ? buildingPlanPhotos
        : buildingPlanPhotos2 || [],
    },
  });

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.hasConstructionBegun !== undefined) {
      dispatch(
        updateNewConstructionDetails({
          constructionBegun: draft.hasConstructionBegun ? "Yes" : "No",
        }),
      );
    }
    if (draft.stageOfConstruction) {
      dispatch(
        updateNewConstructionDetails({
          constructionStage: draft.stageOfConstruction as any,
        }),
      );
    }
    if (draft.haveBuildingPlans !== undefined) {
      dispatch(
        updateNewConstructionDetails({
          hasBuildingPlans: draft.haveBuildingPlans ? "Yes" : "No",
        }),
      );
    }
    if (draft.photosOfBuildingPlans?.length) {
      dispatch(
        updateNewConstructionDetails({
          buildingPlanPhotos: draft.photosOfBuildingPlans,
        }),
      );
      setValue("buildingPlanPhotos", draft.photosOfBuildingPlans);
    }
    trigger("buildingPlanPhotos");
  }, [draft]);

  // ─── Sync Redux state with React Hook Form ──────────────────────────────
  useEffect(() => {
    const currentPhotos = isYes ? buildingPlanPhotos : buildingPlanPhotos2;
    if (currentPhotos.length > 0) {
      setValue("buildingPlanPhotos", currentPhotos);
      trigger("buildingPlanPhotos");
    }
  }, [buildingPlanPhotos, buildingPlanPhotos2, isYes, setValue, trigger]);

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

  const handlePlans1UploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("plans1");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("buildingPlanPhotos");
      return url;
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  const handlePlans2UploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("plans2");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("buildingPlanPhotos");
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
      hasConstructionBegun: constructionBegun === "Yes",
      stageOfConstruction: constructionStage || "",
      haveBuildingPlans: hasBuildingPlans === "Yes",
      photosOfBuildingPlans: isYes
        ? buildingPlanPhotos || []
        : buildingPlanPhotos2 || [],
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
    // If photos are required, validate
    if (showPhotoValidation) {
      handleSubmit(
        (data) => {
          router.push({
            pathname: "/(tabs)/quotes/quote/common/review-request",
            params: { serviceCallId, serviceType },
          });
        },
        (errors) => {
          toast.error("Please upload at least one photo of the building plans");
        },
      )();
    } else {
      // No photo validation needed
      router.push({
        pathname: "/(tabs)/quotes/quote/common/review-request",
        params: { serviceCallId, serviceType },
      });
    }
  };

  // ─── Check if form is valid ──────────────────────────────────────────────
  const isFormValid = () => {
    if (showPhotoValidation) {
      return isValid && uploadingSection === null && !isSaving;
    }
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

          <AuthHeading title="Project status" subtitle="" />

          <OptionGrid
            label="Has construction begun on this project?"
            options={["Yes", "No"]}
            selected={constructionBegun}
            onSelect={(val) =>
              dispatch(
                updateNewConstructionDetails({
                  constructionBegun: val as any,
                  constructionStage: "",
                  buildingPlanPhotos: [],
                  hasBuildingPlans: "",
                  buildingPlanPhotos2: [],
                }),
              )
            }
            numColumns={1}
          />

          {isYes && (
            <>
              <OptionGrid
                label="What stage is construction in?"
                options={CONSTRUCTION_STAGES}
                selected={constructionStage}
                onSelect={(val) =>
                  dispatch(
                    updateNewConstructionDetails({
                      constructionStage: val as any,
                    }),
                  )
                }
                numColumns={1}
              />

              <Text className="text-[#1E293B] text-[15px] font-Inter_Bold mb-3">
                Building plans
              </Text>

              <Controller
                control={control}
                name="buildingPlanPhotos"
                render={({ field: { value }, fieldState: { error } }) => (
                  <View>
                    <PhotoUploadSection
                      label="Upload building plans"
                      photos={value || []}
                      onPhotosChange={(p) => {
                        dispatch(
                          updateNewConstructionDetails({
                            buildingPlanPhotos: p,
                          }),
                        );
                        setValue("buildingPlanPhotos", p);
                        trigger("buildingPlanPhotos");
                      }}
                      onUploadSingle={handlePlans1UploadSingle}
                      onDeleteSingle={deleteImageHandler}
                      isUploading={uploadingSection === "plans1"}
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

          {isNo && (
            <>
              <Text className="text-[#1E293B] text-[15px] font-Inter_Bold mb-3">
                Building plans
              </Text>

              <OptionGrid
                label="Do you have building plans for this project?"
                options={["Yes", "No"]}
                selected={hasBuildingPlans}
                onSelect={(val) =>
                  dispatch(
                    updateNewConstructionDetails({
                      hasBuildingPlans: val as any,
                      buildingPlanPhotos2: [],
                    }),
                  )
                }
                numColumns={1}
              />

              {hasBuildingPlans === "Yes" && (
                <Controller
                  control={control}
                  name="buildingPlanPhotos"
                  render={({ field: { value }, fieldState: { error } }) => (
                    <View>
                      <PhotoUploadSection
                        label="Upload building plans"
                        photos={value || []}
                        onPhotosChange={(p) => {
                          dispatch(
                            updateNewConstructionDetails({
                              buildingPlanPhotos2: p,
                            }),
                          );
                          setValue("buildingPlanPhotos", p);
                          trigger("buildingPlanPhotos");
                        }}
                        onUploadSingle={handlePlans2UploadSingle}
                        onDeleteSingle={deleteImageHandler}
                        isUploading={uploadingSection === "plans2"}
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
