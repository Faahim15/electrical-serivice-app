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

interface NewConstructionReviewFormProps {
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

const NewConstructionReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: NewConstructionReviewFormProps) => {
  // ─── Get New Construction Details ──────────────────────────────────────────
  const getNewConstructionDetails = () => {
    if (categoryData?.categoryId === "10" && categoryData.details) {
      const details = categoryData.details as any;

      // ⭐ Priority: draftData first, then Redux (categoryData.details)
      const hasConstructionBegun =
        draftData?.hasConstructionBegun !== undefined
          ? draftData.hasConstructionBegun
          : details.constructionBegun === "Yes";

      return {
        hasConstructionBegun,
        stageOfConstruction:
          draftData?.stageOfConstruction || details.constructionStage || "",
        haveBuildingPlans:
          draftData?.haveBuildingPlans !== undefined
            ? draftData.haveBuildingPlans
            : details.hasBuildingPlans === "Yes",
        photosOfBuildingPlans: draftData?.photosOfBuildingPlans?.length
          ? draftData.photosOfBuildingPlans
          : hasConstructionBegun
            ? details.buildingPlanPhotos || []
            : details.buildingPlanPhotos2 || [],
      };
    }
    return {
      hasConstructionBegun: false,
      stageOfConstruction: "",
      haveBuildingPlans: false,
      photosOfBuildingPlans: [],
    };
  };

  const details = getNewConstructionDetails();

  // ─── Helper to format display values ────────────────────────────────────────
  const formatYesNo = (value: boolean) => (value ? "Yes" : "No");

  return (
    <View>
      {/* ─── Construction Status ────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Construction Status" />
      <ReviewRow
        label="Construction Begun"
        value={formatYesNo(details.hasConstructionBegun)}
      />
      {details.hasConstructionBegun && (
        <ReviewRow
          label="Construction Stage"
          value={details.stageOfConstruction || "Not specified"}
        />
      )}

      {/* ─── Building Plans ──────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Building Plans" />
      <ReviewRow
        label="Has Building Plans"
        value={formatYesNo(details.haveBuildingPlans)}
      />

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      {details.photosOfBuildingPlans.length > 0 && (
        <ReviewSectionTitle title="Photos" />
      )}
      {details.photosOfBuildingPlans.length > 0 && (
        <PhotosRow
          label="Building Plans Photos"
          photos={details.photosOfBuildingPlans}
        />
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

export default NewConstructionReviewForm;
