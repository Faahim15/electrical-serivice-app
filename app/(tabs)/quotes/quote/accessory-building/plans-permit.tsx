import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
import PhotoUploadSection from "@/src/components/quote/PhotoUploadSection";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import CustomInput from "@/src/components/shared/CustomInput";
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
import { AccessoryBuildingRecord } from "@/src/types/quotes/accessory-building.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const SERVICE_TYPE = "Accessory Building / Shed Power";
const CURRENT_STEP = 9;
const TOTAL_STEPS = 12;

export default function PlansPermit() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"plans" | null>(
    null,
  );

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
  const hasPlans = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details) return data.details.hasPlans;
    return "" as const;
  });

  const planDrawingPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.planDrawingPhotos ?? [];
    return [];
  });

  const hasPermit = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details) return data.details.hasPermit;
    return "" as const;
  });

  const permitNumber = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.permitNumber;
    return "";
  });

  // ✅ Ensure category is selected
  useEffect(() => {
    dispatch(selectCategory("5"));
  }, []);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.hasPlansDrawings !== undefined) {
      dispatch(
        updateAccessoryBuildingDetails({
          hasPlans: draft.hasPlansDrawings ? "Yes" : "No",
        }),
      );
    }
    if (draft.permitApplied !== undefined) {
      dispatch(
        updateAccessoryBuildingDetails({
          hasPermit: draft.permitApplied ? "Yes" : "No",
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

  const handlePlansUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("plans");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      return url;
    } catch (error) {
      console.error("[AccessoryBuilding] Plans upload error:", error);
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
    } catch (err: any) {
      console.log(err.data);
      toast.error("Failed to save draft. Please try again.");
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
              pathname: "/(tabs)/quotes/quote/accessory-building/route-details",
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
          <AuthHeading title="Plans, Permit & Timeline" subtitle="" />

          <OptionGrid
            key={`plans-${hasPlans}`}
            label="Do you have any plans/drawings for the accessory building?"
            options={["Yes", "No"]}
            selected={hasPlans}
            onSelect={(val) => {
              dispatch(
                updateAccessoryBuildingDetails({
                  hasPlans: val as any,
                  planDrawingPhotos: [],
                }),
              );
            }}
            numColumns={1}
          />

          {hasPlans === "Yes" && (
            <PhotoUploadSection
              key={`plans-photos-${planDrawingPhotos.length}`}
              label="Please Upload the plans Drawing"
              photos={planDrawingPhotos}
              onPhotosChange={(p) =>
                dispatch(
                  updateAccessoryBuildingDetails({ planDrawingPhotos: p }),
                )
              }
              onUploadSingle={handlePlansUploadSingle}
              onDeleteSingle={deleteImageHandler}
              isUploading={uploadingSection === "plans"}
            />
          )}

          <OptionGrid
            key={`permit-${hasPermit}`}
            label="Has a permit been applied for?"
            options={["Yes", "No"]}
            selected={hasPermit}
            onSelect={(val) => {
              dispatch(
                updateAccessoryBuildingDetails({
                  hasPermit: val as any,
                  permitNumber: "",
                }),
              );
            }}
            numColumns={1}
          />

          {hasPermit === "Yes" && (
            <CustomInput
              key="permit-number"
              label="What is your permit number?"
              textInputConfig={{
                placeholder: "Permit number",
                keyboardType: "numeric",
                value: permitNumber,
                onChangeText: (text) =>
                  dispatch(
                    updateAccessoryBuildingDetails({ permitNumber: text }),
                  ),
              }}
            />
          )}
          <View className="mt-[3%]">
            <GradientButton
              label="Continue"
              onPress={() =>
                router.push({
                  pathname:
                    "/(tabs)/quotes/quote/accessory-building/photos-needed",
                  params: { serviceType, serviceCallId },
                })
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
