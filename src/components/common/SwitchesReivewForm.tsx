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

interface SwitchesReviewFormProps {
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

// ─── Tags Row Component ─────────────────────────────────────────────────────
const TagsRow = ({ label, tags }: { label: string; tags: string[] }) => (
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
    {tags?.length > 0 ? (
      <View className="flex-row flex-wrap gap-2">
        {tags.map((tag, index) => (
          <View key={index} className="bg-[#EFF6FF] px-3 py-1.5 rounded-full">
            <Text className="text-[#4AA9F5] text-[13px] font-Inter_Medium">
              {tag}
            </Text>
          </View>
        ))}
      </View>
    ) : (
      <Text className="text-[#1E293B] text-[14px] font-Inter_SemiBold">
        None selected
      </Text>
    )}
  </View>
);

const SwitchesReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: SwitchesReviewFormProps) => {
  // ─── Get Switches Details ────────────────────────────────────────────────────
  const getSwitchesDetails = () => {
    if (categoryData?.categoryId === "16" && categoryData.details) {
      const details = categoryData.details as any;

      // ⭐ Priority: draftData first, then Redux (categoryData.details)
      return {
        howManySwitchesNeeded:
          draftData?.howManySwitchesNeeded ||
          details.howManySwitchesNeeded ||
          "",
        isNewInstallationOrReplacement:
          draftData?.isNewInstallationOrReplacement ||
          details.isNewInstallationOrReplacement ||
          "",
        photosOfWhereSwitchesInstallationNeeded:
          // Check if draftData has photos
          (draftData?.photosOfWhereSwitchesInstallationNeeded?.length
            ? draftData.photosOfWhereSwitchesInstallationNeeded
            : details.photosOfWhereSwitchesInstallationNeeded) || [],
        typeOfSwitchesNeeded:
          (draftData?.typeOfSwitchesNeeded?.length
            ? draftData.typeOfSwitchesNeeded
            : details.typeOfSwitchesNeeded) || [],
        additionalInformation:
          draftData?.additionalInformation ||
          details.additionalInformation ||
          "",
      };
    }
    return {
      howManySwitchesNeeded: "",
      isNewInstallationOrReplacement: "",
      photosOfWhereSwitchesInstallationNeeded: [],
      typeOfSwitchesNeeded: [],
      additionalInformation: "",
    };
  };

  const details = getSwitchesDetails();

  return (
    <View>
      {/* ─── Switch Details ───────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Switch Details" />
      <ReviewRow
        label="Number of Switches"
        value={details.howManySwitchesNeeded || "Not specified"}
      />
      <ReviewRow
        label="Installation Type"
        value={details.isNewInstallationOrReplacement || "Not specified"}
      />

      {/* ─── Switch Types ────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Switch Types" />
      <TagsRow
        label="Selected Switch Types"
        tags={details.typeOfSwitchesNeeded}
      />

      {/* ─── Additional Notes ────────────────────────────────────────────────── */}
      {details.additionalInformation && (
        <>
          <ReviewSectionTitle title="Additional Notes" />
          <ReviewRow label="Notes" value={details.additionalInformation} />
        </>
      )}

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      {details.photosOfWhereSwitchesInstallationNeeded.length > 0 && (
        <ReviewSectionTitle title="Photos" />
      )}
      {details.photosOfWhereSwitchesInstallationNeeded.length > 0 && (
        <PhotosRow
          label="Installation Location Photos"
          photos={details.photosOfWhereSwitchesInstallationNeeded}
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

export default SwitchesReviewForm;
