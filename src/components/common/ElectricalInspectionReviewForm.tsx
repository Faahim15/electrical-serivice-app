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

interface ElectricalInspectionReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
  serviceCallId?: string;
  serviceType?: string;
}

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

const ElectricalInspectionReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: ElectricalInspectionReviewFormProps) => {
  const getElectricalInspectionDetails = () => {
    if (categoryData?.categoryId === "8" && categoryData.details) {
      const details = categoryData.details as any;
      return {
        inspectionType:
          draftData?.inspectionType || details.inspectionType || "",
        panelNeedForInspected:
          draftData?.panelNeedForInspected ||
          details.squareFootage ||
          details.panelCount ||
          "",
        panelPhotos: draftData?.panelPhotos?.length
          ? draftData.panelPhotos
          : details.panelPhotos || [],
        additionalInformation:
          draftData?.additionalInformation || details.additionalInfo || "",
      };
    }
    return {
      inspectionType: "",
      panelNeedForInspected: "",
      panelPhotos: [],
      additionalInformation: "",
    };
  };

  const details = getElectricalInspectionDetails();

  return (
    <View>
      <ReviewSectionTitle title="Inspection Details" />
      <ReviewRow
        label="Inspection Type"
        value={details.inspectionType || "Not specified"}
      />
      <ReviewRow
        label={
          details.inspectionType === "Electrical Service only"
            ? "Panel Count"
            : "Square Footage"
        }
        value={details.panelNeedForInspected || "Not specified"}
      />

      <ReviewSectionTitle title="Photos" />
      <PhotosRow label="Panel Photos" photos={details.panelPhotos} />

      <ReviewSectionTitle title="Additional Information" />
      <ReviewRow
        label="Additional Notes"
        value={details.additionalInformation || "None provided"}
      />

      <GradientButton
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={onSuccess}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default ElectricalInspectionReviewForm;
