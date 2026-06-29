import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { ReviewRow } from "@/src/components/quote/review/ReviewRow";
import { ReviewSectionTitle } from "@/src/components/quote/review/ReviewSectionTitle";
import React from "react";
import {
  ScrollView as HorizontalScroll,
  Image,
  Text,
  View,
} from "react-native";

interface HotTubReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
  serviceCallId?: string;
  serviceType?: string;
}

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
  isSubmitting,
}: HotTubReviewFormProps) => {
  // ─── Get Hot Tub Details ─────────────────────────────────────────────────────
  const getHotTubDetails = () => {
    if (categoryData?.categoryId === "6" && categoryData.details) {
      const details = categoryData.details as any;

      const manualDocument = draftData?.manualDocument?.length
        ? draftData.manualDocument
        : details.userManualPhotos || [];

      return {
        hasDigitalManual:
          draftData?.hasDigitalManual !== undefined
            ? draftData.hasDigitalManual
            : details.hasUserManual === "Yes",
        manualDocument,
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
        onPress={onSuccess}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default HotTubReviewForm;
