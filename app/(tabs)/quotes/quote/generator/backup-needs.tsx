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

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function BackupNeeds() {
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

  const generatorDetails = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "9" && data.details) {
      return data.details;
    }
    return null;
  });

  const backedUpCircuits = generatorDetails?.backedUpCircuits || "";
  const hasPropane = generatorDetails?.hasPropane || "";
  const panelLocation = generatorDetails?.panelLocation || "";
  const panelLocationOther = generatorDetails?.panelLocationOther || "";
  const generatorType = generatorDetails?.generatorType || "";

  const isWholeHomeStandby = generatorType === "Whole Home Standby";

  const PANEL_LOCATION_OPTIONS = [
    "Basement (Finished)",
    "Basement (Unfinished)",
    "Garage (Finished)",
    "Garage (Unfinished)",
    "Other (please specify)",
  ];

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.backupNeeds) {
      dispatch(updateGeneratorDetails({ backedUpCircuits: draft.backupNeeds }));
    }
    if (draft.isHavePropane !== undefined) {
      dispatch(
        updateGeneratorDetails({
          hasPropane: draft.isHavePropane ? "Yes" : "No",
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
      backupNeeds: draft?.backupNeeds || backedUpCircuits || "",
      isHavePropane:
        draft?.isHavePropane !== undefined
          ? draft.isHavePropane
          : hasPropane === "Yes",
      electricPanelLocation:
        draft?.electricPanelLocation || panelLocation || "",
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
          contentContainerStyle={{ paddingBottom: verticalScale(132) }}
        >
          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
          />

          <CategoryTag title={serviceType} />

          <AuthHeading title="Backup needs" subtitle="" />

          <TextAreaInput
            label="What circuits would you like backed up?"
            placeholder="Type here"
            value={backedUpCircuits}
            onChangeText={(text) =>
              dispatch(updateGeneratorDetails({ backedUpCircuits: text }))
            }
            minHeight={120}
          />

          <OptionGrid
            label="Do you have propane on the property already?"
            options={["Yes", "No"]}
            selected={hasPropane}
            onSelect={(val) =>
              dispatch(
                updateGeneratorDetails({
                  hasPropane: val as any,
                }),
              )
            }
            numColumns={1}
          />

          {isWholeHomeStandby && (
            <View className="mt-[4%]">
              <OptionGrid
                label="Where is your electrical panel located?"
                options={PANEL_LOCATION_OPTIONS}
                selected={panelLocation}
                onSelect={(val) => {
                  dispatch(
                    updateGeneratorDetails({
                      panelLocation: val as any,
                    }),
                  );
                }}
                numColumns={1}
              />

              {panelLocation === "Other (please specify)" && (
                <View className="mt-[3%]">
                  <TextAreaInput
                    label="Please specify panel location"
                    value={panelLocationOther}
                    placeholder="Type here"
                    onChangeText={(text) =>
                      dispatch(
                        updateGeneratorDetails({
                          panelLocationOther: text,
                        }),
                      )
                    }
                  />
                </View>
              )}
            </View>
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
