import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import PhotoUploadSection from "@/src/components/quote/PhotoUploadSection";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  useDeleteImageMutation,
  useUploadImagesMutation,
} from "@/src/redux/api-slices/quote/quote-api";
import {
  selectCategory,
  updateServiceCallDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { ServiceCallResponse } from "@/src/types/quotes.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { createSelector } from "@reduxjs/toolkit";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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

const selectCategoryData = (state: RootState) => state.serviceForm.categoryData;
const selectPanelPhotos = createSelector([selectCategoryData], (data) => {
  if (data?.categoryId === "1") return data?.details?.panelPhotos ?? [];
  return [] as string[];
});

const selectWorkAreaPhotos = createSelector([selectCategoryData], (data) => {
  if (data?.categoryId === "1") return data?.details?.workAreaPhotos ?? [];
  return [] as string[];
});

const selectReferencePhotos = createSelector([selectCategoryData], (data) => {
  if (data?.categoryId === "1") return data?.details?.referencePhotos ?? [];
  return [] as string[];
});

export default function UploadPhotos() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "panel" | "workArea" | "reference" | null
  >(null);

  const panelPhotos = useSelector(selectPanelPhotos);
  const workAreaPhotos = useSelector(selectWorkAreaPhotos);
  const referencePhotos = useSelector(selectReferencePhotos);
  const selectedCategory = useSelector(
    (state: RootState) => state.categoryRoute.selectedCategory,
  );

  useEffect(() => {
    if (selectedCategory?.id !== "1") {
      dispatch(selectCategory("1"));
    }
  }, []);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType =
    serviceTypeParam || selectedCategory?.title || "Service Call";
  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const [uploadImages] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();
  const isLoading = isSaving;

  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as ServiceCallResponse | undefined;

  useEffect(() => {
    if (!draft) return;
    if (draft.panelPhotos?.length) {
      dispatch(updateServiceCallDetails({ panelPhotos: draft.panelPhotos }));
    }
    if (draft.workAreaPhotos?.length) {
      dispatch(
        updateServiceCallDetails({ workAreaPhotos: draft.workAreaPhotos }),
      );
    }
    if (draft.extraReferencePhotos?.length) {
      dispatch(
        updateServiceCallDetails({
          referencePhotos: draft.extraReferencePhotos,
        }),
      );
    }
  }, [draftData]);

  // ─── Upload single image → returns Cloudinary URL ───────────────────────────
  const uploadImage = async (localUri: string): Promise<string> => {
    const formData = new FormData();
    formData.append("images", {
      uri: localUri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    const res = await uploadImages(formData).unwrap();
    return res.data[0]; // data is string[]
  };

  const deleteImageHandler = async (imageUrl: string) => {
    await deleteImage({ imageUrl }).unwrap();
  };

  const handlePanelPhotosChange = (updated: string[]) => {
    dispatch(updateServiceCallDetails({ panelPhotos: updated }));
  };

  const handlePanelUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("panel");
      const uploadedUrl = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      return uploadedUrl;
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  const handleWorkAreaPhotosChange = (updated: string[]) => {
    dispatch(updateServiceCallDetails({ workAreaPhotos: updated }));
  };

  const handleWorkAreaUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("workArea");
      const uploadedUrl = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      return uploadedUrl;
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  const handleReferencePhotosChange = (updated: string[]) => {
    dispatch(updateServiceCallDetails({ referencePhotos: updated }));
  };

  const handleReferenceUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("reference");
      const uploadedUrl = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      return uploadedUrl;
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  const validatePhotos = (): boolean => {
    if (!panelPhotos || panelPhotos.length === 0) {
      toast.error("Please upload at least one panel photo");
      return false;
    }
    return true;
  };

  // ─── Helper to convert payload to FormData ──────────────────────────────────
  const createFormData = (payload: Record<string, any>) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    return formData;
  };

  const handleSaveForLater = async () => {
    if (!validatePhotos()) return;

    const payload = {
      fullName: draft?.fullName || "",
      emailAddress: draft?.emailAddress || "",
      phoneNumber: draft?.phoneNumber || "",
      preferredContactMethod: draft?.preferredContactMethod || "Call",
      streetAddress: draft?.streetAddress || "",
      apartmentUnit: draft?.apartmentUnit || "",
      city: draft?.city || "",
      state: draft?.state || "",
      zipCode: draft?.zipCode || "",
      propertyType: draft?.propertyType || "",
      ownershipStatus: draft?.ownershipStatus || "",
      timelineUrgency: draft?.timelineUrgency || "",
      issueDescription: draft?.issueDescription || "",
      preferredTime: draft?.preferredTime || "",
      schedulingPreference: draft?.schedulingPreference || [],
      panelPhotos: panelPhotos, // Cloudinary URLs from Redux
      workAreaPhotos: workAreaPhotos, // Cloudinary URLs from Redux
      extraReferencePhotos: referencePhotos, // Cloudinary URLs from Redux
      notes: draft?.notes || "",
      quickTags: draft?.quickTags || [],
      status: "draft" as const,
      completionPercentage: Math.round((CURRENT_STEP / TOTAL_STEPS) * 100),
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

  const handleContinue = async () => {
    if (!validatePhotos()) return;
    router.push({
      pathname: "/(tabs)/quotes/quote/service-call/additional-notes",
      params: { serviceType, serviceCallId },
    });
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
              pathname: "/(tabs)/quotes/quote/service-call/final-projectQ",
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
            title="Upload photos"
            subtitle="Photos help us understand your request faster"
          />

          <View
            className="bg-white rounded-2xl px-4 py-4 mb-5"
            style={{
              shadowColor: "#94A3B8",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text className="text-[#1E293B] text-[13.5px] font-Inter_SemiBold mb-2">
              Helpful photos include:
            </Text>
            {[
              "Electrical panel",
              "Outlet or work area",
              "Installation location",
              "Any visible issues",
            ].map((tip) => (
              <View key={tip} className="flex-row items-center mb-1">
                <View
                  className="w-[6px] h-[6px] rounded-full mr-2"
                  style={{ backgroundColor: "#0EA5E9" }}
                />
                <Text className="text-[#475569] text-[13px] font-Inter_Regular">
                  {tip}
                </Text>
              </View>
            ))}
          </View>

          <PhotoUploadSection
            label="Please upload clear photos of your electrical panel up close so we can see the breakers/panel label and about 10 ft away"
            photos={panelPhotos}
            onPhotosChange={handlePanelPhotosChange}
            onUploadSingle={handlePanelUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "panel"}
          />

          <PhotoUploadSection
            label="Work Area Photos"
            photos={workAreaPhotos}
            onPhotosChange={handleWorkAreaPhotosChange}
            onUploadSingle={handleWorkAreaUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "workArea"}
          />

          <PhotoUploadSection
            label="Extra Reference Photos"
            photos={referencePhotos}
            onPhotosChange={handleReferencePhotosChange}
            onUploadSingle={handleReferenceUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "reference"}
          />

          <GradientButton
            label="Continue"
            onPress={handleContinue}
            disabled={isLoading || uploadingSection !== null}
          />

          <SavedEditAction
            onPress={handleSaveForLater}
            title={isLoading ? "Saving..." : "Save for Later"}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
