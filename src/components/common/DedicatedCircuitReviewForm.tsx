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

interface DedicatedCircuitReviewFormProps {
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

const DedicatedCircuitReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: DedicatedCircuitReviewFormProps) => {
  // ─── Get Dedicated Circuit Details ────────────────────────────────────────
  const getDedicatedCircuitDetails = () => {
    if (categoryData?.categoryId === "13" && categoryData.details) {
      const details = categoryData.details as any;

      // ⭐ Priority: draftData first, then Redux (categoryData.details)
      return {
        whyNeedDedicatedCircuit:
          draftData?.whyNeedDedicatedCircuit ||
          details.whyNeedDedicatedCircuit ||
          "",
        electricalPanelLocation:
          draftData?.electricalPanelLocation ||
          details.electricalPanelLocation ||
          "",
        whereWillDedicatedCircuitInstalled:
          draftData?.whereWillDedicatedCircuitInstalled ||
          details.whereWillDedicatedCircuitInstalled ||
          "",
        aboveBelowArea:
          draftData?.aboveBelowArea || details.aboveBelowArea || "",
        distanceElectricalPanelToInstallationArea:
          draftData?.distanceElectricalPanelToInstallationArea ||
          details.distanceElectricalPanelToInstallationArea ||
          "",
        ampsNeeded: draftData?.ampsNeeded || details.ampsNeeded || "",
        voltsNeeded: draftData?.voltsNeeded || details.voltsNeeded || "",
        NEMAConfiguration:
          draftData?.NEMAConfiguration || details.NEMAConfiguration || "",
        photosOfElectricalMeter: draftData?.photosOfElectricalMeter?.length
          ? draftData.photosOfElectricalMeter
          : details.photosOfElectricalMeter || [],
        photosOfInstallationLocation: draftData?.photosOfInstallationLocation
          ?.length
          ? draftData.photosOfInstallationLocation
          : details.photosOfInstallationLocation || [],
        additionalInformation:
          draftData?.additionalInformation ||
          draftData?.additionalNotes ||
          details.additionalNotes ||
          "",
      };
    }
    return {
      whyNeedDedicatedCircuit: "",
      electricalPanelLocation: "",
      whereWillDedicatedCircuitInstalled: "",
      aboveBelowArea: "",
      distanceElectricalPanelToInstallationArea: "",
      ampsNeeded: "",
      voltsNeeded: "",
      NEMAConfiguration: "",
      photosOfElectricalMeter: [],
      photosOfInstallationLocation: [],
      additionalInformation: "",
    };
  };

  const details = getDedicatedCircuitDetails();

  return (
    <View>
      {/* ─── Circuit Details ────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Circuit Details" />
      <ReviewRow
        label="Intended Use"
        value={details.whyNeedDedicatedCircuit || "Not specified"}
      />
      <ReviewRow
        label="Panel Location"
        value={details.electricalPanelLocation || "Not specified"}
      />
      <ReviewRow
        label="Install Location"
        value={details.whereWillDedicatedCircuitInstalled || "Not specified"}
      />
      <ReviewRow
        label="Above/Below Area"
        value={details.aboveBelowArea || "Not specified"}
      />
      <ReviewRow
        label="Panel Distance"
        value={
          details.distanceElectricalPanelToInstallationArea || "Not specified"
        }
      />

      {/* ─── Electrical Specifications ─────────────────────────────────────── */}
      <ReviewSectionTitle title="Electrical Specifications" />
      <ReviewRow
        label="Amps Needed"
        value={
          details.ampsNeeded ? `${details.ampsNeeded} amps` : "Not specified"
        }
      />
      <ReviewRow
        label="Volts Needed"
        value={details.voltsNeeded || "Not specified"}
      />
      <ReviewRow
        label="NEMA Configuration"
        value={details.NEMAConfiguration || "Not specified"}
      />

      {/* ─── Photos ─────────────────────────────────────────────────────────── */}
      {(details.photosOfElectricalMeter.length > 0 ||
        details.photosOfInstallationLocation.length > 0) && (
        <ReviewSectionTitle title="Photos" />
      )}

      {details.photosOfElectricalMeter.length > 0 && (
        <PhotosRow
          label="Electrical Meter Photos"
          photos={details.photosOfElectricalMeter}
        />
      )}

      {details.photosOfInstallationLocation.length > 0 && (
        <PhotosRow
          label="Installation Path Photos"
          photos={details.photosOfInstallationLocation}
        />
      )}

      {/* ─── Additional Information ─────────────────────────────────────────── */}
      {details.additionalInformation && (
        <>
          <ReviewSectionTitle title="Additional Information" />
          <ReviewRow
            label="Additional Notes"
            value={details.additionalInformation || "None provided"}
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

export default DedicatedCircuitReviewForm;
