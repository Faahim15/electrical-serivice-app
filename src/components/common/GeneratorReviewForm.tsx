import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { ReviewRow } from "@/src/components/quote/review/ReviewRow";
import { ReviewSectionTitle } from "@/src/components/quote/review/ReviewSectionTitle";
import { useCreateGeneratorMutation } from "@/src/redux/api-slices/quote/generatorApi";
import { RootState } from "@/src/redux/store";
import React from "react";
import {
  ScrollView as HorizontalScroll,
  Image,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { toast } from "sonner-native";

interface GeneratorReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
}

// ─── Helper to build FormData ────────────────────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

// ─── Photos Row Component ────────────────────────────────────────────────────
const PhotosRow = ({ label, photos }: { label: string; photos: string[] }) => (
  <View
    className="bg-white rounded-2xl px-4 py-4 mb-3"
    style={{
      shadowColor: "#94A3B8",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.07,
      shadowRadius: 4,
      elevation: 1,
    }}
  >
    <Text className="text-[#94A3B8] text-[11.5px] font-Inter_Medium mb-2">
      {label}
    </Text>
    {photos?.length > 0 ? (
      <HorizontalScroll horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {photos.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 10,
                marginRight: 8,
              }}
              resizeMode="cover"
            />
          ))}
        </View>
      </HorizontalScroll>
    ) : (
      <Text className="text-[#1E293B] text-[14px] font-Inter_SemiBold">
        None provided
      </Text>
    )}
  </View>
);

const GeneratorReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
}: GeneratorReviewFormProps) => {
  const [createGenerator] = useCreateGeneratorMutation();

  // ─── Get values from Redux ────────────────────────────────────────────────────
  const contactDetails = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const serviceAddress = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const projectBasics = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  // ─── Get Generator Details ──────────────────────────────────────────────────
  const getGeneratorDetails = () => {
    if (categoryData?.categoryId === "9" && categoryData.details) {
      const details = categoryData.details as any;

      return {
        generatorType: draftData?.generatorType || details.generatorType || "",
        isAlreadyHaveGenerator:
          draftData?.isAlreadyHaveGenerator !== undefined
            ? draftData.isAlreadyHaveGenerator
            : details.hasGenerator === "Yes",
        generatorOutputPower:
          draftData?.generatorOutputPower || details.kwOutput || "",
        preferredBackupInstallation:
          draftData?.preferredBackupInstallation ||
          details.backupInstallation ||
          "",
        generatorDistanceFromInletLocation:
          draftData?.generatorDistanceFromInletLocation ||
          details.panelDistance ||
          "",
        electricPanelLocation:
          draftData?.electricPanelLocation || details.panelLocation || "",
        sizeOfGeneratorWanted:
          draftData?.sizeOfGeneratorWanted || details.purchaseSize || "",
        backupNeeds: draftData?.backupNeeds || details.backedUpCircuits || "",
        isHavePropane:
          draftData?.isHavePropane !== undefined
            ? draftData.isHavePropane
            : details.hasPropane === "Yes",
        electricPanelPhotos:
          draftData?.electricPanelPhotos || details.panelPhotos || [],
        photosOfWhereGeneratorWillBeInlet:
          draftData?.photosOfWhereGeneratorWillBeInlet ||
          details.generatorPhotos ||
          [],
        generatorInstallationLocationPhotos:
          draftData?.generatorInstallationLocationPhotos ||
          details.installLocationPhotos ||
          [],
        photosOfElectricalMeter:
          draftData?.photosOfElectricalMeter || details.meterPhotos || [],
      };
    }
    return {
      generatorType: "",
      isAlreadyHaveGenerator: false,
      generatorOutputPower: "",
      preferredBackupInstallation: "",
      generatorDistanceFromInletLocation: "",
      electricPanelLocation: "",
      sizeOfGeneratorWanted: "",
      backupNeeds: "",
      isHavePropane: false,
      electricPanelPhotos: [],
      photosOfWhereGeneratorWillBeInlet: [],
      generatorInstallationLocationPhotos: [],
      photosOfElectricalMeter: [],
    };
  };

  const handleSubmit = async () => {
    const details = getGeneratorDetails();

    // ─── Get values from draftData (API) or fallback to Redux ────────────────
    const finalFullName = draftData?.fullName || contactDetails.fullName;
    const finalEmail = draftData?.emailAddress || contactDetails.email;
    const finalPhone = draftData?.phoneNumber || contactDetails.phone;
    const finalPreferredContact =
      draftData?.preferredContactMethod || contactDetails.preferredContact;
    const finalStreetAddress =
      draftData?.streetAddress || serviceAddress.streetAddress;
    const finalApartment = draftData?.apartmentUnit || serviceAddress.apartment;
    const finalCity = draftData?.city || serviceAddress.city;
    const finalState = draftData?.state || serviceAddress.state;
    const finalZipCode = draftData?.zipCode || serviceAddress.zipCode;
    const finalPropertyType =
      draftData?.propertyType || projectBasics.propertyType;
    const finalOwnershipStatus =
      draftData?.ownershipStatus || projectBasics.ownershipStatus;
    const finalTimeline = draftData?.timelineUrgency || projectBasics.timeline;

    // ─── Validate required fields ─────────────────────────────────────────────
    if (!finalFullName) {
      toast.error("Please enter your full name");
      return;
    }
    if (!finalEmail) {
      toast.error("Please enter your email address");
      return;
    }
    if (!finalPhone) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!finalStreetAddress) {
      toast.error("Please enter your street address");
      return;
    }
    if (!finalCity) {
      toast.error("Please enter your city");
      return;
    }
    if (!finalState) {
      toast.error("Please enter your state");
      return;
    }
    if (!finalZipCode) {
      toast.error("Please enter your zip code");
      return;
    }
    if (!finalPropertyType) {
      toast.error("Please select property type");
      return;
    }

    // ─── Build payload matching GeneratorPayload ─────────────────────────────
    const payload = {
      fullName: finalFullName,
      phoneNumber: finalPhone,
      emailAddress: finalEmail,
      preferredContactMethod: finalPreferredContact,
      streetAddress: finalStreetAddress,
      apartmentUnit: finalApartment,
      city: finalCity,
      state: finalState,
      zipCode: finalZipCode,
      propertyType: finalPropertyType,
      ownershipStatus: finalOwnershipStatus,
      timelineUrgency: finalTimeline,
      generatorType: details.generatorType,
      isAlreadyHaveGenerator: details.isAlreadyHaveGenerator,
      generatorOutputPower: details.generatorOutputPower,
      preferredBackupInstallation: details.preferredBackupInstallation,
      generatorDistanceFromInletLocation:
        details.generatorDistanceFromInletLocation,
      electricPanelLocation: details.electricPanelLocation,
      sizeOfGeneratorWanted: details.sizeOfGeneratorWanted,
      backupNeeds: details.backupNeeds,
      isHavePropane: details.isHavePropane,
      electricPanelPhotos: details.electricPanelPhotos,
      photosOfWhereGeneratorWillBeInlet:
        details.photosOfWhereGeneratorWillBeInlet,
      generatorInstallationLocationPhotos:
        details.generatorInstallationLocationPhotos,
      photosOfElectricalMeter: details.photosOfElectricalMeter,
      status: "submitted" as const,
      completionPercentage: 100,
    };

    console.log("Submitting Generator payload:", payload);

    setIsSubmitting(true);
    try {
      const result = await createGenerator(
        createFormData(payload) as any,
      ).unwrap();

      console.log("Submit result:", result);

      if (result.success) {
        onSuccess();
      } else {
        toast.error(result.message || "Failed to submit request");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(
        error?.data?.message || "Failed to submit request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const details = getGeneratorDetails();

  return (
    <View>
      {/* ─── Generator Type ────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Generator Type" />
      <ReviewRow
        label="Generator Type"
        value={details.generatorType || "Not specified"}
      />

      {/* ─── Generator Ownership ───────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Generator Ownership" />
      <ReviewRow
        label="Already Have Generator"
        value={details.isAlreadyHaveGenerator ? "Yes" : "No"}
      />

      {details.isAlreadyHaveGenerator ? (
        <>
          <ReviewRow
            label="Generator Output Power"
            value={details.generatorOutputPower || "Not specified"}
          />
          <ReviewRow
            label="Panel Distance"
            value={
              details.generatorDistanceFromInletLocation || "Not specified"
            }
          />
        </>
      ) : (
        <ReviewRow
          label="Size of Generator Wanted"
          value={details.sizeOfGeneratorWanted || "Not specified"}
        />
      )}

      <ReviewRow
        label="Preferred Backup Installation"
        value={details.preferredBackupInstallation || "Not specified"}
      />
      <ReviewRow
        label="Panel Location"
        value={details.electricPanelLocation || "Not specified"}
      />

      {/* ─── Backup Needs ──────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Backup Needs" />
      <ReviewRow
        label="Backup Needs"
        value={details.backupNeeds || "Not specified"}
      />
      <ReviewRow
        label="Has Propane"
        value={details.isHavePropane ? "Yes" : "No"}
      />

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Photos" />
      <PhotosRow label="Panel Photos" photos={details.electricPanelPhotos} />
      <PhotosRow
        label="Generator Inlet Photos"
        photos={details.photosOfWhereGeneratorWillBeInlet}
      />
      <PhotosRow
        label="Installation Location Photos"
        photos={details.generatorInstallationLocationPhotos}
      />
      <PhotosRow
        label="Electrical Meter Photos"
        photos={details.photosOfElectricalMeter}
      />

      {/* ─── Submit ───────────────────────────────────────────────────────────── */}
      <GradientButton
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default GeneratorReviewForm;
