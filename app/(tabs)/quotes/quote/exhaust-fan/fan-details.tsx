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
  updateExhaustFanDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { ExhaustFanRecord } from "@/src/types/quotes/exhaust-fan.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 4;
const TOTAL_STEPS = 6;

const INSTALL_TYPES = ["New Installation", "Replacement"];
const FAN_LOCATIONS = ["Attic", "Kitchen", "Bathroom"];
const ATTIC_FAN_TYPES = ["Roof fan", "Gable (wall) fan"];
const STORIES = ["1", "2"];
const PANEL_LOCATIONS = [
  "Basement (Finished)",
  "Basement (Unfinished)",
  "Garage (Finished)",
  "Garage (Unfinished)",
  "Other",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function FanDetails() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"panel" | null>(
    null,
  );

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Exhaust Fan";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as ExhaustFanRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "14") {
      dispatch(selectCategory("14"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const installType =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.installationType || ""
      : "";
  const fanLocation =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.fanType || ""
      : "";
  const existingFan =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.existingFan || ""
      : "";
  const atticFanType =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.atticFanType || ""
      : "";
  const stories =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.stories || ""
      : "";
  const panelLocation =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.panelLocation || ""
      : "";
  const panelPhotos =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.panelPhotos || []
      : [];
  const additionalNotes =
    categoryData?.categoryId === "14"
      ? (categoryData.details as any)?.additionalNotes || ""
      : "";

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.newOrReplacement) {
      dispatch(
        updateExhaustFanDetails({
          installationType: draft.newOrReplacement as any,
        }),
      );
    }
    if (draft.locationOfExhaustFan) {
      dispatch(
        updateExhaustFanDetails({ fanType: draft.locationOfExhaustFan as any }),
      );
    }
    if (draft.isRoofOrGableFan) {
      dispatch(
        updateExhaustFanDetails({
          atticFanType: draft.isRoofOrGableFan as any,
        }),
      );
    }
    if (draft.howManyStories) {
      dispatch(
        updateExhaustFanDetails({ stories: String(draft.howManyStories) }),
      );
    }
    if (draft.willSupplyAtticFan !== undefined) {
      dispatch(
        updateExhaustFanDetails({
          existingFan: draft.willSupplyAtticFan ? "Yes" : "No",
        }),
      );
    }
    if (draft.whereElectricalPanelLocated) {
      dispatch(
        updateExhaustFanDetails({
          panelLocation: draft.whereElectricalPanelLocated,
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

  const handlePanelUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("panel");
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

  // ─── Handlers ──────────────────────────────────────────────────────────────────
  const handleInstallTypeSelect = (val: string) => {
    dispatch(updateExhaustFanDetails({ installationType: val as any }));
  };

  const handleFanLocationSelect = (val: string) => {
    dispatch(updateExhaustFanDetails({ fanType: val as any }));
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
      newOrReplacement: installType || "",
      locationOfExhaustFan: fanLocation || "",
      isRoofOrGableFan: atticFanType || "",
      howManyStories: parseInt(stories) || 0,
      willSupplyAtticFan: existingFan === "Yes",
      whereElectricalPanelLocated: panelLocation || "",
      panelPhotos: panelPhotos || [],
      additionalNotes: additionalNotes || "",
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

  const handleContinue = () => {
    router.push({
      pathname: "/(tabs)/quotes/quote/exhaust-fan/fan-photos" as any,
      params: { serviceCallId, serviceType },
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
              pathname: "/(tabs)/quotes/quote/common/project-basics",
              params: { serviceCallId, serviceType },
            })
          }
        />
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

          <AuthHeading
            title="Exhaust Fan Details"
            subtitle="Answer these exhaust-fan-specific questions"
          />

          <OptionGrid
            label="Is this a new installation or a replacement?"
            options={INSTALL_TYPES}
            selected={installType}
            onSelect={handleInstallTypeSelect}
            numColumns={1}
          />

          <OptionGrid
            label="Where is the exhaust fan located?"
            options={FAN_LOCATIONS}
            selected={fanLocation}
            onSelect={handleFanLocationSelect}
            numColumns={1}
          />

          {fanLocation === "Attic" && (
            <View>
              <OptionGrid
                label="Is it a roof or gable (wall) fan?"
                options={ATTIC_FAN_TYPES}
                selected={atticFanType}
                onSelect={(val) =>
                  dispatch(
                    updateExhaustFanDetails({ atticFanType: val as any }),
                  )
                }
                numColumns={1}
              />
              <OptionGrid
                label="Will you be supplying the attic fan?"
                options={["Yes", "No"]}
                selected={existingFan}
                onSelect={(val) =>
                  dispatch(updateExhaustFanDetails({ existingFan: val as any }))
                }
                numColumns={1}
              />
              <OptionGrid
                label="How many stories is your home?"
                options={STORIES}
                selected={stories}
                onSelect={(val) =>
                  dispatch(updateExhaustFanDetails({ stories: val }))
                }
                numColumns={1}
              />
            </View>
          )}

          <OptionGrid
            label="Where is your electrical panel located?"
            options={PANEL_LOCATIONS}
            selected={panelLocation}
            onSelect={(val) =>
              dispatch(updateExhaustFanDetails({ panelLocation: val }))
            }
            numColumns={1}
          />

          <PhotoUploadSection
            label="Upload photos of your electrical panel"
            photos={panelPhotos}
            onPhotosChange={(p) =>
              dispatch(updateExhaustFanDetails({ panelPhotos: p }))
            }
            onUploadSingle={handlePanelUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "panel"}
          />

          <TextAreaInput
            label="Additional notes (optional)"
            placeholder="Any additional information you'd like to share"
            value={additionalNotes}
            onChangeText={(text) =>
              dispatch(updateExhaustFanDetails({ additionalNotes: text }))
            }
            minHeight={80}
          />

          <GradientButton
            label="Continue"
            onPress={handleContinue}
            disabled={isSaving || uploadingSection !== null}
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
