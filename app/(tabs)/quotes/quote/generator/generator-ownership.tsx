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
import { updateGeneratorDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { GeneratorRecord } from "@/src/types/quotes/generator.api.types";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 5;
const TOTAL_STEPS = 7;

const KW_OUTPUTS = [
  "Small (2kW - 4kW)",
  "Medium (4kW – 7kW)",
  "Large (7kW – 10kW+)",
  "I'm not sure",
];
const BACKUP_OPTIONS = [
  "Whole panel with interlock",
  "Dedicated generator panel",
  "Unsure",
];
const PANEL_DISTANCES = [
  "Less than 25 ft",
  "25 – 55 ft",
  "50 – 100 ft",
  "More than 100 ft",
  "Unsure",
];
const PANEL_LOCATIONS = [
  "Basement (Finished)",
  "Basement (Unfinished)",
  "Garage (Finished)",
  "Garage (Unfinished)",
  "Other (please specify)",
];
const PURCHASE_SIZES = [
  "Small (2kW - 4kW)",
  "Medium (4kW – 7kW)",
  "Large (7kW – 10kW+)",
  "I'm not sure",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function GeneratorOwnership() {
  const dispatch = useDispatch();

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Generator Installation";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as GeneratorRecord | undefined;

  const { fullName, email, phone, preferredContact } = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const { streetAddress, apartment, city, state, zipCode } = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const { propertyType, ownershipStatus, timeline } = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  const hasGenerator = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "9" && data.details)
      return data.details.hasGenerator;
    return "";
  });

  const kwOutput = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "9" && data.details) return data.details.kwOutput;
    return "";
  });

  const backupInstallation = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "9" && data.details)
      return data.details.backupInstallation;
    return "";
  });

  const panelDistance = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "9" && data.details)
      return data.details.panelDistance;
    return "";
  });

  const panelLocation = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "9" && data.details)
      return data.details.panelLocation;
    return "";
  });

  const panelLocationOther = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "9" && data.details)
      return data.details.panelLocationOther;
    return "";
  });

  const purchaseSize = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "9" && data.details)
      return data.details.purchaseSize;
    return "";
  });

  const hasExisting = hasGenerator === "Yes";
  const isPurchasing = hasGenerator === "No";

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.isAlreadyHaveGenerator !== undefined) {
      dispatch(
        updateGeneratorDetails({
          hasGenerator: draft.isAlreadyHaveGenerator ? "Yes" : "No",
        }),
      );
    }
    if (draft.generatorOutputPower) {
      dispatch(
        updateGeneratorDetails({ kwOutput: draft.generatorOutputPower as any }),
      );
    }
    if (draft.preferredBackupInstallation) {
      dispatch(
        updateGeneratorDetails({
          backupInstallation: draft.preferredBackupInstallation as any,
        }),
      );
    }
    if (draft.generatorDistanceFromInletLocation) {
      dispatch(
        updateGeneratorDetails({
          panelDistance: draft.generatorDistanceFromInletLocation as any,
        }),
      );
    }
    if (draft.electricPanelLocation) {
      dispatch(
        updateGeneratorDetails({
          panelLocation: draft.electricPanelLocation as any,
        }),
      );
    }
    if (draft.sizeOfGeneratorWanted) {
      dispatch(
        updateGeneratorDetails({
          purchaseSize: draft.sizeOfGeneratorWanted as any,
        }),
      );
    }
  }, [draft]);

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
      isAlreadyHaveGenerator:
        draft?.isAlreadyHaveGenerator !== undefined
          ? draft.isAlreadyHaveGenerator
          : hasGenerator === "Yes",
      generatorOutputPower: draft?.generatorOutputPower || kwOutput || "",
      preferredBackupInstallation:
        draft?.preferredBackupInstallation || backupInstallation || "",
      generatorDistanceFromInletLocation:
        draft?.generatorDistanceFromInletLocation || panelDistance || "",
      electricPanelLocation:
        draft?.electricPanelLocation || panelLocation || "",
      sizeOfGeneratorWanted: draft?.sizeOfGeneratorWanted || purchaseSize || "",
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
              pathname: "/(tabs)/quotes/quote/generator/generator-type",
              params: { serviceCallId, serviceType },
            })
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(120) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />
          <CategoryTag title={serviceType} />

          <AuthHeading title="Generator ownership" subtitle="" />

          <OptionGrid
            label="Do you already have the generator?"
            options={["Yes", "No"]}
            selected={hasGenerator}
            onSelect={(val) =>
              dispatch(
                updateGeneratorDetails({
                  hasGenerator: val as any,
                  kwOutput: "",
                  backupInstallation: "",
                  generatorPhotos: [],
                  panelDistance: "",
                  panelLocation: "",
                  purchaseSize: "",
                }),
              )
            }
            numColumns={1}
          />

          {hasExisting && (
            <>
              <OptionGrid
                label="What is the kW output for this generator?"
                options={KW_OUTPUTS}
                selected={kwOutput}
                onSelect={(val) =>
                  dispatch(updateGeneratorDetails({ kwOutput: val as any }))
                }
                numColumns={1}
              />

              <OptionGrid
                label="What is your preferred back-up installation?"
                options={BACKUP_OPTIONS}
                selected={backupInstallation}
                onSelect={(val) =>
                  dispatch(
                    updateGeneratorDetails({ backupInstallation: val as any }),
                  )
                }
                numColumns={1}
              />

              <OptionGrid
                label="What is the approximate distance of the electrical panel from inlet location?"
                options={PANEL_DISTANCES}
                selected={panelDistance}
                onSelect={(val) =>
                  dispatch(
                    updateGeneratorDetails({ panelDistance: val as any }),
                  )
                }
                numColumns={1}
              />

              <OptionGrid
                label="Where is your electrical panel located?"
                options={PANEL_LOCATIONS}
                selected={panelLocation}
                onSelect={(val) =>
                  dispatch(
                    updateGeneratorDetails({ panelLocation: val as any }),
                  )
                }
                numColumns={1}
              />
              {panelLocation === "Other (please specify)" && (
                <TextAreaInput
                  label="Please specify location"
                  placeholder="Describe where the panel is located..."
                  value={panelLocationOther}
                  onChangeText={(text) =>
                    dispatch(
                      updateGeneratorDetails({ panelLocationOther: text }),
                    )
                  }
                />
              )}
            </>
          )}

          {isPurchasing && (
            <>
              <OptionGrid
                label="What size generator will you be purchasing?"
                options={PURCHASE_SIZES}
                selected={purchaseSize}
                onSelect={(val) =>
                  dispatch(updateGeneratorDetails({ purchaseSize: val as any }))
                }
                numColumns={1}
              />

              <OptionGrid
                label="What is your preferred back-up installation?"
                options={BACKUP_OPTIONS}
                selected={backupInstallation}
                onSelect={(val) =>
                  dispatch(
                    updateGeneratorDetails({ backupInstallation: val as any }),
                  )
                }
                numColumns={1}
              />

              <OptionGrid
                label="What is the approximate distance of the electrical panel from inlet location?"
                options={PANEL_DISTANCES}
                selected={panelDistance}
                onSelect={(val) =>
                  dispatch(
                    updateGeneratorDetails({ panelDistance: val as any }),
                  )
                }
                numColumns={1}
              />

              <OptionGrid
                label="Where is your electrical panel located?"
                options={PANEL_LOCATIONS}
                selected={panelLocation}
                onSelect={(val) =>
                  dispatch(
                    updateGeneratorDetails({ panelLocation: val as any }),
                  )
                }
                numColumns={1}
              />
              {panelLocation === "Other (please specify)" && (
                <TextAreaInput
                  label="Please specify location"
                  placeholder="Describe where the panel is located..."
                  value={panelLocationOther}
                  onChangeText={(text) =>
                    dispatch(
                      updateGeneratorDetails({ panelLocationOther: text }),
                    )
                  }
                />
              )}
            </>
          )}
          <View className="mt-[3%]">
            <GradientButton
              label="Continue"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/quotes/quote/generator/photos-needed",
                  params: { serviceCallId, serviceType },
                })
              }
              disabled={isSaving}
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
