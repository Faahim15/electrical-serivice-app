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
import { updateDockPowerDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { DockPowerRecord } from "@/src/types/quotes/dock-power.api.types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner-native";

const CURRENT_STEP = 7;
const TOTAL_STEPS = 10;

const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

export default function DockPlansPermit() {
  const dispatch = useDispatch();
  const [uploadingSection, setUploadingSection] = useState<"plans" | null>(
    null,
  );

  const { serviceCallId, serviceType: serviceTypeParam } =
    useLocalSearchParams<{
      serviceCallId?: string;
      serviceType?: string;
    }>();

  const serviceType = serviceTypeParam || "Dock Power";
  const completionPercentage = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const { createDraft, updateDraft, isSaving } = useDraftSave();
  const { data: draftData } = useDraftDetails(serviceCallId, serviceType);
  const draft = draftData as DockPowerRecord | undefined;

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

  const reduxHasPlans = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details) return data.details.hasPlans;
    return "";
  });

  const reduxPlanDrawingPhotos = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.planDrawingPhotos || [];
    return [];
  });

  const reduxHasPermit = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details) return data.details.hasPermit;
    return "";
  });

  const reduxPermitNumber = useSelector((state: RootState) => {
    const data = state.serviceForm.categoryData;
    if (data?.categoryId === "7" && data.details)
      return data.details.permitNumber;
    return "";
  });

  // ─── Local state ──────────────────────────────────────────────────────────────
  const [hasPlans, setHasPlans] = useState(reduxHasPlans || "");
  const [planDrawingPhotos, setPlanDrawingPhotos] = useState<string[]>(
    reduxPlanDrawingPhotos || [],
  );
  const [hasPermit, setHasPermit] = useState(reduxHasPermit || "");
  const [permitNumber, setPermitNumber] = useState(reduxPermitNumber || "");

  // ─── Prefill from draft ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!draft) return;
    if (draft.hasPlansDrawings !== undefined) {
      const val = draft.hasPlansDrawings ? "Yes" : "No";
      setHasPlans(val);
      dispatch(updateDockPowerDetails({ hasPlans: val as any }));
    }
    if (draft.plansDrawingsPhotos?.length) {
      setPlanDrawingPhotos(draft.plansDrawingsPhotos);
      dispatch(
        updateDockPowerDetails({
          planDrawingPhotos: draft.plansDrawingsPhotos,
        }),
      );
    }
    if (draft.permitApplied !== undefined) {
      const val = draft.permitApplied ? "Yes" : "No";
      setHasPermit(val);
      dispatch(updateDockPowerDetails({ hasPermit: val as any }));
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
      toast.error("Failed to upload photo. Please try again.");
      throw error;
    } finally {
      setUploadingSection(null);
    }
  };

  const handlePhotosChange = (updated: string[]) => {
    setPlanDrawingPhotos(updated);
    dispatch(updateDockPowerDetails({ planDrawingPhotos: updated }));
  };

  const deleteImageHandler = async (imageUrl: string) => {
    try {
      await deleteImage({ imageUrl }).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete photo.");
      throw error;
    }
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
      hasPlansDrawings:
        hasPlans !== ""
          ? hasPlans === "Yes"
          : (draft?.hasPlansDrawings ?? reduxHasPlans === "Yes"),
      plansDrawingsPhotos: planDrawingPhotos.length
        ? planDrawingPhotos
        : draft?.plansDrawingsPhotos?.length
          ? draft.plansDrawingsPhotos
          : reduxPlanDrawingPhotos,
      permitApplied:
        hasPermit !== ""
          ? hasPermit === "Yes"
          : (draft?.permitApplied ?? reduxHasPermit === "Yes"),
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
              pathname: "/(tabs)/quotes/quote/dock-power/route-details",
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

          <AuthHeading title="Plans, Permit & Timeline" subtitle="" />

          {/* ── Has Plans ── */}
          <OptionGrid
            label="Do you have any plans/drawings for the Dock power?"
            options={["Yes", "No"]}
            selected={hasPlans}
            onSelect={(val) => {
              setHasPlans(val);
              setPlanDrawingPhotos([]);
              dispatch(
                updateDockPowerDetails({
                  hasPlans: val as any,
                  planDrawingPhotos: [],
                }),
              );
            }}
            numColumns={1}
          />

          {hasPlans === "Yes" && (
            <PhotoUploadSection
              key="plans-photo-section"
              label="Please Upload the plans Drawing"
              photos={planDrawingPhotos}
              onPhotosChange={handlePhotosChange}
              onUploadSingle={handlePlansUploadSingle}
              onDeleteSingle={deleteImageHandler}
              isUploading={uploadingSection === "plans"}
            />
          )}

          {/* ── Has Permit ── */}
          <OptionGrid
            label="Has a permit been applied for?"
            options={["Yes", "No"]}
            selected={hasPermit}
            onSelect={(val) => {
              setHasPermit(val);
              setPermitNumber("");
              dispatch(
                updateDockPowerDetails({
                  hasPermit: val as any,
                  permitNumber: "",
                }),
              );
            }}
            numColumns={1}
          />

          {hasPermit === "Yes" && (
            <CustomInput
              label="What is your permit number?"
              textInputConfig={{
                placeholder: "Permit number",
                value: permitNumber,
                onChangeText: (text) => {
                  setPermitNumber(text);
                  dispatch(updateDockPowerDetails({ permitNumber: text }));
                },
              }}
            />
          )}

          <GradientButton
            label="Continue"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/quotes/quote/dock-power/photos-needed",
                params: { serviceCallId, serviceType },
              })
            }
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
