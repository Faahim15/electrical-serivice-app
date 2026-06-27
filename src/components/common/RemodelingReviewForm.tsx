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

interface RemodelingReviewFormProps {
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

const RemodelingReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: RemodelingReviewFormProps) => {
  const getRemodelingDetails = () => {
    if (categoryData?.categoryId === "4" && categoryData.details) {
      const details = categoryData.details as any;
      return {
        panelLocation: draftData?.panelLocation || details.panelLocation || "",
        panelLocationOther: details.panelLocationOther || "",
        remodelingAreas:
          draftData?.remodelingAreas || details.remodlingArea || "",
        hasPlansDrawings:
          draftData?.hasPlansDrawings !== undefined
            ? draftData.hasPlansDrawings
            : details.hasPlans === "Yes",
        plansDrawings: draftData?.plansDrawings?.length
          ? draftData.plansDrawings
          : details.planPhotos || [],
        electricalNeeds:
          draftData?.electricalNeeds || details.electricalNeeds || "",
        permitApplied:
          draftData?.permitApplied !== undefined
            ? draftData.permitApplied
            : details.hasPermit === "Yes",
        permitNumber: draftData?.permitNumber || details.permitNumber || "",
        existingSpacePhotos: draftData?.existingSpacePhotos?.length
          ? draftData.existingSpacePhotos
          : details.existingSpacePhotos || [],
        panelPhotos: draftData?.panelPhotos?.length
          ? draftData.panelPhotos
          : details.panelPhotos || [],
        additionalInformation:
          draftData?.additionalInformation || details.additionalInfo || "",
      };
    }
    return {
      panelLocation: "",
      panelLocationOther: "",
      remodelingAreas: "",
      hasPlansDrawings: false,
      plansDrawings: [],
      electricalNeeds: "",
      permitApplied: false,
      permitNumber: "",
      existingSpacePhotos: [],
      panelPhotos: [],
      additionalInformation: "",
    };
  };

  const details = getRemodelingDetails();

  return (
    <View>
      {/* ─── Project Basics ───────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Project Basics" />
      <ReviewRow
        label="Panel Location"
        value={
          details.panelLocation === "Other (please specify)"
            ? details.panelLocationOther || "Other"
            : details.panelLocation
        }
      />
      <ReviewRow label="Remodeling Area" value={details.remodelingAreas} />

      {/* ─── Plans & Electrical ───────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Plans & Electrical Needs" />
      <ReviewRow
        label="Has Plans/Drawings"
        value={details.hasPlansDrawings ? "Yes" : "No"}
      />
      {details.hasPlansDrawings && (
        <PhotosRow label="Plans/Drawings" photos={details.plansDrawings} />
      )}
      <ReviewRow label="Electrical Needs" value={details.electricalNeeds} />

      {/* ─── Permit ───────────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Permit" />
      <ReviewRow
        label="Permit Applied"
        value={details.permitApplied ? "Yes" : "No"}
      />
      {details.permitApplied && (
        <ReviewRow label="Permit Number" value={details.permitNumber} />
      )}

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Photos" />
      <PhotosRow
        label="Existing Space Photos"
        photos={details.existingSpacePhotos}
      />
      <PhotosRow label="Panel Photos" photos={details.panelPhotos} />

      {/* ─── Additional Information ───────────────────────────────────────────── */}
      <ReviewSectionTitle title="Additional Information" />
      <ReviewRow
        label="Additional Notes"
        value={details.additionalInformation}
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

export default RemodelingReviewForm;
