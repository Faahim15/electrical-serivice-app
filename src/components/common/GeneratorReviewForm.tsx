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

interface GeneratorReviewFormProps {
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

const GeneratorReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: GeneratorReviewFormProps) => {
  // ─── Get Generator Details ──────────────────────────────────────────────────
  const getGeneratorDetails = () => {
    if (categoryData?.categoryId === "9" && categoryData.details) {
      const details = categoryData.details as any;

      // ⭐ Priority: draftData first, then Redux (categoryData.details)
      return {
        generatorType: draftData?.generatorType || details.generatorType || "",
        isAlreadyHaveGenerator:
          draftData?.isAlreadyHaveGenerator !== undefined
            ? draftData.isAlreadyHaveGenerator
            : details.hasGenerator === "Yes",
        generatorOutputPower:
          draftData?.generatorOutputPower || details.kwOutput || "",
        preferredBackupInstallation:
          draftData?.preferredBackupInstallation ||
          details.backupInstallation ||
          "",
        generatorDistanceFromInletLocation:
          draftData?.generatorDistanceFromInletLocation ||
          details.panelDistance ||
          "",
        electricPanelLocation:
          draftData?.electricPanelLocation || details.panelLocation || "",
        sizeOfGeneratorWanted:
          draftData?.sizeOfGeneratorWanted || details.purchaseSize || "",
        backupNeeds: draftData?.backupNeeds || details.backedUpCircuits || "",
        isHavePropane:
          draftData?.isHavePropane !== undefined
            ? draftData.isHavePropane
            : details.hasPropane === "Yes",
        electricPanelPhotos: draftData?.electricPanelPhotos?.length
          ? draftData.electricPanelPhotos
          : details.panelPhotos || [],
        photosOfWhereGeneratorWillBeInlet: draftData
          ?.photosOfWhereGeneratorWillBeInlet?.length
          ? draftData.photosOfWhereGeneratorWillBeInlet
          : details.generatorPhotos || [],
        generatorInstallationLocationPhotos: draftData
          ?.generatorInstallationLocationPhotos?.length
          ? draftData.generatorInstallationLocationPhotos
          : details.installLocationPhotos || [],
        photosOfElectricalMeter: draftData?.photosOfElectricalMeter?.length
          ? draftData.photosOfElectricalMeter
          : details.meterPhotos || [],
      };
    }
    return {
      generatorType: "",
      isAlreadyHaveGenerator: false,
      generatorOutputPower: "",
      preferredBackupInstallation: "",
      generatorDistanceFromInletLocation: "",
      electricPanelLocation: "",
      sizeOfGeneratorWanted: "",
      backupNeeds: "",
      isHavePropane: false,
      electricPanelPhotos: [],
      photosOfWhereGeneratorWillBeInlet: [],
      generatorInstallationLocationPhotos: [],
      photosOfElectricalMeter: [],
    };
  };

  const details = getGeneratorDetails();

  // ─── Helper to format display values ────────────────────────────────────────
  const formatYesNo = (value: boolean) => (value ? "Yes" : "No");

  return (
    <View>
      {/* ─── Generator Type ──────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Generator Type" />
      <ReviewRow
        label="Generator Type"
        value={details.generatorType || "Not specified"}
      />

      {/* ─── Generator Ownership ────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Generator Ownership" />
      <ReviewRow
        label="Already Have Generator"
        value={formatYesNo(details.isAlreadyHaveGenerator)}
      />
      {details.isAlreadyHaveGenerator ? (
        <>
          <ReviewRow
            label="Generator Output Power"
            value={details.generatorOutputPower || "Not specified"}
          />
          <ReviewRow
            label="Panel Distance"
            value={
              details.generatorDistanceFromInletLocation || "Not specified"
            }
          />
        </>
      ) : (
        <ReviewRow
          label="Size of Generator Wanted"
          value={details.sizeOfGeneratorWanted || "Not specified"}
        />
      )}
      <ReviewRow
        label="Preferred Backup Installation"
        value={details.preferredBackupInstallation || "Not specified"}
      />
      <ReviewRow
        label="Panel Location"
        value={details.electricPanelLocation || "Not specified"}
      />

      {/* ─── Backup Needs ────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Backup Needs" />
      <ReviewRow
        label="Backup Needs"
        value={details.backupNeeds || "Not specified"}
      />
      <ReviewRow
        label="Has Propane"
        value={formatYesNo(details.isHavePropane)}
      />

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      {(details.electricPanelPhotos.length > 0 ||
        details.photosOfWhereGeneratorWillBeInlet.length > 0 ||
        details.generatorInstallationLocationPhotos.length > 0 ||
        details.photosOfElectricalMeter.length > 0) && (
        <ReviewSectionTitle title="Photos" />
      )}

      {details.electricPanelPhotos.length > 0 && (
        <PhotosRow label="Panel Photos" photos={details.electricPanelPhotos} />
      )}

      {details.photosOfWhereGeneratorWillBeInlet.length > 0 && (
        <PhotosRow
          label="Generator Inlet Photos"
          photos={details.photosOfWhereGeneratorWillBeInlet}
        />
      )}

      {details.generatorInstallationLocationPhotos.length > 0 && (
        <PhotosRow
          label="Installation Location Photos"
          photos={details.generatorInstallationLocationPhotos}
        />
      )}

      {details.photosOfElectricalMeter.length > 0 && (
        <PhotosRow
          label="Electrical Meter Photos"
          photos={details.photosOfElectricalMeter}
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

export default GeneratorReviewForm;
