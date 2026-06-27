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
import { StarlinkRecord } from "@/src/types/quotes/starlink.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 5;
const TOTAL_STEPS = 7;

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
  const [localAreaPhotos, setLocalAreaPhotos] = useState<string[]>([]);
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
  const reduxDishLocation =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.dishLocation || ""
      : "";
  const reduxMountingEquipment =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.haveMountingEquipment || ""
      : "";
  const reduxAreaPhotos =
    categoryData?.categoryId === "13"
      ? (categoryData.details as any)?.areaOfInstallationPhotos || []
      : [];

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

  // ─── Sync photos - use ref to prevent infinite loop ──────────────────────────
  useEffect(() => {
    // Only sync if photos are different and not during initial mount
    const photosChanged =
      JSON.stringify(reduxAreaPhotos) !== JSON.stringify(localAreaPhotos);
    if (photosChanged && !isInitialMount.current) {
      setLocalAreaPhotos(reduxAreaPhotos);
    }
  }, [reduxAreaPhotos]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;

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
    if (draft.haveMountingEquipment !== undefined) {
      const value = draft.haveMountingEquipment ? "Yes" : "No";
      setLocalMountingEquipment(value);
      dispatch(
        updateStarlinkDetails({
          haveMountingEquipment: value as any,
        }),
      );
    }
    if (draft.areaOfInstallationPhotos?.length) {
      setLocalAreaPhotos(draft.areaOfInstallationPhotos);
      dispatch(
        updateStarlinkDetails({
          areaOfInstallationPhotos: draft.areaOfInstallationPhotos,
        }),
      );
    }

    // Mark initial mount as complete after draft is loaded
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

  const handleAreaUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("area");
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

  // ─── Photo change handler - updates local state only ──────────────────────
  const handleAreaPhotosChange = (photos: string[]) => {
    setLocalAreaPhotos(photos);
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
      dishLocation: localDishLocation.toLowerCase() || "",
      haveMountingEquipment: localMountingEquipment === "Yes",
      areaOfInstallationPhotos: localAreaPhotos || [],
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

  // ─── Continue handler ────────────────────────────────────────────────────────
  const handleContinue = () => {
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
    if (localAreaPhotos.length > 0) {
      dispatch(
        updateStarlinkDetails({
          areaOfInstallationPhotos: localAreaPhotos,
        }),
      );
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/starlink/starlink-router",
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
              pathname: "/(tabs)/quotes/quote/starlink/starLink-details",
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
            <PhotoUploadSection
              label="Upload photo from ground of area to install user terminal / dish"
              photos={localAreaPhotos}
              onPhotosChange={handleAreaPhotosChange}
              onUploadSingle={handleAreaUploadSingle}
              onDeleteSingle={deleteImageHandler}
              isUploading={uploadingSection === "area"}
            />
          )}

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
