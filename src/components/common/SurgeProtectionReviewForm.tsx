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

interface SurgeProtectionReviewFormProps {
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

const SurgeProtectionReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: SurgeProtectionReviewFormProps) => {
  // ─── Get Surge Protection Details ──────────────────────────────────────────
  const getSurgeProtectionDetails = () => {
    if (categoryData?.categoryId === "11" && categoryData.details) {
      const details = categoryData.details as any;

      // ⭐ Priority: draftData first, then Redux (categoryData.details)
      return {
        photosOfElectricalPanel: draftData?.photosOfElectricalPanel?.length
          ? draftData.photosOfElectricalPanel
          : draftData?.panelPhotos?.length
            ? draftData.panelPhotos
            : details.panelPhotos || [],
        additionalNotes:
          draftData?.additionalNotes ||
          draftData?.additionalInformation ||
          details.additionalNotes ||
          "",
      };
    }
    return {
      photosOfElectricalPanel: [],
      additionalNotes: "",
    };
  };

  const details = getSurgeProtectionDetails();

  return (
    <View>
      {/* ─── Surge Protection Details ─────────────────────────────────────────── */}
      <ReviewSectionTitle title="Surge Protection Details" />

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      {details.photosOfElectricalPanel.length > 0 && (
        <ReviewSectionTitle title="Photos" />
      )}
      {details.photosOfElectricalPanel.length > 0 && (
        <PhotosRow
          label="Electrical Panel Photos"
          photos={details.photosOfElectricalPanel}
        />
      )}

      {/* ─── Additional Information ───────────────────────────────────────────── */}
      {details.additionalNotes && (
        <>
          <ReviewSectionTitle title="Additional Information" />
          <ReviewRow
            label="Additional Notes"
            value={details.additionalNotes || "None provided"}
          />
        </>
      )}

      {/* ─── Submit ───────────────────────────────────────────────────────────── */}
      <GradientButton
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={onSuccess}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default SurgeProtectionReviewForm;
