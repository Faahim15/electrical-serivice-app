import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
import OptionGrid from "@/src/components/quote/OptionGrid";
import { CategoryTag } from "@/src/components/quote/review/CategoryTag";
import BackButton from "@/src/components/shared/BackButton";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import StepProgressBar from "@/src/components/shared/StepProgressBar";
import TextAreaInput from "@/src/components/shared/TextAreaInput";
import { useDraftDetails } from "@/src/hooks/useDraftDetails";
import { useDraftSave } from "@/src/hooks/useDraftSave";
import {
  selectCategory,
  updateAccessoryBuildingDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { AccessoryBuildingRecord } from "@/src/types/quotes/accessory-building.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const SERVICE_TYPE = "Accessory Building / Shed Power";
const CURRENT_STEP = 6;
const TOTAL_STEPS = 12;

export default function ElectricalNeeds() {
  const dispatch = useDispatch();

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

  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const { propertyType, ownershipStatus, timeline } = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  const squareFootage = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.squareFootage;
    return "";
  });

  const intendedUse = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.intendedUse;
    return "";
  });

  const buildingStatus = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.buildingStatus;
    return "";
  });

  const constructionType = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.constructionType;
    return "";
  });

  const floorType = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details) return data.details.floorType;
    return "";
  });

  const electricalNeeds = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.electricalNeeds;
    return "";
  });

  const hasHeatingCooling = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "5" && data.details)
      return data.details.hasHeatingCooling;
    return "" as const;
  });

  // ✅ Ensure category is selected
  useEffect(() => {
    dispatch(selectCategory("5"));
  }, []);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if ((draft as any).electricalNeeds) {
      dispatch(
        updateAccessoryBuildingDetails({
          electricalNeeds: (draft as any).electricalNeeds,
        }),
      );
    }
    if (draft.hasHeatingOrCooling !== undefined) {
      dispatch(
        updateAccessoryBuildingDetails({
          hasHeatingCooling: draft.hasHeatingOrCooling ? "Yes" : "No",
        }),
      );
    }
  }, [draft]);

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

  return (
    <ScreenWrapper paddingHorizontal={20}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BackButton
          onPress={() =>
            router.push({
              pathname:
                "/(tabs)/quotes/quote/accessory-building/construction-details",
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
          <AuthHeading title="Electrical needs" subtitle="" />

          <TextAreaInput
            label="What are the electrical needs for the accessory building?"
            placeholder="Describe lighting, outlets, equipment, etc."
            value={electricalNeeds}
            onChangeText={(text) =>
              dispatch(
                updateAccessoryBuildingDetails({ electricalNeeds: text }),
              )
            }
            minHeight={120}
          />

          <OptionGrid
            label="Will there be any heating or cooling equipment in the accessory building?"
            options={["Yes", "No"]}
            selected={hasHeatingCooling}
            onSelect={(val) =>
              dispatch(
                updateAccessoryBuildingDetails({
                  hasHeatingCooling: val as any,
                }),
              )
            }
            numColumns={1}
          />
          <View className="mt-[3%]">
            <GradientButton
              label="Continue"
              onPress={() =>
                router.push({
                  pathname:
                    "/(tabs)/quotes/quote/accessory-building/service-type",
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
