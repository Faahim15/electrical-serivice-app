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
import {
  selectCategory,
  updateStarlinkDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  StarlinkPhotosFormData,
  starlinkPhotosSchema,
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

const CURRENT_STEP = 5;
const TOTAL_STEPS = 8;

const LOCATION_OPTIONS = ["Roof", "Eave", "Ground"];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function StarlinkLocation() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"area" | null>(null);
  const [localDishLocation, setLocalDishLocation] = useState("");
  const [localMountingEquipment, setLocalMountingEquipment] = useState("");
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
    if (!categoryData || categoryData.categoryId !== "12") {
      dispatch(selectCategory("12"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxDishLocation =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.dishLocation || ""
      : "";
  const reduxMountingEquipment =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.haveMountingEquipment || ""
      : "";
  const reduxAreaPhotos =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.areaOfInstallationPhotos || []
      : [];
  const reduxHaveStarlinkEquipment =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.haveStarlinkEquipment || ""
      : "";
  const reduxWhenHaveEquipment =
    categoryData?.categoryId === "12"
      ? (categoryData.details as any)?.whenHaveEquipment || ""
      : "";

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
    trigger,
  } = useForm<StarlinkPhotosFormData>({
    resolver: zodResolver(starlinkPhotosSchema),
    mode: "onChange",
    defaultValues: {
      areaOfInstallationPhotos: reduxAreaPhotos || [],
    },
  });

  // ─── Sync local state with Redux (only on mount and when values actually change) ──
  useEffect(() => {
    if (reduxDishLocation) {
      const capitalized =
        reduxDishLocation.charAt(0).toUpperCase() + reduxDishLocation.slice(1);
      setLocalDishLocation(capitalized);
    }
  }, [reduxDishLocation]);

  useEffect(() => {
    if (reduxMountingEquipment) {
      setLocalMountingEquipment(reduxMountingEquipment);
    }
  }, [reduxMountingEquipment]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;

    // Set dish location from draft
    if (draft.dishLocation) {
      const capitalized =
        draft.dishLocation.charAt(0).toUpperCase() +
        draft.dishLocation.slice(1);
      setLocalDishLocation(capitalized);
      dispatch(
        updateStarlinkDetails({
          dishLocation: draft.dishLocation as any,
        }),
      );
    }

    // Set mounting equipment from draft
    if (draft.haveMountingEquipment !== undefined) {
      const value = draft.haveMountingEquipment ? "Yes" : "No";
      setLocalMountingEquipment(value);
      dispatch(
        updateStarlinkDetails({
          haveMountingEquipment: value as any,
        }),
      );
    }

    // Set photos from draft - use reset to update form
    if (draft.areaOfInstallationPhotos?.length) {
      const photos = draft.areaOfInstallationPhotos;
      // Update Redux
      dispatch(
        updateStarlinkDetails({
          areaOfInstallationPhotos: photos,
        }),
      );
      // Update form using reset
      reset({
        areaOfInstallationPhotos: photos,
      });
    }

    // Mark initial mount as complete after draft is loaded
    isInitialMount.current = false;
  }, [draft]);

  // ─── Sync Redux photos to form when they change ──────────────────────────
  useEffect(() => {
    if (reduxAreaPhotos.length > 0 && !isInitialMount.current) {
      setValue("areaOfInstallationPhotos", reduxAreaPhotos);
      trigger("areaOfInstallationPhotos");
    }
  }, [reduxAreaPhotos, setValue, trigger]);

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

  const handleAreaUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("area");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("areaOfInstallationPhotos");
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
  const handleDishLocationSelect = (val: string) => {
    setLocalDishLocation(val);
    const apiValue = val.toLowerCase();
    dispatch(
      updateStarlinkDetails({
        dishLocation: apiValue as any,
      }),
    );
  };

  const handleMountingSelect = (val: string) => {
    setLocalMountingEquipment(val);
    dispatch(
      updateStarlinkDetails({
        haveMountingEquipment: val as any,
      }),
    );
  };

  // ─── Photo change handler - updates form ──────────────────────────────────────
  const handleAreaPhotosChange = (photos: string[]) => {
    setValue("areaOfInstallationPhotos", photos);
    trigger("areaOfInstallationPhotos");
  };

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const handleSaveForLater = async () => {
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
      dishLocation:
        draft?.dishLocation || localDishLocation.toLowerCase() || "",
      haveMountingEquipment:
        draft?.haveMountingEquipment !== undefined
          ? draft.haveMountingEquipment
          : localMountingEquipment === "Yes",
      roomOfRouterIn: draft?.roomOfRouterIn || "",
      roomCondition: draft?.roomCondition || "",
      areaOfInstallationPhotos:
        draft?.areaOfInstallationPhotos || reduxAreaPhotos || [],
      photosOfRoomForRouter: draft?.photosOfRoomForRouter || [],
      additionalNotes: draft?.additionalNotes || "",

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

  // ─── Check if form is valid ──────────────────────────────────────────────
  const isFormValid = () => {
    // Only validate photos if location is Roof or Eave
    if (localDishLocation === "Roof" || localDishLocation === "Eave") {
      return isValid && uploadingSection === null && !isSaving;
    }
    // For Ground location, no photo validation needed
    return uploadingSection === null && !isSaving;
  };

  // ─── Continue handler with validation ──────────────────────────────────────
  const handleContinue = () => {
    // For Roof or Eave, validate photos
    if (localDishLocation === "Roof" || localDishLocation === "Eave") {
      handleSubmit(
        (data) => {
          // Save latest values to Redux before navigating
          if (localDishLocation) {
            dispatch(
              updateStarlinkDetails({
                dishLocation: localDishLocation.toLowerCase() as any,
              }),
            );
          }
          if (localMountingEquipment) {
            dispatch(
              updateStarlinkDetails({
                haveMountingEquipment: localMountingEquipment as any,
              }),
            );
          }
          if (data.areaOfInstallationPhotos.length > 0) {
            dispatch(
              updateStarlinkDetails({
                areaOfInstallationPhotos: data.areaOfInstallationPhotos,
              }),
            );
          }
          router.push({
            pathname: "/(tabs)/quotes/quote/starlink/starlink-router",
            params: { serviceCallId, serviceType },
          });
        },
        (errors) => {
          toast.error(
            "Please upload at least one photo of the installation area",
          );
        },
      )();
    } else {
      // For Ground location, just navigate
      // Save latest values to Redux before navigating
      if (localDishLocation) {
        dispatch(
          updateStarlinkDetails({
            dishLocation: localDishLocation.toLowerCase() as any,
          }),
        );
      }
      if (localMountingEquipment) {
        dispatch(
          updateStarlinkDetails({
            haveMountingEquipment: localMountingEquipment as any,
          }),
        );
      }
      router.push({
        pathname: "/(tabs)/quotes/quote/starlink/starlink-router",
        params: { serviceCallId, serviceType },
      });
    }
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
              pathname: "/(tabs)/quotes/quote/starlink/starLink-details",
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
            title="Dish location"
            subtitle="Where would you like the user terminal / dish installed?"
          />

          <OptionGrid
            label="Where would you like the user terminal / dish installed?"
            options={LOCATION_OPTIONS}
            selected={localDishLocation || ""}
            onSelect={handleDishLocationSelect}
            numColumns={1}
          />

          {localDishLocation && localDishLocation !== "Ground" && (
            <OptionGrid
              label="Do you have the mounting equipment?"
              options={["Yes", "No"]}
              selected={localMountingEquipment || ""}
              onSelect={handleMountingSelect}
              numColumns={1}
            />
          )}

          {(localDishLocation === "Roof" || localDishLocation === "Eave") && (
            <Controller
              control={control}
              name="areaOfInstallationPhotos"
              render={({ field: { value }, fieldState: { error } }) => (
                <View>
                  <PhotoUploadSection
                    label="Upload photo from ground of area to install user terminal / dish"
                    photos={value || []}
                    onPhotosChange={handleAreaPhotosChange}
                    onUploadSingle={handleAreaUploadSingle}
                    onDeleteSingle={deleteImageHandler}
                    isUploading={uploadingSection === "area"}
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
