import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { ReviewRow } from "@/src/components/quote/review/ReviewRow";
import { ReviewSectionTitle } from "@/src/components/quote/review/ReviewSectionTitle";
import { useCreateExhaustFanMutation } from "@/src/redux/api-slices/quote/exhaust-fan-api";
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

interface ExhaustFanReviewFormProps {
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

const ExhaustFanReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
}: ExhaustFanReviewFormProps) => {
  const [createExhaustFan] = useCreateExhaustFanMutation();

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

  // ─── Get Exhaust Fan Details ─────────────────────────────────────────────────
  const getExhaustFanDetails = () => {
    if (categoryData?.categoryId === "14" && categoryData.details) {
      const details = categoryData.details as any;
      return {
        newOrReplacement: details.installationType || "",
        locationOfExhaustFan: details.fanType || "",
        willSupplyAtticFan: details.existingFan === "Yes",
        panelPhotos: details.panelPhotos || [],
        additionalInformation: details.additionalNotes || "",
        photosOfInstallationArea: details.photosOfInstallationArea || [],
      };
    }
    return {
      newOrReplacement: "",
      locationOfExhaustFan: "",
      willSupplyAtticFan: false,
      panelPhotos: [],
      additionalInformation: "",
      photosOfInstallationArea: [],
    };
  };

  const handleSubmit = async () => {
    const details = getExhaustFanDetails();

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

    if (!finalFullName) {
      toast.error("Please enter your full name");
      return;
    }

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
      newOrReplacement: details.newOrReplacement,
      locationOfExhaustFan: details.locationOfExhaustFan,
      willSupplyAtticFan: details.willSupplyAtticFan,
      panelPhotos: details.panelPhotos,
      additionalInformation: details.additionalInformation,
      photosOfInstallationArea: details.photosOfInstallationArea,
      status: "submitted" as const,
      completionPercentage: 100,
    };

    setIsSubmitting(true);
    try {
      const result = await createExhaustFan(
        createFormData(payload) as any,
      ).unwrap();
      if (result.success) {
        onSuccess();
      } else {
        toast.error(result.message || "Failed to submit request");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to submit request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const details = getExhaustFanDetails();

  return (
    <View>
      <ReviewSectionTitle title="Exhaust Fan Details" />
      <ReviewRow
        label="Install Type"
        value={details.newOrReplacement || "Not specified"}
      />
      <ReviewRow
        label="Fan Location"
        value={details.locationOfExhaustFan || "Not specified"}
      />
      <ReviewRow
        label="Will Supply Fan"
        value={details.willSupplyAtticFan ? "Yes" : "No"}
      />

      <ReviewSectionTitle title="Photos" />
      <PhotosRow
        label="Installation Area Photos"
        photos={details.photosOfInstallationArea}
      />
      <PhotosRow label="Panel Photos" photos={details.panelPhotos} />

      <ReviewSectionTitle title="Additional Information" />
      <ReviewRow
        label="Additional Notes"
        value={details.additionalInformation || "None provided"}
      />

      <GradientButton
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default ExhaustFanReviewForm;
