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
import { updateGeneratorDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import {
  GeneratorPhotosFormData,
  generatorPhotosSchema,
  GeneratorPhotosWholeHomeFormData,
  generatorPhotosWholeHomeSchema,
} from "@/src/schemas/upload-photos/upload-photos.schema";
import { GeneratorRecord } from "@/src/types/quotes/generator.api.types";
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

const CURRENT_STEP = 6;
const TOTAL_STEPS = 7;

// ─── Helper to convert payload to FormData ──────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function GeneratorPhotosNeeded() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<
    "panel" | "generator" | "inlet" | "meter" | "install" | null
  >(null);

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

  const generatorDetails = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "9" && data.details) {
      return data.details;
    }
    return null;
  });

  const panelPhotos = generatorDetails?.panelPhotos || [];
  const generatorPhotos = generatorDetails?.generatorPhotos || [];
  const installLocationPhotos = generatorDetails?.installLocationPhotos || [];
  const meterPhotos = generatorDetails?.meterPhotos || [];
  const hasGenerator = generatorDetails?.hasGenerator || "";
  const generatorType = generatorDetails?.generatorType || "";

  const hasExisting = hasGenerator === "Yes";
  const isWholeHomeStandby = generatorType === "Whole Home Standby";

  // ─── Choose schema based on generator type ──────────────────────────────
  // Ensure we have a valid schema
  const getSchema = () => {
    if (isWholeHomeStandby) {
      return generatorPhotosWholeHomeSchema;
    }
    return generatorPhotosSchema;
  };

  const schema = getSchema();

  // ─── React Hook Form ──────────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<GeneratorPhotosFormData | GeneratorPhotosWholeHomeFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      panelPhotos: panelPhotos || [],
      generatorPhotos: generatorPhotos || [],
      meterPhotos: meterPhotos || [],
      installLocationPhotos: installLocationPhotos || [],
    },
  });

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.electricPanelPhotos?.length) {
      dispatch(
        updateGeneratorDetails({ panelPhotos: draft.electricPanelPhotos }),
      );
      setValue("panelPhotos", draft.electricPanelPhotos);
    }
    if (draft.photosOfWhereGeneratorWillBeInlet?.length) {
      dispatch(
        updateGeneratorDetails({
          generatorPhotos: draft.photosOfWhereGeneratorWillBeInlet,
        }),
      );
      setValue("generatorPhotos", draft.photosOfWhereGeneratorWillBeInlet);
    }
    if (draft.generatorInstallationLocationPhotos?.length) {
      dispatch(
        updateGeneratorDetails({
          installLocationPhotos: draft.generatorInstallationLocationPhotos,
        }),
      );
      setValue(
        "installLocationPhotos",
        draft.generatorInstallationLocationPhotos,
      );
    }
    if (draft.photosOfElectricalMeter?.length) {
      dispatch(
        updateGeneratorDetails({ meterPhotos: draft.photosOfElectricalMeter }),
      );
      setValue("meterPhotos", draft.photosOfElectricalMeter);
    }
    if (draft.photosOfReceptacleOnGenerator?.length) {
      dispatch(
        updateGeneratorDetails({
          generatorPhotos: draft.photosOfReceptacleOnGenerator,
        }),
      );
      setValue("generatorPhotos", draft.photosOfReceptacleOnGenerator);
    }
    trigger([
      "panelPhotos",
      "generatorPhotos",
      "meterPhotos",
      "installLocationPhotos",
    ]);
  }, [draft]);

  // ─── Sync Redux state with React Hook Form ──────────────────────────────
  useEffect(() => {
    if (panelPhotos.length > 0) {
      setValue("panelPhotos", panelPhotos);
      trigger("panelPhotos");
    }
  }, [panelPhotos, setValue, trigger]);

  useEffect(() => {
    if (generatorPhotos.length > 0) {
      setValue("generatorPhotos", generatorPhotos);
      trigger("generatorPhotos");
    }
  }, [generatorPhotos, setValue, trigger]);

  useEffect(() => {
    if (meterPhotos.length > 0) {
      setValue("meterPhotos", meterPhotos);
      trigger("meterPhotos");
    }
  }, [meterPhotos, setValue, trigger]);

  useEffect(() => {
    if (installLocationPhotos.length > 0) {
      setValue("installLocationPhotos", installLocationPhotos);
      trigger("installLocationPhotos");
    }
  }, [installLocationPhotos, setValue, trigger]);

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
    section: "panel" | "generator" | "inlet" | "meter" | "install",
  ): Promise<string> => {
    try {
      setUploadingSection(section);
      const url = await uploadImage(localUri);
      toast.success("Photo uploaded!");
      // Trigger validation for the specific field
      if (section === "panel") trigger("panelPhotos");
      else if (section === "generator" || section === "inlet")
        trigger("generatorPhotos");
      else if (section === "meter") trigger("meterPhotos");
      else if (section === "install") trigger("installLocationPhotos");
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
      electricPanelPhotos: draft?.electricPanelPhotos || panelPhotos || [],
      photosOfWhereGeneratorWillBeInlet:
        draft?.photosOfWhereGeneratorWillBeInlet || generatorPhotos || [],
      generatorInstallationLocationPhotos:
        draft?.generatorInstallationLocationPhotos ||
        installLocationPhotos ||
        [],
      photosOfElectricalMeter:
        draft?.photosOfElectricalMeter || meterPhotos || [],
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
  const handleContinue = async (
    data: GeneratorPhotosFormData | GeneratorPhotosWholeHomeFormData,
  ) => {
    router.push({
      pathname: "/(tabs)/quotes/quote/common/review-request",
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
              pathname: "/(tabs)/quotes/quote/generator/backup-needs",
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

          <AuthHeading title="Photos needed" subtitle="" />

          {/* Panel Photos with Controller */}
          <Controller
            control={control}
            name="panelPhotos"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Please upload clear photos of your electrical panel up close so we can see the breakers/panel label and about 10 ft away"
                  photos={value || []}
                  onPhotosChange={(p) => {
                    dispatch(updateGeneratorDetails({ panelPhotos: p }));
                    setValue("panelPhotos", p);
                    trigger("panelPhotos");
                  }}
                  onUploadSingle={(uri) => handleUploadSingle(uri, "panel")}
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

          {/* Generator Photos (Existing Generator) */}
          {hasExisting && (
            <Controller
              control={control}
              name="generatorPhotos"
              render={({ field: { value }, fieldState: { error } }) => (
                <View>
                  <PhotoUploadSection
                    label="Upload photo of the receptacle on the generator"
                    photos={value || []}
                    onPhotosChange={(p) => {
                      dispatch(updateGeneratorDetails({ generatorPhotos: p }));
                      setValue("generatorPhotos", p);
                      trigger("generatorPhotos");
                    }}
                    onUploadSingle={(uri) =>
                      handleUploadSingle(uri, "generator")
                    }
                    onDeleteSingle={deleteImageHandler}
                    isUploading={uploadingSection === "generator"}
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

          {/* Generator Inlet Photos (Not Whole Home Standby) */}
          {!isWholeHomeStandby && (
            <Controller
              control={control}
              name="generatorPhotos"
              render={({ field: { value }, fieldState: { error } }) => (
                <View>
                  <PhotoUploadSection
                    label="Upload photo of where your generator inlet will be"
                    photos={value || []}
                    onPhotosChange={(p) => {
                      dispatch(updateGeneratorDetails({ generatorPhotos: p }));
                      setValue("generatorPhotos", p);
                      trigger("generatorPhotos");
                    }}
                    onUploadSingle={(uri) => handleUploadSingle(uri, "inlet")}
                    onDeleteSingle={deleteImageHandler}
                    isUploading={uploadingSection === "inlet"}
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

          {/* Meter Photos (Whole Home Standby) - REQUIRED */}
          {isWholeHomeStandby && (
            <Controller
              control={control}
              name="meterPhotos"
              render={({ field: { value }, fieldState: { error } }) => (
                <View>
                  <PhotoUploadSection
                    label="Upload photo of your electrical meter"
                    photos={value || []}
                    onPhotosChange={(p) => {
                      dispatch(updateGeneratorDetails({ meterPhotos: p }));
                      setValue("meterPhotos", p);
                      trigger("meterPhotos");
                    }}
                    onUploadSingle={(uri) => handleUploadSingle(uri, "meter")}
                    onDeleteSingle={deleteImageHandler}
                    isUploading={uploadingSection === "meter"}
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

          {/* Install Location Photos with Controller */}
          <Controller
            control={control}
            name="installLocationPhotos"
            render={({ field: { value }, fieldState: { error } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload photo of where you would like the generator installed"
                  photos={value || []}
                  onPhotosChange={(p) => {
                    dispatch(
                      updateGeneratorDetails({ installLocationPhotos: p }),
                    );
                    setValue("installLocationPhotos", p);
                    trigger("installLocationPhotos");
                  }}
                  onUploadSingle={(uri) => handleUploadSingle(uri, "install")}
                  onDeleteSingle={deleteImageHandler}
                  isUploading={uploadingSection === "install"}
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
