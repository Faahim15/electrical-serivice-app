import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { ReviewRow } from "@/src/components/quote/review/ReviewRow";
import { ReviewSectionTitle } from "@/src/components/quote/review/ReviewSectionTitle";
import { useCreateHotTubMutation } from "@/src/redux/api-slices/quote/hotTubApi";
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

interface HotTubReviewFormProps {
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

const HotTubReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
}: HotTubReviewFormProps) => {
  const [createHotTub] = useCreateHotTubMutation();

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

  // ─── Get Hot Tub Details ─────────────────────────────────────────────────────
  const getHotTubDetails = () => {
    if (categoryData?.categoryId === "6" && categoryData.details) {
      const details = categoryData.details as any;

      // Handle manual document - could be from draft or Redux
      const manualDocument = draftData?.manualDocument?.length
        ? draftData.manualDocument
        : details.userManualPhotos || [];

      return {
        hasDigitalManual:
          draftData?.hasDigitalManual !== undefined
            ? draftData.hasDigitalManual
            : details.hasUserManual === "Yes",
        manualDocument: manualDocument,
        hotTubManufacturer:
          draftData?.hotTubManufacturer || details.manufacturer || "",
        hotTubModelNumber:
          draftData?.hotTubModelNumber || details.modelNumber || "",
        amperageNeeded: draftData?.amperageNeeded || details.amperage || "",
        location: draftData?.location || details.placement || "",
        panelLocation: draftData?.panelLocation || details.panelLocation || "",
        panelDistance: draftData?.panelDistance || details.panelDistance || "",
        additionalInformation:
          draftData?.additionalInformation || details.additionalInfo || "",
        panelPhotos: draftData?.panelPhotos?.length
          ? draftData.panelPhotos
          : details.panelPhotos || [],
        hotTubPhotos: draftData?.hotTubPhotos?.length
          ? draftData.hotTubPhotos
          : details.installLocationPhotos || [],
        receptaclePhotos: draftData?.receptaclePhotos?.length
          ? draftData.receptaclePhotos
          : details.receptaclePhotos || [],
      };
    }
    return {
      hasDigitalManual: false,
      manualDocument: [],
      hotTubManufacturer: "",
      hotTubModelNumber: "",
      amperageNeeded: "",
      location: "",
      panelLocation: "",
      panelDistance: "",
      additionalInformation: "",
      panelPhotos: [],
      hotTubPhotos: [],
      receptaclePhotos: [],
    };
  };

  const handleSubmit = async () => {
    const details = getHotTubDetails();

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

    // ─── Build payload ─────────────────────────────────────────────────────────
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
      hasDigitalManual: details.hasDigitalManual,
      hotTubManufacturer: details.hotTubManufacturer,
      hotTubModelNumber: details.hotTubModelNumber,
      amperageNeeded: details.amperageNeeded,
      location: details.location,
      panelLocation: details.panelLocation,
      panelDistance: details.panelDistance,
      additionalInformation: details.additionalInformation,
      manualDocument: details.manualDocument,
      panelPhotos: details.panelPhotos,
      hotTubPhotos: details.hotTubPhotos,
      receptaclePhotos: details.receptaclePhotos,
      status: "submitted" as const,
      completionPercentage: 100,
    };

    console.log("Submitting Hot Tub payload:", payload);

    setIsSubmitting(true);
    try {
      const result = await createHotTub(
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

  const details = getHotTubDetails();

  return (
    <View>
      {/* ─── Hot Tub Information ────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Hot Tub Information" />
      <ReviewRow
        label="Has Digital Manual"
        value={details.hasDigitalManual ? "Yes" : "No"}
      />

      {details.hasDigitalManual && (
        <ReviewRow
          label="Manual Document"
          value={
            details.manualDocument?.length > 0 ? "Uploaded" : "Not uploaded"
          }
        />
      )}

      {!details.hasDigitalManual && (
        <>
          <ReviewRow
            label="Manufacturer"
            value={details.hotTubManufacturer || "Not provided"}
          />
          <ReviewRow
            label="Model Number"
            value={details.hotTubModelNumber || "Not provided"}
          />
        </>
      )}

      {/* ─── Electrical Requirements ───────────────────────────────────────────── */}
      <ReviewSectionTitle title="Electrical Requirements" />
      <ReviewRow
        label="Amperage Needed"
        value={details.amperageNeeded || "Not specified"}
      />

      {/* ─── Location Details ───────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Location Details" />
      <ReviewRow
        label="Placement"
        value={details.location || "Not specified"}
      />
      <ReviewRow
        label="Panel Location"
        value={details.panelLocation || "Not specified"}
      />
      <ReviewRow
        label="Panel Distance"
        value={details.panelDistance || "Not specified"}
      />

      {/* ─── Photos ────────────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Photos" />
      <PhotosRow label="Panel Photos" photos={details.panelPhotos} />
      <PhotosRow
        label="Hot Tub Installation Location"
        photos={details.hotTubPhotos}
      />
      <PhotosRow
        label="Receptacle / Disconnect Location"
        photos={details.receptaclePhotos}
      />

      {/* ─── Additional Information ───────────────────────────────────────────── */}
      <ReviewSectionTitle title="Additional Information" />
      <ReviewRow
        label="Additional Notes"
        value={details.additionalInformation || "None provided"}
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

export default HotTubReviewForm;
