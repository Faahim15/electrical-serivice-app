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
  updateAccessoryBuildingDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  AccessoryBuildingPhotosFormData,
  accessoryBuildingPhotosSchema,
} from "@/src/schemas/upload-photos/upload-photos.schema";
import { AccessoryBuildingRecord } from "@/src/types/quotes/accessory-building.api.types";
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

const SERVICE_TYPE = "Accessory Building / Shed Power";
const CURRENT_STEP = 10;
const TOTAL_STEPS = 12;

export default function GeneratorPhotosNeeded() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "existing" | "panel" | null
  >(null);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || SERVICE_TYPE;
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as AccessoryBuildingRecord | undefined;

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

  const getField = (key: string) =>
    useSelector((s: RootState) =>
      s.serviceForm.categoryData?.categoryId === "5"
        ? (s.serviceForm.categoryData.details as any)?.[key]
        : "",
    );

  const squareFootage = getField("squareFootage") || "";
  const intendedUse = getField("intendedUse") || "";
  const buildingStatus = getField("buildingStatus") || "";
  const constructionType = getField("constructionType") || "";
  const floorType = getField("floorType") || "";
  const electricalNeeds = getField("electricalNeeds") || "";
  const hasHeatingCooling = getField("hasHeatingCooling") || "";
  const serviceTypeSelected = getField("serviceType") || "";
  const newServiceSize = getField("newServiceSize") || "";
  const subPanelSize = getField("subPanelSize") || "";
  const circuitCount = getField("circuitCount") || "";
  const ampRating = getField("ampRating") || "";
  const panelLocation = getField("panelLocation") || "";
  const panelLocationOther = getField("panelLocationOther") || "";
  const newServiceSizeOther = getField("newServiceSizeOther") || "";
  const subPanelSizeOther = getField("subPanelSizeOther") || "";
  const privateUtilities = getField("privateUtilities") || "";
  const routeDistance = getField("routeDistance") || "";
  const hasPlans = getField("hasPlans") || "";
  const planDrawingPhotos = getField("planDrawingPhotos") || [];
  const hasPermit = getField("hasPermit") || "";
  const permitNumber = getField("permitNumber") || "";

  const isNewService = serviceTypeSelected === "New Service";
  const isSubPanel = serviceTypeSelected === "Sub-panel";
  const isDedicatedCircuits = serviceTypeSelected === "1-2 dedicated circuits";
  const resolvedServiceSize = isNewService
    ? newServiceSize === "Other"
      ? newServiceSizeOther
      : newServiceSize
    : isSubPanel
      ? subPanelSize === "Other"
        ? subPanelSizeOther
        : subPanelSize
      : isDedicatedCircuits
        ? `${circuitCount} circuit(s) @ ${ampRating}A`
        : "";
  const combinedRouteDetails = [privateUtilities, routeDistance]
    .filter(Boolean)
    .join(" | ");

  // This screen's own fields
  const existingSpacePhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.existingSpacePhotos ?? [];
    return [];
  });
  const panelPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.panelPhotos ?? [];
    return [];
  });

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<AccessoryBuildingPhotosFormData>({
    resolver: zodResolver(accessoryBuildingPhotosSchema),
    mode: "onChange",
    defaultValues: {
      existingSpacePhotos: existingSpacePhotos || [],
      panelPhotos: panelPhotos || [],
    },
  });

  // ✅ Ensure category is selected
  useEffect(() => {
    dispatch(selectCategory("5"));
  }, []);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if ((draft as any).existingSpacePhotos?.length) {
      dispatch(
        updateAccessoryBuildingDetails({
          existingSpacePhotos: (draft as any).existingSpacePhotos,
        }),
      );
      setValue("existingSpacePhotos", (draft as any).existingSpacePhotos);
    }
    if (draft.panelPhotos?.length) {
      dispatch(
        updateAccessoryBuildingDetails({ panelPhotos: draft.panelPhotos }),
      );
      setValue("panelPhotos", draft.panelPhotos);
    }
    trigger(["existingSpacePhotos", "panelPhotos"]);
  }, [draft]);

  // ─── Sync Redux state with React Hook Form ──────────────────────────────
  useEffect(() => {
    if (existingSpacePhotos.length > 0) {
      setValue("existingSpacePhotos", existingSpacePhotos);
      trigger("existingSpacePhotos");
    }
  }, [existingSpacePhotos, setValue, trigger]);

  useEffect(() => {
    if (panelPhotos.length > 0) {
      setValue("panelPhotos", panelPhotos);
      trigger("panelPhotos");
    }
  }, [panelPhotos, setValue, trigger]);

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

  const handleExistingUploadSingle = async (
    localUri: string,
  ): Promise<string> => {
    try {
      setUploadingSection("existing");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("existingSpacePhotos");
      return url;
    } catch (error) {
      console.error("[AccessoryBuilding] Existing space upload error:", error);
      toast.error("Failed to upload photo. Please try again.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  const handlePanelUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("panel");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      trigger("panelPhotos");
      return url;
    } catch (error) {
      console.error("[AccessoryBuilding] Panel upload error:", error);
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
      entireSquareFootage:
        draft?.entireSquareFootage || Number(squareFootage) || 0,
      intendedUse: draft?.intendedUse || intendedUse || "",
      buildingStatus: draft?.buildingStatus || buildingStatus || "",
      constructionType: draft?.constructionType || constructionType || "",
      floorType: draft?.floorType || floorType || "",
      electricalNeeds: draft?.electricalNeeds || electricalNeeds || "",
      hasHeatingOrCooling:
        draft?.hasHeatingOrCooling !== undefined
          ? draft.hasHeatingOrCooling
          : hasHeatingCooling === "Yes",
      electricalServiceType:
        draft?.electricalServiceType || serviceTypeSelected || "",
      serviceSize: draft?.serviceSize || resolvedServiceSize || "",
      panelLocation:
        draft?.panelLocation ||
        (panelLocation === "Other (please specify)"
          ? panelLocationOther
          : panelLocation) ||
        "",
      routeDetails: draft?.routeDetails || combinedRouteDetails || "",
      hasPlansDrawings:
        draft?.hasPlansDrawings !== undefined
          ? draft.hasPlansDrawings
          : hasPlans === "Yes",
      plansDrawings:
        (draft?.plansDrawings?.length ?? 0) > 0
          ? draft!.plansDrawings
          : planDrawingPhotos || [],
      permitApplied:
        draft?.permitApplied !== undefined
          ? draft.permitApplied
          : hasPermit === "Yes",
      permitNumber: draft?.permitNumber || permitNumber || "",
      existingSpacePhotos:
        (draft?.existingSpacePhotos?.length ?? 0) > 0
          ? draft!.existingSpacePhotos
          : existingSpacePhotos || [],
      panelPhotos:
        (draft?.panelPhotos?.length ?? 0) > 0
          ? draft!.panelPhotos
          : panelPhotos || [],
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
  const handleContinue = async (data: AccessoryBuildingPhotosFormData) => {
    router.push({
      pathname: "/(tabs)/quotes/quote/accessory-building/additional-info",
      params: { serviceType, serviceCallId },
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
              pathname: "/(tabs)/quotes/quote/accessory-building/plans-permit",
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
          <AuthHeading title="Photos needed" subtitle="" />

          {/* Existing Space Photos with Controller */}
          <Controller
            control={control}
            name="existingSpacePhotos"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload photos of route"
                  photos={value || []}
                  onPhotosChange={(p) => {
                    dispatch(
                      updateAccessoryBuildingDetails({
                        existingSpacePhotos: p,
                      }),
                    );
                    setValue("existingSpacePhotos", p);
                    trigger("existingSpacePhotos");
                  }}
                  onUploadSingle={handleExistingUploadSingle}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "existing"}
                />
                {error && (
                  <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          {/* Panel Photos with Controller */}
          <Controller
            control={control}
            name="panelPhotos"
            render={({ field: { value }, fieldState: { error } }) => (
              <View className="mt-1">
                <PhotoUploadSection
                  label="Please upload clear photo of electrical panel up close so we can see the numbers and about 10 ft away."
                  photos={value || []}
                  onPhotosChange={(p) => {
                    dispatch(
                      updateAccessoryBuildingDetails({ panelPhotos: p }),
                    );
                    setValue("panelPhotos", p);
                    trigger("panelPhotos");
                  }}
                  onUploadSingle={handlePanelUploadSingle}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "panel"}
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
