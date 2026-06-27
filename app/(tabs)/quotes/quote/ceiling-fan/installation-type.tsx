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
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 4;
const TOTAL_STEPS = 8;

const AREA_OPTIONS = [
  "Attic above",
  "Occupied space above",
  "Crawlspace (unfinished)",
  "Crawlspace (encapsulated)",
  "Basement (unfinished)",
  "Basement (finished)",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function InstallationType() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "replacement" | null
  >(null);

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
  const installationType =
    categoryData?.categoryId === "18"
      ? (categoryData.details as any)?.installationType || ""
      : "";
  const photosOfCurrentCeilingFan =
    categoryData?.categoryId === "18"
      ? (categoryData.details as any)?.photosOfCurrentCeilingFan || []
      : [];
  const aboveBelowAreaOfCeilingFan =
    categoryData?.categoryId === "18"
      ? (categoryData.details as any)?.aboveBelowAreaOfCeilingFan || "" // ← Changed from [] to ""
      : "";
  const isThereCurrentLightFixture =
    categoryData?.categoryId === "18"
      ? (categoryData.details as any)?.isThereCurrentLightFixture || ""
      : "";
  const wasAreaPrewired =
    categoryData?.categoryId === "18"
      ? (categoryData.details as any)?.wasAreaPrewired || ""
      : "";

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.installationType) {
      dispatch(
        updateCeilingFanDetails({
          installationType: draft.installationType as any,
        }),
      );
    }
    if (draft.photosOfCurrentCeilingFan?.length) {
      dispatch(
        updateCeilingFanDetails({
          photosOfCurrentCeilingFan: draft.photosOfCurrentCeilingFan,
        }),
      );
    }
    if (draft.aboveBelowAreaOfCeilingFan) {
      dispatch(
        updateCeilingFanDetails({
          aboveBelowAreaOfCeilingFan: draft.aboveBelowAreaOfCeilingFan as any,
        }),
      );
    }
    if (draft.isThereCurrentLightFixture !== undefined) {
      dispatch(
        updateCeilingFanDetails({
          isThereCurrentLightFixture: draft.isThereCurrentLightFixture
            ? "Yes"
            : "No",
        }),
      );
    }
    if (draft.wasAreaPrewired) {
      dispatch(
        updateCeilingFanDetails({
          wasAreaPrewired: draft.wasAreaPrewired as any,
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

  const handleReplacementUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("replacement");
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

  // ─── Handle area toggle ──────────────────────────────────────────────────────
  const toggleArea = (area: string) => {
    // If already selected, deselect it (set to empty string)
    if (aboveBelowAreaOfCeilingFan === area) {
      dispatch(
        updateCeilingFanDetails({
          aboveBelowAreaOfCeilingFan: "",
        }),
      );
    } else {
      // Select this area
      dispatch(
        updateCeilingFanDetails({
          aboveBelowAreaOfCeilingFan: area,
        }),
      );
    }
  };

  // ─── Handle Installation Type Selection ─────────────────────────────────────
  const handleInstallationTypeSelect = (value: string) => {
    if (value === "Replacement") {
      // Clear all New Install related fields
      dispatch(
        updateCeilingFanDetails({
          installationType: "Replacement",
          aboveBelowAreaOfCeilingFan: "",
          isThereCurrentLightFixture: "",
          wasAreaPrewired: "",
        }),
      );
    } else if (value === "New Install") {
      // Clear Replacement related fields
      dispatch(
        updateCeilingFanDetails({
          installationType: "New Install",
          photosOfCurrentCeilingFan: [],
        }),
      );
    }
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
      installationType: installationType || "",
      photosOfCurrentCeilingFan: photosOfCurrentCeilingFan || [],
      aboveBelowAreaOfCeilingFan: aboveBelowAreaOfCeilingFan || "", // ← Changed from [] to ""
      isThereCurrentLightFixture: isThereCurrentLightFixture === "Yes",
      wasAreaPrewired: wasAreaPrewired || "",
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

  const isInstallationTypeSelected = installationType !== "";

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

          <AuthHeading
            title="Installation type"
            subtitle="Is this a replacement or new install?"
          />

          {/* ─── Custom Single Select for Installation Type ─────────────────── */}
          <Text className="text-[#1E293B] text-[15px] font-Inter_SemiBold mb-3">
            Is this a replacement or new install?
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {["Replacement", "New Install"].map((option) => {
              const isSelected = installationType === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => handleInstallationTypeSelect(option)}
                  style={{
                    width: "48%",
                    paddingVertical: 13,
                    paddingHorizontal: 18,
                    borderRadius: 12,
                    backgroundColor: isSelected ? "#0EA5E9" : "#FFFFFF",
                    borderWidth: 1.5,
                    borderColor: isSelected ? "#0EA5E9" : "#E2E8F0",
                    shadowColor: "#94A3B8",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isSelected ? 0 : 0.07,
                    shadowRadius: 3,
                    elevation: isSelected ? 0 : 1,
                  }}
                >
                  <Text
                    className="text-[13.5px] font-Inter_Medium text-center"
                    style={{ color: isSelected ? "#FFFFFF" : "#475569" }}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ─── Replacement Section ────────────────────────────────────────── */}
          {installationType === "Replacement" && (
            <>
              <Text className="text-[#1E293B] text-[15px] font-Inter_Bold mb-3">
                Photos
              </Text>
              <PhotoUploadSection
                label="Please upload photos of your current fan"
                photos={photosOfCurrentCeilingFan}
                onPhotosChange={(p) =>
                  dispatch(
                    updateCeilingFanDetails({
                      photosOfCurrentCeilingFan: p,
                    }),
                  )
                }
                onUploadSingle={handleReplacementUploadSingle}
                onDeleteSingle={deleteImageHandler}
                isUploading={uploadingSection === "replacement"}
              />
            </>
          )}

          {/* ─── New Install Section ────────────────────────────────────────── */}
          {installationType === "New Install" && (
            <>
              <Text className="text-[#1E293B] text-[15px] font-Inter_SemiBold mb-3">
                What is above / below the area the ceiling fan will be
                installed?
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {AREA_OPTIONS.map((area) => {
                  const isSelected = aboveBelowAreaOfCeilingFan === area; // ← Changed from .includes() to ===
                  return (
                    <Pressable
                      key={area}
                      onPress={() => toggleArea(area)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 999,
                        backgroundColor: isSelected ? "#60A5FA" : "#ffffff",
                        borderWidth: 1,
                        borderColor: isSelected ? "#60A5FA" : "#E5E7EB",
                      }}
                    >
                      <Text
                        className="font-Inter_Medium text-sm"
                        style={{ color: isSelected ? "#ffffff" : "#1F2937" }}
                      >
                        {area}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* ─── Custom Single Select for Light Fixture ─────────────────── */}
              <Text className="text-[#1E293B] text-[15px] font-Inter_SemiBold mb-3">
                Is there a current light fixture where you want the fan
                installed?
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {["Yes", "No"].map((option) => {
                  const isSelected = isThereCurrentLightFixture === option;
                  return (
                    <Pressable
                      key={option}
                      onPress={() =>
                        dispatch(
                          updateCeilingFanDetails({
                            isThereCurrentLightFixture: option as any,
                          }),
                        )
                      }
                      style={{
                        width: "48%",
                        paddingVertical: 13,
                        paddingHorizontal: 18,
                        borderRadius: 12,
                        backgroundColor: isSelected ? "#0EA5E9" : "#FFFFFF",
                        borderWidth: 1.5,
                        borderColor: isSelected ? "#0EA5E9" : "#E2E8F0",
                        shadowColor: "#94A3B8",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: isSelected ? 0 : 0.07,
                        shadowRadius: 3,
                        elevation: isSelected ? 0 : 1,
                      }}
                    >
                      <Text
                        className="text-[13.5px] font-Inter_Medium text-center"
                        style={{ color: isSelected ? "#FFFFFF" : "#475569" }}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* ─── Custom Single Select for Prewired ──────────────────────── */}
              <Text className="text-[#1E293B] text-[15px] font-Inter_SemiBold mb-3">
                Was the area prewired for a ceiling fan?
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {["Yes", "No", "I'm not sure"].map((option) => {
                  const isSelected = wasAreaPrewired === option;
                  return (
                    <Pressable
                      key={option}
                      onPress={() =>
                        dispatch(
                          updateCeilingFanDetails({
                            wasAreaPrewired: option as any,
                          }),
                        )
                      }
                      style={{
                        width: "100%",
                        paddingVertical: 13,
                        paddingHorizontal: 18,
                        borderRadius: 12,
                        backgroundColor: isSelected ? "#0EA5E9" : "#FFFFFF",
                        borderWidth: 1.5,
                        borderColor: isSelected ? "#0EA5E9" : "#E2E8F0",
                        shadowColor: "#94A3B8",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: isSelected ? 0 : 0.07,
                        shadowRadius: 3,
                        elevation: isSelected ? 0 : 1,
                      }}
                    >
                      <Text
                        className="text-[13.5px] font-Inter_Medium text-center"
                        style={{ color: isSelected ? "#FFFFFF" : "#475569" }}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          <View className="mt-[3%]">
            <GradientButton
              label="Continue"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/quotes/quote/ceiling-fan/fan-details",
                  params: { serviceCallId, serviceType },
                })
              }
              disabled={
                !isInstallationTypeSelected ||
                isSaving ||
                uploadingSection !== null
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
