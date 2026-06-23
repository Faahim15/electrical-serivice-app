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
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  useDeleteImageMutation,
  useUploadImagesMutation,
} from "@/src/redux/api-slices/quote/quote-api";
import {
  selectCategory,
  updateCeilingFanDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { CeilingFanRecord } from "@/src/types/quotes/ceiling-fan.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 2;
const TOTAL_STEPS = 4;

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function FanDetails() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"fan" | null>(null);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Ceiling Fan Installation";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as CeilingFanRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "18") {
      dispatch(selectCategory("18"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  // Get values from Redux with correct field names
  const willProvideNewCeilingFan =
    categoryData?.categoryId === "18"
      ? (categoryData.details as any)?.willProvideNewCeilingFan || ""
      : "";
  const photosOfNewCeilingFan =
    categoryData?.categoryId === "18"
      ? (categoryData.details as any)?.photosOfNewCeilingFan || []
      : [];
  const describeFanWantInstalled =
    categoryData?.categoryId === "18"
      ? (categoryData.details as any)?.describeFanWantInstalled || ""
      : "";
  const tallOfCeilingFanFromFloor =
    categoryData?.categoryId === "18"
      ? (categoryData.details as any)?.tallOfCeilingFanFromFloor || ""
      : "";

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.willProvideNewCeilingFan !== undefined) {
      dispatch(
        updateCeilingFanDetails({
          willProvideNewCeilingFan: draft.willProvideNewCeilingFan
            ? "Yes"
            : "No",
        }),
      );
    }
    if (draft.photosOfNewCeilingFan?.length) {
      dispatch(
        updateCeilingFanDetails({
          photosOfNewCeilingFan: draft.photosOfNewCeilingFan,
        }),
      );
    }
    if (draft.describeFanWantInstalled) {
      dispatch(
        updateCeilingFanDetails({
          describeFanWantInstalled: draft.describeFanWantInstalled,
        }),
      );
    }
    if (draft.tallOfCeilingFanFromFloor) {
      dispatch(
        updateCeilingFanDetails({
          tallOfCeilingFanFromFloor: draft.tallOfCeilingFanFromFloor,
        }),
      );
    }
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

  const handleFanUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("fan");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
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
      willProvideNewCeilingFan: willProvideNewCeilingFan === "Yes",
      photosOfNewCeilingFan: photosOfNewCeilingFan || [],
      describeFanWantInstalled: describeFanWantInstalled || "",
      tallOfCeilingFanFromFloor: tallOfCeilingFanFromFloor || "",
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

  const isFanDetailsSelected = willProvideNewCeilingFan !== "";

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BackButton
          onPress={() =>
            router.push({
              pathname: "/(tabs)/quotes/quote/ceiling-fan/installation-type",
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
            title="Fan details"
            subtitle="Will you be providing the new ceiling fan?"
          />

          <OptionGrid
            label="Will you be providing the new ceiling fan?"
            options={["Yes", "No"]}
            selected={willProvideNewCeilingFan}
            onSelect={(val) =>
              dispatch(
                updateCeilingFanDetails({
                  willProvideNewCeilingFan: val as any,
                  photosOfNewCeilingFan: [],
                  describeFanWantInstalled: "",
                }),
              )
            }
            numColumns={2}
          />

          {willProvideNewCeilingFan === "Yes" && (
            <>
              <Text className="text-[#1E293B] text-[15px] font-Inter_Bold mb-3">
                Photos
              </Text>
              <PhotoUploadSection
                label="Please upload a photo of your new ceiling fan"
                photos={photosOfNewCeilingFan}
                onPhotosChange={(p) =>
                  dispatch(
                    updateCeilingFanDetails({
                      photosOfNewCeilingFan: p,
                    }),
                  )
                }
                onUploadSingle={handleFanUploadSingle}
                onDeleteSingle={deleteImageHandler}
                isUploading={uploadingSection === "fan"}
              />
            </>
          )}

          {willProvideNewCeilingFan === "No" && (
            <TextAreaInput
              label="Please describe the fan you want"
              placeholder="Any additional information you'd like to share"
              value={describeFanWantInstalled}
              onChangeText={(text) =>
                dispatch(
                  updateCeilingFanDetails({
                    describeFanWantInstalled: text,
                  }),
                )
              }
            />
          )}

          <Text className="text-[#1E293B] text-[15px] font-Inter_SemiBold mb-2">
            How tall is the ceiling where the fan will be installed?
          </Text>
          <TextInput
            value={tallOfCeilingFanFromFloor}
            onChangeText={(text) =>
              dispatch(
                updateCeilingFanDetails({
                  tallOfCeilingFanFromFloor: text,
                }),
              )
            }
            placeholder="E.g., 8 feet"
            placeholderTextColor="#9CA3AF"
            className="border border-gray-200 bg-white rounded-lg px-4 py-4 text-sm text-gray-700 font-Inter_Regular"
          />

          <View className="mt-[3%]">
            <GradientButton
              label="Continue"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/quotes/quote/ceiling-fan/switch-details",
                  params: { serviceCallId, serviceType },
                })
              }
              disabled={
                !isFanDetailsSelected || isSaving || uploadingSection !== null
              }
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
