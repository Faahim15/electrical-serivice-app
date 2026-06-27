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

interface CeilingFanReviewFormProps {
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

const CeilingFanReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: CeilingFanReviewFormProps) => {
  // ─── Get Ceiling Fan Details ────────────────────────────────────────────────
  const getCeilingFanDetails = () => {
    if (categoryData?.categoryId === "18" && categoryData.details) {
      const details = categoryData.details as any;

      // ⭐ Priority: draftData first, then Redux (categoryData.details)
      return {
        // St1 - Installation Type
        installationType:
          draftData?.installationType || details.installationType || "",
        photosOfCurrentCeilingFan: draftData?.photosOfCurrentCeilingFan?.length
          ? draftData.photosOfCurrentCeilingFan
          : details.photosOfCurrentCeilingFan || [],
        aboveBelowAreaOfCeilingFan:
          draftData?.aboveBelowAreaOfCeilingFan ||
          details.aboveBelowAreaOfCeilingFan ||
          "",
        isThereCurrentLightFixture:
          draftData?.isThereCurrentLightFixture !== undefined
            ? draftData.isThereCurrentLightFixture
            : details.isThereCurrentLightFixture === "Yes",
        wasAreaPrewired:
          draftData?.wasAreaPrewired || details.wasAreaPrewired || "",

        // St2 - Fan Details
        willProvideNewCeilingFan:
          draftData?.willProvideNewCeilingFan !== undefined
            ? draftData.willProvideNewCeilingFan
            : details.willProvideNewCeilingFan === "Yes",
        photosOfNewCeilingFan: draftData?.photosOfNewCeilingFan?.length
          ? draftData.photosOfNewCeilingFan
          : details.photosOfNewCeilingFan || [],
        describeFanWantInstalled:
          draftData?.describeFanWantInstalled ||
          details.describeFanWantInstalled ||
          "",
        tallOfCeilingFanFromFloor:
          draftData?.tallOfCeilingFanFromFloor ||
          details.tallOfCeilingFanFromFloor ||
          "",

        // St3 - Switch Details
        willConnectNewOrExistingSwitch:
          draftData?.willConnectNewOrExistingSwitch ||
          details.willConnectNewOrExistingSwitch ||
          "",
        wantUpgradeSwitch:
          draftData?.wantUpgradeSwitch !== undefined
            ? draftData.wantUpgradeSwitch
            : details.wantUpgradeSwitch === "Yes",
        kindOfSwitchWant:
          draftData?.kindOfSwitchWant || details.kindOfSwitchWant || "",

        // St4 - Additional Notes
        additionalInformation:
          draftData?.additionalInformation ||
          details.additionalInformation ||
          "",
      };
    }
    return {
      installationType: "",
      photosOfCurrentCeilingFan: [],
      aboveBelowAreaOfCeilingFan: "",
      isThereCurrentLightFixture: false,
      wasAreaPrewired: "",
      willProvideNewCeilingFan: false,
      photosOfNewCeilingFan: [],
      describeFanWantInstalled: "",
      tallOfCeilingFanFromFloor: "",
      willConnectNewOrExistingSwitch: "",
      wantUpgradeSwitch: false,
      kindOfSwitchWant: "",
      additionalInformation: "",
    };
  };

  const details = getCeilingFanDetails();

  // ─── Helper to format display values ────────────────────────────────────────
  const formatYesNo = (value: boolean) => (value ? "Yes" : "No");

  return (
    <View>
      {/* ─── Installation Type ────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Installation Details" />
      <ReviewRow
        label="Installation Type"
        value={details.installationType || "Not specified"}
      />

      {/* ─── Above/Below Area ────────────────────────────────────────────────── */}
      {details.installationType === "New Install" && (
        <>
          <ReviewRow
            label="Above/Below Area"
            value={details.aboveBelowAreaOfCeilingFan || "Not specified"}
          />
          <ReviewRow
            label="Current Light Fixture"
            value={formatYesNo(details.isThereCurrentLightFixture)}
          />
          <ReviewRow
            label="Area Prewired"
            value={details.wasAreaPrewired || "Not specified"}
          />
        </>
      )}

      {/* ─── Fan Details ─────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Fan Details" />
      <ReviewRow
        label="Providing New Fan"
        value={formatYesNo(details.willProvideNewCeilingFan)}
      />

      {!details.willProvideNewCeilingFan && (
        <ReviewRow
          label="Fan Description"
          value={details.describeFanWantInstalled || "Not specified"}
        />
      )}

      <ReviewRow
        label="Ceiling Height"
        value={details.tallOfCeilingFanFromFloor || "Not specified"}
      />

      {/* ─── Switch Details ──────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Switch Details" />
      <ReviewRow
        label="Switch Connection"
        value={details.willConnectNewOrExistingSwitch || "Not specified"}
      />

      {details.willConnectNewOrExistingSwitch === "Existing" && (
        <ReviewRow
          label="Upgrade Switch"
          value={formatYesNo(details.wantUpgradeSwitch)}
        />
      )}

      {(details.willConnectNewOrExistingSwitch === "New" ||
        (details.willConnectNewOrExistingSwitch === "Existing" &&
          details.wantUpgradeSwitch)) && (
        <ReviewRow
          label="Switch Type"
          value={details.kindOfSwitchWant || "Not specified"}
        />
      )}

      {details.willConnectNewOrExistingSwitch ===
        "My fan comes with a remote" && (
        <ReviewRow label="Remote" value="Comes with remote" />
      )}

      {/* ─── Additional Notes ────────────────────────────────────────────────── */}
      {details.additionalInformation && (
        <>
          <ReviewSectionTitle title="Additional Notes" />
          <ReviewRow label="Notes" value={details.additionalInformation} />
        </>
      )}

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      {(details.photosOfCurrentCeilingFan.length > 0 ||
        details.photosOfNewCeilingFan.length > 0) && (
        <ReviewSectionTitle title="Photos" />
      )}

      {details.photosOfCurrentCeilingFan.length > 0 && (
        <PhotosRow
          label="Current Fan Photos"
          photos={details.photosOfCurrentCeilingFan}
        />
      )}

      {details.photosOfNewCeilingFan.length > 0 && (
        <PhotosRow
          label="New Fan Photos"
          photos={details.photosOfNewCeilingFan}
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

export default CeilingFanReviewForm;
