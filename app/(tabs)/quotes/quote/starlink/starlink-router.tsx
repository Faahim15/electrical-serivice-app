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
import {
  selectCategory,
  updateStarlinkDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { StarlinkRecord } from "@/src/types/quotes/starlink.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 6;
const TOTAL_STEPS = 7;

const ROOM_CONDITIONS = [
  "Attic above",
  "Occupied space above",
  "Crawlspace (unfinished)",
  "Crawlspace (finished)",
  "Basement (unfinished)",
  "Basement (finished)",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function StarlinkRouter() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"router" | null>(
    null,
  );
  const [localRoomCondition, setLocalRoomCondition] = useState("");
  const [localRouterPhotos, setLocalRouterPhotos] = useState<string[]>([]);
  const [localRoomOfRouterIn, setLocalRoomOfRouterIn] = useState("");
  const isInitialMount = useRef(true);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Starlink Installation";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as StarlinkRecord | undefined;

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
  const reduxRoomOfRouterIn =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.roomOfRouterIn || ""
      : "";
  const reduxRoomCondition =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.roomCondition || ""
      : "";
  const reduxRouterPhotos =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.photosOfRoomForRouter || []
      : [];

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    if (reduxRoomOfRouterIn) {
      setLocalRoomOfRouterIn(reduxRoomOfRouterIn);
    }
  }, [reduxRoomOfRouterIn]);

  useEffect(() => {
    if (reduxRoomCondition) {
      setLocalRoomCondition(reduxRoomCondition);
    }
  }, [reduxRoomCondition]);

  // ─── Sync photos - use ref to prevent infinite loop ──────────────────────────
  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxRouterPhotos) !== JSON.stringify(localRouterPhotos);
    if (photosChanged && !isInitialMount.current) {
      setLocalRouterPhotos(reduxRouterPhotos);
    }
  }, [reduxRouterPhotos]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;

    if (draft.roomOfRouterIn) {
      setLocalRoomOfRouterIn(draft.roomOfRouterIn);
      dispatch(
        updateStarlinkDetails({
          roomOfRouterIn: draft.roomOfRouterIn,
        }),
      );
    }
    if (draft.roomCondition) {
      setLocalRoomCondition(draft.roomCondition);
      dispatch(
        updateStarlinkDetails({
          roomCondition: draft.roomCondition,
        }),
      );
    }
    if (draft.photosOfRoomForRouter?.length) {
      setLocalRouterPhotos(draft.photosOfRoomForRouter);
      dispatch(
        updateStarlinkDetails({
          photosOfRoomForRouter: draft.photosOfRoomForRouter,
        }),
      );
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

  const handleRouterUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("router");
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
  const handleRoomConditionSelect = (val: string) => {
    console.log("Selected room condition:", val);
    setLocalRoomCondition(val);
    dispatch(
      updateStarlinkDetails({
        roomCondition: val,
      }),
    );
  };

  const handleRouterPhotosChange = (photos: string[]) => {
    setLocalRouterPhotos(photos);
  };

  const handleRoomOfRouterChange = (text: string) => {
    setLocalRoomOfRouterIn(text);
    dispatch(
      updateStarlinkDetails({
        roomOfRouterIn: text,
      }),
    );
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
      roomOfRouterIn: localRoomOfRouterIn || "",
      roomCondition: localRoomCondition || "",
      photosOfRoomForRouter: localRouterPhotos || [],
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
    // Save latest values to Redux before navigating
    if (localRoomOfRouterIn) {
      dispatch(
        updateStarlinkDetails({
          roomOfRouterIn: localRoomOfRouterIn,
        }),
      );
    }
    if (localRoomCondition) {
      dispatch(
        updateStarlinkDetails({
          roomCondition: localRoomCondition,
        }),
      );
    }
    if (localRouterPhotos.length > 0) {
      dispatch(
        updateStarlinkDetails({
          photosOfRoomForRouter: localRouterPhotos,
        }),
      );
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/starlink/starlink-additional",
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
              pathname: "/(tabs)/quotes/quote/starlink/starlink-location",
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
            title="Router location"
            subtitle="What room do you want the WiFi router in?"
          />

          <TextAreaInput
            label="What room do you want the WiFi router in?"
            placeholder="e.g., Living room, Office, Bedroom, etc."
            value={localRoomOfRouterIn}
            onChangeText={handleRoomOfRouterChange}
            minHeight={80}
          />

          <OptionGrid
            label="What is above / below the room?"
            options={ROOM_CONDITIONS}
            selected={localRoomCondition || ""}
            onSelect={handleRoomConditionSelect}
            numColumns={1}
          />

          <PhotoUploadSection
            label="Upload photo of room to install WiFi router"
            photos={localRouterPhotos}
            onPhotosChange={handleRouterPhotosChange}
            onUploadSingle={handleRouterUploadSingle}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "router"}
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
