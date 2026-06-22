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
import TextAreaInput from "@/src/components/shared/TextAreaInput";
import { useDraftDetails } from "@/src/hook/useDraftDetails";
import { useDraftSave } from "@/src/hook/useDraftSave";
import {
  useDeleteImageMutation,
  useUploadImagesMutation,
} from "@/src/redux/api-slices/quote/quote-api";
import { updateLightingDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { LightingRecord } from "@/src/types/quotes/lighting.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 5;
const TOTAL_STEPS = 6;

const FIXTURE_WEIGHTS = ["less than 15 lbs", "greater than 15 lbs"];
const FIXTURE_KINDS = [
  "Surface Mount",
  "Recessed",
  "Chain hung chandelier",
  "Pendant (Chain)",
  "Crystal Chandelier",
  "Pendant (Rod)",
  "Pendant (Cord)",
];
const SWITCH_KINDS = [
  "Standard (Toggle)",
  "Smart",
  "Standard (Rocker/Decorator)",
  "Dimmer (Rocker/Decorator)",
  "Dimmer (Toggle)",
  "Motion",
  "Timer",
  "I'll provide my own",
];

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function LightingInterior() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "new" | "current" | "fixture" | null
  >(null);
  const [localPhotosNew, setLocalPhotosNew] = useState<string[]>([]);
  const [localPhotosCurrent, setLocalPhotosCurrent] = useState<string[]>([]);
  const [localPhotosFixture, setLocalPhotosFixture] = useState<string[]>([]);
  const isInitialMount = useRef(true);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Lighting";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as LightingRecord | undefined;

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
  const lightingType =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.lightingType || ""
      : "";

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const reduxPhotosNew =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.photosOfWhereWantToInstall || []
      : [];
  const reduxPhotosCurrent =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.photosOfCurrentLightFixture || []
      : [];
  const reduxPhotosFixture =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.photosOfNewLightFixture || []
      : [];

  const reduxFixtureWeight =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.fixtureWeight || ""
      : "";
  const reduxFixtureKind =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.fixtureKind || ""
      : "";
  const reduxComplexAssembly =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.complexAssembly || ""
      : "";
  const reduxInteriorInstallType =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.interiorInstallType || ""
      : "";
  const reduxCeilingHeight =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.ceilingHeight || ""
      : "";
  const reduxProvidingFixture =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.providingFixture || ""
      : "";
  const reduxFixtureDetails =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.fixtureDetails || ""
      : "";
  const reduxSwitchNewExisting =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.switchNewExisting || ""
      : "";
  const reduxUpgradeSwitch =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.upgradeSwitch || ""
      : "";
  const reduxSwitchKind =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.switchKind || ""
      : "";
  const reduxMultiSwitch =
    categoryData?.categoryId === "17"
      ? (categoryData.details as any)?.multiSwitch || ""
      : "";

  // ─── Sync local state with Redux ────────────────────────────────────────────
  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxPhotosNew) !== JSON.stringify(localPhotosNew);
    if (photosChanged && !isInitialMount.current) {
      setLocalPhotosNew(reduxPhotosNew);
    }
  }, [reduxPhotosNew]);

  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxPhotosCurrent) !== JSON.stringify(localPhotosCurrent);
    if (photosChanged && !isInitialMount.current) {
      setLocalPhotosCurrent(reduxPhotosCurrent);
    }
  }, [reduxPhotosCurrent]);

  useEffect(() => {
    const photosChanged =
      JSON.stringify(reduxPhotosFixture) !== JSON.stringify(localPhotosFixture);
    if (photosChanged && !isInitialMount.current) {
      setLocalPhotosFixture(reduxPhotosFixture);
    }
  }, [reduxPhotosFixture]);

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.photosOfWhereWantToInstall?.length) {
      setLocalPhotosNew(draft.photosOfWhereWantToInstall);
      dispatch(
        updateLightingDetails({
          photosOfWhereWantToInstall: draft.photosOfWhereWantToInstall,
        }),
      );
    }
    if (draft.photosOfCurrentLightFixture?.length) {
      setLocalPhotosCurrent(draft.photosOfCurrentLightFixture);
      dispatch(
        updateLightingDetails({
          photosOfCurrentLightFixture: draft.photosOfCurrentLightFixture,
        }),
      );
    }
    if (draft.photosOfNewLightFixture?.length) {
      setLocalPhotosFixture(draft.photosOfNewLightFixture);
      dispatch(
        updateLightingDetails({
          photosOfNewLightFixture: draft.photosOfNewLightFixture,
        }),
      );
    }
    if (draft.isFixtureHaveComplexAssembly !== undefined) {
      dispatch(
        updateLightingDetails({
          complexAssembly: draft.isFixtureHaveComplexAssembly ? "Yes" : "No",
        }),
      );
    }
    if (draft.isNewOrReplacement) {
      dispatch(
        updateLightingDetails({
          interiorInstallType: draft.isNewOrReplacement,
        }),
      );
    }
    if (draft.tallOfCeiling) {
      dispatch(updateLightingDetails({ ceilingHeight: draft.tallOfCeiling }));
    }
    if (draft.willProvideNewLight !== undefined) {
      dispatch(
        updateLightingDetails({
          providingFixture: draft.willProvideNewLight ? "Yes" : "No",
        }),
      );
    }
    if (draft.detailsOnTypeOfFixture) {
      dispatch(
        updateLightingDetails({ fixtureDetails: draft.detailsOnTypeOfFixture }),
      );
    }
    if (draft.fixtureConnectedToNewOrExistingSwitch) {
      dispatch(
        updateLightingDetails({
          switchNewExisting: draft.fixtureConnectedToNewOrExistingSwitch,
        }),
      );
    }
    if (draft.wantToUpgradeSwitch !== undefined) {
      dispatch(
        updateLightingDetails({
          upgradeSwitch: draft.wantToUpgradeSwitch ? "Yes" : "No",
        }),
      );
    }
    if (draft.kindOfSwitchWant) {
      dispatch(updateLightingDetails({ switchKind: draft.kindOfSwitchWant }));
    }
    if (draft.moreThanOneSwitchLocation !== undefined) {
      dispatch(
        updateLightingDetails({
          multiSwitch: draft.moreThanOneSwitchLocation ? "Yes" : "No",
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

  const handleUploadSingle = async (
    localUri: string,
    section: "new" | "current" | "fixture",
  ): Promise<string> => {
    try {
      setUploadingSection(section);
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
      lightingType: lightingType || "Interior Lighting",
      photosOfWhereWantToInstall: localPhotosNew || [],
      photosOfCurrentLightFixture: localPhotosCurrent || [],
      photosOfNewLightFixture: localPhotosFixture || [],
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
    // Save all values to Redux before navigating
    if (localPhotosNew.length > 0) {
      dispatch(
        updateLightingDetails({ photosOfWhereWantToInstall: localPhotosNew }),
      );
    }
    if (localPhotosCurrent.length > 0) {
      dispatch(
        updateLightingDetails({
          photosOfCurrentLightFixture: localPhotosCurrent,
        }),
      );
    }
    if (localPhotosFixture.length > 0) {
      dispatch(
        updateLightingDetails({ photosOfNewLightFixture: localPhotosFixture }),
      );
    }
    router.push({
      pathname: "/(tabs)/quotes/quote/lighting/lighting-additional",
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
              pathname: "/(tabs)/quotes/quote/lighting/lighting-type",
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

          <AuthHeading title="Interior Lighting Details" subtitle="" />

          <OptionGrid
            label="What type of interior lighting fixture(s) will be installed?"
            options={FIXTURE_WEIGHTS}
            selected={reduxFixtureWeight}
            onSelect={(val) =>
              dispatch(updateLightingDetails({ fixtureWeight: val }))
            }
            numColumns={1}
          />

          <OptionGrid
            label="What kind of light fixture(s) will be installed?"
            options={FIXTURE_KINDS}
            selected={reduxFixtureKind}
            onSelect={(val) =>
              dispatch(updateLightingDetails({ fixtureKind: val }))
            }
            numColumns={2}
          />

          <OptionGrid
            label="Does your fixture(s) have a complex assembly?"
            options={["Yes", "No"]}
            selected={reduxComplexAssembly}
            onSelect={(val) =>
              dispatch(updateLightingDetails({ complexAssembly: val }))
            }
            numColumns={1}
          />

          <OptionGrid
            label="Is this a new install or replacement light fixture(s)?"
            options={["New Installation", "Replacement"]}
            selected={reduxInteriorInstallType}
            onSelect={(val) =>
              dispatch(updateLightingDetails({ interiorInstallType: val }))
            }
            numColumns={1}
          />

          <PhotoUploadSection
            label="Upload photos of the area where you want light fixture(s) installed"
            photos={localPhotosNew}
            onPhotosChange={(p) => {
              setLocalPhotosNew(p);
              dispatch(
                updateLightingDetails({ photosOfWhereWantToInstall: p }),
              );
            }}
            onUploadSingle={(uri) => handleUploadSingle(uri, "new")}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "new"}
          />

          <PhotoUploadSection
            label="Upload photos of current light fixture(s)"
            photos={localPhotosCurrent}
            onPhotosChange={(p) => {
              setLocalPhotosCurrent(p);
              dispatch(
                updateLightingDetails({ photosOfCurrentLightFixture: p }),
              );
            }}
            onUploadSingle={(uri) => handleUploadSingle(uri, "current")}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "current"}
          />

          <CustomInput
            label="How tall is the ceiling where the light(s) will be installed?"
            textInputConfig={{
              placeholder: "Enter ceiling height",
              value: reduxCeilingHeight,
              onChangeText: (text) =>
                dispatch(updateLightingDetails({ ceilingHeight: text })),
            }}
          />

          <OptionGrid
            label="Will you be providing the new light fixture(s)?"
            options={["Yes", "No"]}
            selected={reduxProvidingFixture}
            onSelect={(val) =>
              dispatch(updateLightingDetails({ providingFixture: val }))
            }
            numColumns={1}
          />

          <PhotoUploadSection
            label="Upload photo(s) of your new light fixture(s)"
            photos={localPhotosFixture}
            onPhotosChange={(p) => {
              setLocalPhotosFixture(p);
              dispatch(updateLightingDetails({ photosOfNewLightFixture: p }));
            }}
            onUploadSingle={(uri) => handleUploadSingle(uri, "fixture")}
            onDeleteSingle={deleteImageHandler}
            isUploading={uploadingSection === "fixture"}
          />

          <TextAreaInput
            label="Please provide details on the type of fixture(s) you want provided"
            placeholder="Enter fixture details..."
            value={reduxFixtureDetails}
            onChangeText={(text) =>
              dispatch(updateLightingDetails({ fixtureDetails: text }))
            }
            minHeight={80}
          />

          <OptionGrid
            label="Will the fixture(s) be connected to a new or existing switch?"
            options={["New", "Existing"]}
            selected={reduxSwitchNewExisting}
            onSelect={(val) =>
              dispatch(updateLightingDetails({ switchNewExisting: val }))
            }
            numColumns={1}
          />

          <OptionGrid
            label="What kind of switch do you want installed?"
            options={SWITCH_KINDS}
            selected={reduxSwitchKind}
            onSelect={(val) =>
              dispatch(updateLightingDetails({ switchKind: val }))
            }
            numColumns={2}
          />

          <OptionGrid
            label="Do you want to upgrade your switch?"
            options={["Yes", "No"]}
            selected={reduxUpgradeSwitch}
            onSelect={(val) =>
              dispatch(updateLightingDetails({ upgradeSwitch: val }))
            }
            numColumns={1}
          />

          <OptionGrid
            label="Will there be more than one switch location?"
            options={["Yes", "No"]}
            selected={reduxMultiSwitch}
            onSelect={(val) =>
              dispatch(updateLightingDetails({ multiSwitch: val }))
            }
            numColumns={1}
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
