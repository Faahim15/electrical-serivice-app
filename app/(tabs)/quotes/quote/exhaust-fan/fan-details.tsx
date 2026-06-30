import AuthHeading from "@/src/components/auth/AuthHeading";
import SavedEditAction from "@/src/components/common/SavedButton";
import { GradientButton } from "@/src/components/onboarding/GradientButton";
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
  updateExhaustFanDetails,
} from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  ExhaustFanPhotosFormData,
  exhaustFanPhotosSchema,
} from "@/src/schemas/upload-photos/upload-photos.schema";
import { ExhaustFanRecord } from "@/src/types/quotes/exhaust-fan.api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

// ─── Import reusable components ──────────────────────────────────────────────
import {
  AnimatedOption,
  ExhaustFanSections,
  Label,
  OtherInput,
  RowOption,
  SectionCard,
} from "@/src/components/exhaust-fan";
import { verticalScale } from "@/src/utils/Scaling";

const CURRENT_STEP = 4;
const TOTAL_STEPS = 7;

type InstallType = "New Installation" | "Replacement";
type FanLocation = "Attic" | "Kitchen" | "Bathroom";
type PanelLocation =
  | "Basement (Finished)"
  | "Basement (Unfinished)"
  | "Garage (Finished)"
  | "Garage (Unfinished)"
  | "Other";

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function FanDetails() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Exhaust Fan";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as ExhaustFanRecord | undefined;

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
    if (!categoryData || categoryData.categoryId !== "14") {
      dispatch(selectCategory("14"));
    }
  }, []);

  // ─── Get values from Redux ───────────────────────────────────────────────────
  const getValue = (field: string) => {
    if (categoryData?.categoryId === "14") {
      return (categoryData.details as any)?.[field] ?? "";
    }
    return "";
  };

  const getArrayValue = (field: string) => {
    if (categoryData?.categoryId === "14") {
      return (categoryData.details as any)?.[field] ?? [];
    }
    return [];
  };

  // Common fields
  const installType = getValue("installationType");
  const fanLocation = getValue("fanType");
  const fanLocationText = getValue("fanLocation");
  const additionalNotes = getValue("additionalNotes");

  // Attic specific
  const atticFanType = getValue("atticFanType");
  const stories = getValue("stories");
  const existingFan = getValue("existingFan");
  const photosNewFan = getArrayValue("photosNewFan");
  const photosAtticLocation = getArrayValue("photosAtticLocation");
  const supplyingAtticFan = getValue("supplyingAtticFan");

  // Kitchen specific
  const kitchenDuctInfo = getValue("kitchenDuctInfo");
  const kitchenYesNo = getValue("kitchenYesNo");
  const kitchenFanType = getValue("kitchenFanType");
  const kitchenAreas = getArrayValue("kitchenAreas");
  const kitchenAreaOther = getValue("kitchenAreaOther");
  const kitchenDist = getValue("kitchenDist");
  const photosKitchenLocation = getArrayValue("photosKitchenLocation");
  const photosKitchenCurrentFan = getArrayValue("photosKitchenCurrentFan");
  const photosKitchenNewFan = getArrayValue("photosKitchenNewFan");

  // Bathroom specific
  const bathroomDuctInfo = getValue("bathroomDuctInfo");
  const bathroomYesNo = getValue("bathroomYesNo");
  const bathroomFanType = getValue("bathroomFanType");
  const specialtyControl = getValue("specialtyControl");
  const bathroomAreas = getArrayValue("bathroomAreas");
  const bathroomAreaOther = getValue("bathroomAreaOther");
  const bathroomDist = getValue("bathroomDist");
  const photosBathromlocation = getArrayValue("photosBathromlocation");
  const photosBathroomCurrentFan = getArrayValue("photosBathroomCurrentFan");
  const photosBathroomNewFan = getArrayValue("photosBathroomNewFan");

  // Panel location
  const panelLocation = getValue("panelLocation");
  const panelLocationOther = getValue("panelLocationOther");

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<ExhaustFanPhotosFormData>({
    resolver: zodResolver(exhaustFanPhotosSchema),
    mode: "onChange",
    defaultValues: {
      photosOfInstallationArea: [],
      photoOfNewFan: [],
    },
  });

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.newOrReplacement) {
      dispatch(
        updateExhaustFanDetails({
          installationType: draft.newOrReplacement as any,
        }),
      );
    }
    if (draft.locationOfExhaustFan) {
      dispatch(
        updateExhaustFanDetails({ fanType: draft.locationOfExhaustFan as any }),
      );
    }
    if (draft.isRoofOrGableFan) {
      dispatch(
        updateExhaustFanDetails({
          atticFanType: draft.isRoofOrGableFan as any,
        }),
      );
    }
    if (draft.howManyStories) {
      dispatch(
        updateExhaustFanDetails({ stories: String(draft.howManyStories) }),
      );
    }
    if (draft.willSupplyAtticFan !== undefined) {
      dispatch(
        updateExhaustFanDetails({
          existingFan: draft.willSupplyAtticFan ? "Yes" : "No",
        }),
      );
    }
    if (draft.whereElectricalPanelLocated) {
      dispatch(
        updateExhaustFanDetails({
          panelLocation: draft.whereElectricalPanelLocated,
        }),
      );
    }
  }, [draft]);

  // ─── Sync photos from Redux to form ──────────────────────────────────────
  useEffect(() => {
    let installationPhotos: string[] = [];
    let newFanPhotos: string[] = [];

    if (fanLocation === "Kitchen") {
      installationPhotos = photosKitchenLocation;
      newFanPhotos = photosKitchenNewFan;
    } else if (fanLocation === "Bathroom") {
      installationPhotos = photosBathromlocation;
      newFanPhotos = photosBathroomNewFan;
    } else if (fanLocation === "Attic") {
      installationPhotos = photosAtticLocation;
      newFanPhotos = photosNewFan;
    }

    if (installationPhotos.length > 0) {
      setValue("photosOfInstallationArea", installationPhotos);
    }
    if (newFanPhotos.length > 0) {
      setValue("photoOfNewFan", newFanPhotos);
    }
    trigger(["photosOfInstallationArea", "photoOfNewFan"]);
  }, [
    fanLocation,
    photosKitchenLocation,
    photosKitchenNewFan,
    photosBathromlocation,
    photosBathroomNewFan,
    photosAtticLocation,
    photosNewFan,
  ]);

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

  const handleUploadSingle = async (localUri: string): Promise<string> => {
    try {
      setUploadingSection("uploading");
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      // Trigger validation after upload
      setTimeout(() => {
        trigger(["photosOfInstallationArea", "photoOfNewFan"]);
      }, 100);
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
  const handleInstallTypeSelect = (val: string) => {
    dispatch(updateExhaustFanDetails({ installationType: val as any }));
  };

  const handleFanLocationSelect = (loc: FanLocation) => {
    dispatch(updateExhaustFanDetails({ fanType: loc }));
    // Clear location-specific fields when switching
    if (loc === "Attic") {
      dispatch(
        updateExhaustFanDetails({
          kitchenDuctInfo: "",
          kitchenYesNo: "",
          kitchenFanType: "",
          kitchenAreas: [],
          kitchenAreaOther: "",
          kitchenDist: "",
          photosKitchenLocation: [],
          photosKitchenCurrentFan: [],
          photosKitchenNewFan: [],
          bathroomDuctInfo: "",
          bathroomYesNo: "",
          bathroomFanType: "",
          specialtyControl: "",
          bathroomAreas: [],
          bathroomAreaOther: "",
          bathroomDist: "",
          photosBathromlocation: [],
          photosBathroomCurrentFan: [],
          photosBathroomNewFan: [],
        }),
      );
    } else if (loc === "Kitchen") {
      dispatch(
        updateExhaustFanDetails({
          atticFanType: "",
          stories: "",
          supplyingAtticFan: "",
          photosNewFan: [],
          photosAtticLocation: [],
          bathroomDuctInfo: "",
          bathroomYesNo: "",
          bathroomFanType: "",
          specialtyControl: "",
          bathroomAreas: [],
          bathroomAreaOther: "",
          bathroomDist: "",
          photosBathromlocation: [],
          photosBathroomCurrentFan: [],
          photosBathroomNewFan: [],
        }),
      );
    } else if (loc === "Bathroom") {
      dispatch(
        updateExhaustFanDetails({
          atticFanType: "",
          stories: "",
          supplyingAtticFan: "",
          photosNewFan: [],
          photosAtticLocation: [],
          kitchenDuctInfo: "",
          kitchenYesNo: "",
          kitchenFanType: "",
          kitchenAreas: [],
          kitchenAreaOther: "",
          kitchenDist: "",
          photosKitchenLocation: [],
          photosKitchenCurrentFan: [],
          photosKitchenNewFan: [],
        }),
      );
    }
    // Reset form values
    setValue("photosOfInstallationArea", []);
    setValue("photoOfNewFan", []);
    // Trigger validation after reset
    setTimeout(() => {
      trigger(["photosOfInstallationArea", "photoOfNewFan"]);
    }, 100);
  };

  const toggleKitchenArea = (area: any) => {
    const current = kitchenAreas || [];
    const newAreas = current.includes(area)
      ? current.filter((a: string) => a !== area)
      : [...current, area];
    dispatch(updateExhaustFanDetails({ kitchenAreas: newAreas }));
  };

  const toggleBathroomArea = (area: any) => {
    const current = bathroomAreas || [];
    const newAreas = current.includes(area)
      ? current.filter((a: string) => a !== area)
      : [...current, area];
    dispatch(updateExhaustFanDetails({ bathroomAreas: newAreas }));
  };

  // ─── Update field helper ─────────────────────────────────────────────────────
  const updateField = (field: string, value: any) => {
    dispatch(updateExhaustFanDetails({ [field]: value }));
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

      newOrReplacement: installType || "",
      locationOfExhaustFan: fanLocationText || fanLocation || "",
      isRoofOrGableFan: atticFanType || "",
      willSupplyAtticFan: existingFan === "Yes" || supplyingAtticFan === "Yes",
      howManyStories: parseInt(stories) || 0,
      whereElectricalPanelLocated:
        panelLocation === "Other" ? panelLocationOther : panelLocation || "",
      existingDuctAndVentDiameterLocation:
        kitchenDuctInfo || bathroomDuctInfo || "",
      willProvideKitchenExhaustFan: kitchenYesNo === "Yes",
      willProvideBathroomExhaustFan: bathroomYesNo === "Yes",
      typeOfExhaustFanWanted: kitchenFanType || bathroomFanType || "",
      specialityControlsWanted: specialtyControl || "",
      aboveBelowAreaOfExhaustFan:
        kitchenAreas?.length > 0
          ? kitchenAreas[0]
          : bathroomAreas?.length > 0
            ? bathroomAreas[0]
            : "",
      distanceOfElectricalPanelToExhaustFan: kitchenDist || bathroomDist || "",
      additionalInformation: additionalNotes || "",

      photosOfInstallationArea:
        photosKitchenLocation.length > 0
          ? photosKitchenLocation
          : photosBathromlocation.length > 0
            ? photosBathromlocation
            : photosAtticLocation || [],
      photoOfNewFan:
        photosNewFan.length > 0
          ? photosNewFan
          : photosKitchenNewFan.length > 0
            ? photosKitchenNewFan
            : photosBathroomNewFan || [],

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
  const handleContinue = async (data: ExhaustFanPhotosFormData) => {
    // Save photos to Redux before navigating
    if (fanLocation === "Kitchen") {
      dispatch(
        updateExhaustFanDetails({
          photosKitchenLocation: data.photosOfInstallationArea,
          photosKitchenNewFan: data.photoOfNewFan,
        }),
      );
    } else if (fanLocation === "Bathroom") {
      dispatch(
        updateExhaustFanDetails({
          photosBathromlocation: data.photosOfInstallationArea,
          photosBathroomNewFan: data.photoOfNewFan,
        }),
      );
    } else if (fanLocation === "Attic") {
      dispatch(
        updateExhaustFanDetails({
          photosAtticLocation: data.photosOfInstallationArea,
          photosNewFan: data.photoOfNewFan,
        }),
      );
    }

    router.push({
      pathname: "/(tabs)/quotes/quote/exhaust-fan/fan-photos" as any,
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
              pathname: "/(tabs)/quotes/quote/common/project-basics",
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
            title="Exhaust Fans"
            subtitle="Answer these exhaust-fan-specific questions so we can estimate accurately."
          />

          {/* ─── New or Replacement ───────────────────────────────────────────── */}
          <SectionCard title="New or Replacement?">
            <Text className="font-Inter_Regular text-sm text-[#717182] mb-3">
              Is this a new installation or a replacement?
            </Text>
            <View className="flex-row gap-2.5">
              {(["New Installation", "Replacement"] as InstallType[]).map(
                (t) => (
                  <AnimatedOption
                    key={t}
                    label={t}
                    selected={installType === t}
                    onPress={() => handleInstallTypeSelect(t)}
                  />
                ),
              )}
            </View>
          </SectionCard>

          {/* ─── Fan Location ──────────────────────────────────────────────────── */}
          <SectionCard title="Where is the exhaust fan located?">
            {(["Attic", "Kitchen", "Bathroom"] as FanLocation[]).map((loc) => (
              <RowOption
                key={loc}
                label={loc}
                selected={fanLocation === loc}
                onPress={() => handleFanLocationSelect(loc)}
              />
            ))}
          </SectionCard>

          {/* ─── Dynamic Section ──────────────────────────────────────────────── */}
          {fanLocation && (
            <ExhaustFanSections
              fanLocation={fanLocation}
              installType={installType}
              // Attic
              atticFanType={atticFanType}
              supplyingAtticFan={supplyingAtticFan}
              stories={stories}
              photosNewFan={photosNewFan}
              photosAtticLocation={photosAtticLocation}
              // Kitchen
              kitchenDuctInfo={kitchenDuctInfo}
              kitchenYesNo={kitchenYesNo}
              kitchenFanType={kitchenFanType}
              kitchenAreas={kitchenAreas}
              kitchenAreaOther={kitchenAreaOther}
              kitchenDist={kitchenDist}
              photosKitchenLocation={photosKitchenLocation}
              photosKitchenCurrentFan={photosKitchenCurrentFan}
              photosKitchenNewFan={photosKitchenNewFan}
              // Bathroom
              bathroomDuctInfo={bathroomDuctInfo}
              bathroomYesNo={bathroomYesNo}
              bathroomFanType={bathroomFanType}
              specialtyControl={specialtyControl}
              bathroomAreas={bathroomAreas}
              bathroomAreaOther={bathroomAreaOther}
              bathroomDist={bathroomDist}
              photosBathromlocation={photosBathromlocation}
              photosBathroomCurrentFan={photosBathroomCurrentFan}
              photosBathroomNewFan={photosBathroomNewFan}
              // Handlers
              onUploadSingle={handleUploadSingle}
              onDeleteSingle={deleteImageHandler}
              isUploading={uploadingSection === "uploading"}
              updateField={updateField}
              toggleKitchenArea={toggleKitchenArea}
              toggleBathroomArea={toggleBathroomArea}
              // Form props
              control={control}
              errors={errors}
            />
          )}

          {/* ─── Panel Location ────────────────────────────────────────────────── */}
          <SectionCard title="Electrical Panel">
            <Label text="Where is your electrical panel located?" />
            {(
              [
                "Basement (Finished)",
                "Basement (Unfinished)",
                "Garage (Finished)",
                "Garage (Unfinished)",
                "Other",
              ] as PanelLocation[]
            ).map((p) => (
              <RowOption
                key={p}
                label={p}
                selected={panelLocation === p}
                onPress={() => updateField("panelLocation", p)}
              />
            ))}
            <OtherInput
              visible={panelLocation === "Other"}
              placeholder="Describe panel location..."
              value={panelLocationOther}
              onChangeText={(t) => updateField("panelLocationOther", t)}
            />
          </SectionCard>

          <View className="mt-6">
            <GradientButton
              label="Continue"
              onPress={handleSubmit(handleContinue)}
              disabled={!isFormValid}
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
