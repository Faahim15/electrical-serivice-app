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
import {
  StarlinkRouterFormData,
  starlinkRouterSchema,
} from "@/src/schemas/upload-photos/upload-photos.schema";
import { StarlinkRecord } from "@/src/types/quotes/starlink.api.types";
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

const CURRENT_STEP = 6;
const TOTAL_STEPS = 8;

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
  const [localRoomOfRouterIn, setLocalRoomOfRouterIn] = useState("");
  const isInitialMount = useRef(true);
  const isUpdatingFromRedux = useRef(false);

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
    if (!categoryData || categoryData.categoryId !== "12") {
      dispatch(selectCategory("12"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxRoomOfRouterIn =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.roomOfRouterIn || ""
      : "";
  const reduxRoomCondition =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.roomCondition || ""
      : "";
  const reduxRouterPhotos =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.photosOfRoomForRouter || []
      : [];
  const reduxHaveStarlinkEquipment =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.haveStarlinkEquipment || ""
      : "";
  const reduxWhenHaveEquipment =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.whenHaveEquipment || ""
      : "";
  const reduxDishLocation =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.dishLocation || ""
      : "";
  const reduxHaveMountingEquipment =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.haveMountingEquipment || ""
      : "";
  const reduxAreaPhotos =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.areaOfInstallationPhotos || []
      : [];
  const reduxAdditionalNotes =
    categoryData?.categoryId === "12"
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
  } = useForm<StarlinkRouterFormData>({
    resolver: zodResolver(starlinkRouterSchema),
    mode: "onChange",
    defaultValues: {
      photosOfRoomForRouter: reduxRouterPhotos || [],
    },
  });

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

  // ─── Sync photos from Redux to form ──────────────────────────────────────────
  useEffect(() => {
    if (reduxRouterPhotos.length > 0 && !isInitialMount.current) {
      isUpdatingFromRedux.current = true;
      setValue("photosOfRoomForRouter", reduxRouterPhotos);
      trigger("photosOfRoomForRouter");
      setTimeout(() => {
        isUpdatingFromRedux.current = false;
      }, 0);
    }
  }, [reduxRouterPhotos, setValue, trigger]);

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
      const photos = draft.photosOfRoomForRouter;
      dispatch(
        updateStarlinkDetails({
          photosOfRoomForRouter: photos,
        }),
      );
      // Update form using reset
      reset({
        photosOfRoomForRouter: photos,
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

  const handleRouterUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("router");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("photosOfRoomForRouter");
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
    setLocalRoomCondition(val);
    dispatch(
      updateStarlinkDetails({
        roomCondition: val,
      }),
    );
  };

  const handleRouterPhotosChange = (photos: string[]) => {
    // Only update if not coming from Redux sync
    if (!isUpdatingFromRedux.current) {
      setValue("photosOfRoomForRouter", photos);
      trigger("photosOfRoomForRouter");
    }
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
    const currentPhotos = control._formValues.photosOfRoomForRouter || [];

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

      // Starlink Specific Fields
      haveStarlinkEquipment:
        draft?.haveStarlinkEquipment !== undefined
          ? draft.haveStarlinkEquipment
          : reduxHaveStarlinkEquipment === "Yes",
      whenHaveEquipment:
        draft?.whenHaveEquipment || reduxWhenHaveEquipment || "",
      dishLocation: draft?.dishLocation || reduxDishLocation || "",
      haveMountingEquipment:
        draft?.haveMountingEquipment !== undefined
          ? draft.haveMountingEquipment
          : reduxHaveMountingEquipment === "Yes",
      roomOfRouterIn: draft?.roomOfRouterIn || localRoomOfRouterIn || "",
      roomCondition: draft?.roomCondition || localRoomCondition || "",
      areaOfInstallationPhotos:
        draft?.areaOfInstallationPhotos || reduxAreaPhotos || [],
      photosOfRoomForRouter:
        draft?.photosOfRoomForRouter || currentPhotos || [],
      additionalNotes: draft?.additionalNotes || reduxAdditionalNotes || "",

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
  const handleContinue = async (data: StarlinkRouterFormData) => {
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
    if (data.photosOfRoomForRouter.length > 0) {
      dispatch(
        updateStarlinkDetails({
          photosOfRoomForRouter: data.photosOfRoomForRouter,
        }),
      );
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/starlink/starlink-additional",
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
              pathname: "/(tabs)/quotes/quote/starlink/starlink-location",
              params: { serviceCallId, serviceType },
            })
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(122) }}
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

          <Controller
            control={control}
            name="photosOfRoomForRouter"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload photo of room to install WiFi router"
                  photos={value || []}
                  onPhotosChange={handleRouterPhotosChange}
                  onUploadSingle={handleRouterUploadSingle}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "router"}
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
