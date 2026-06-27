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

interface OutletsReviewFormProps {
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

const OutletsReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: OutletsReviewFormProps) => {
  // ─── Get Outlets Details ──────────────────────────────────────────────────
  const getDetails = () => {
    if (categoryData?.categoryId === "15" && categoryData.details) {
      const d = categoryData.details as any;

      // ⭐ Priority: draftData first, then Redux (categoryData.details)
      return {
        intendedUse: draftData?.intendedUse || d.intendedUse || "",
        numberOfOutlets: draftData?.numberOfOutlets || d.numberOfOutlets || "",
        installationType:
          draftData?.installationType || d.installationType || "",
        outletTypes: draftData?.outletTypes?.length
          ? draftData.outletTypes
          : d.outletTypes || [],
        ampsNeeded: draftData?.ampsNeeded || d.ampsNeeded || "",
        voltsNeeded: draftData?.voltsNeeded || d.voltsNeeded || "",
        NEMAConfiguration:
          draftData?.NEMAConfiguration || d.NEMAConfiguration || "",
        photosOfWhereOutletsInstall: draftData?.photosOfWhereOutletsInstall
          ?.length
          ? draftData.photosOfWhereOutletsInstall
          : d.photosOfWhereOutletsInstall || [],
        additionalInformation:
          draftData?.additionalInformation ||
          draftData?.additionalNotes ||
          d.additionalNotes ||
          "",
      };
    }
    return {
      intendedUse: "",
      numberOfOutlets: "",
      installationType: "",
      outletTypes: [],
      ampsNeeded: "",
      voltsNeeded: "",
      NEMAConfiguration: "",
      photosOfWhereOutletsInstall: [],
      additionalInformation: "",
    };
  };

  const details = getDetails();

  return (
    <View>
      {/* ─── Outlet Details ──────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Outlet Details" />
      <ReviewRow
        label="Intended Use"
        value={details.intendedUse || "Not specified"}
      />
      <ReviewRow
        label="Number of Outlets"
        value={details.numberOfOutlets || "Not specified"}
      />
      <ReviewRow
        label="Installation Type"
        value={details.installationType || "Not specified"}
      />
      <ReviewRow
        label="Outlet Types"
        value={
          details.outletTypes?.length
            ? details.outletTypes.join(", ")
            : "Not specified"
        }
      />

      {/* ─── Electrical Specifications ───────────────────────────────────────── */}
      <ReviewSectionTitle title="Electrical Specifications" />
      <ReviewRow
        label="Amps"
        value={
          details.ampsNeeded ? `${details.ampsNeeded} amps` : "Not specified"
        }
      />
      <ReviewRow label="Volts" value={details.voltsNeeded || "Not specified"} />
      <ReviewRow
        label="NEMA Configuration"
        value={details.NEMAConfiguration || "Not specified"}
      />

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      {details.photosOfWhereOutletsInstall.length > 0 && (
        <ReviewSectionTitle title="Photos" />
      )}
      {details.photosOfWhereOutletsInstall.length > 0 && (
        <PhotosRow
          label="Installation Area Photos"
          photos={details.photosOfWhereOutletsInstall}
        />
      )}

      {/* ─── Additional Information ───────────────────────────────────────────── */}
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

export default OutletsReviewForm;
