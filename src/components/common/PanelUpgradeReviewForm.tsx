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

interface PanelUpgradeReviewFormProps {
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

const PanelUpgradeReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: PanelUpgradeReviewFormProps) => {
  const getPanelUpgradeDetails = () => {
    if (categoryData?.categoryId === "3" && categoryData.details) {
      const details = categoryData.details as any;
      return {
        panelServiceType:
          draftData?.panelServiceType || details.serviceType || "",
        desiredPanelAmperage:
          draftData?.desiredPanelAmperage || details.upgradeAmps || "",
        currentPanelAmperage:
          draftData?.currentPanelAmperage || details.currentAmperage || "",
        currentAmperageOther: details.currentAmperageOther || "",
        powerFeedType: draftData?.powerFeedType || details.powerType || "",
        panelLocation: draftData?.panelLocation || details.panelLocation || "",
        panelLocationOther: details.panelLocationOther || "",
        meterPhotos: draftData?.meterPhotos?.length
          ? draftData.meterPhotos
          : details.meterPhotos || [],
        panelPhotos: draftData?.panelPhotos?.length
          ? draftData.panelPhotos
          : details.panelPhotos || [],
        additionalInformation:
          draftData?.additionalInformation || details.additionalInfo || "",
      };
    }
    return {
      panelServiceType: "",
      desiredPanelAmperage: "",
      currentPanelAmperage: "",
      currentAmperageOther: "",
      powerFeedType: "",
      panelLocation: "",
      panelLocationOther: "",
      meterPhotos: [],
      panelPhotos: [],
      additionalInformation: "",
    };
  };

  const details = getPanelUpgradeDetails();

  return (
    <View>
      {/* ─── Panel Service ────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Panel Service" />
      <ReviewRow label="Service Type" value={details.panelServiceType} />
      {details.panelServiceType === "Upgrade" && (
        <ReviewRow
          label="Desired Panel Amperage"
          value={details.desiredPanelAmperage}
        />
      )}

      {/* ─── Current Panel Details ────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Current Panel Details" />
      <ReviewRow
        label="Current Panel Amperage"
        value={
          details.currentPanelAmperage === "Other"
            ? details.currentAmperageOther || "Other"
            : details.currentPanelAmperage
        }
      />
      <ReviewRow label="Power Feed Type" value={details.powerFeedType} />

      {/* ─── Panel Location ───────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Panel Location" />
      <ReviewRow
        label="Panel Location"
        value={
          details.panelLocation === "Other (please specify)"
            ? details.panelLocationOther || "Other"
            : details.panelLocation
        }
      />

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Photos" />
      <PhotosRow label="Meter Photos" photos={details.meterPhotos} />
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

export default PanelUpgradeReviewForm;
