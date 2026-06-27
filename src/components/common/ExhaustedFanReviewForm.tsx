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

interface ExhaustFanReviewFormProps {
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

const ExhaustFanReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: ExhaustFanReviewFormProps) => {
  // ─── Get Exhaust Fan Details ──────────────────────────────────────────────
  const getExhaustFanDetails = () => {
    if (categoryData?.categoryId === "14" && categoryData.details) {
      const details = categoryData.details as any;

      // ⭐ Priority: draftData first, then Redux (categoryData.details)
      return {
        installationType:
          draftData?.installationType || details.installationType || "",
        fanType: draftData?.fanType || details.fanType || "",
        fanLocation: draftData?.fanLocation || details.fanLocation || "",
        atticFanType: draftData?.atticFanType || details.atticFanType || "",
        stories: draftData?.stories || details.stories || "",
        existingFan: draftData?.existingFan || details.existingFan || "",
        supplyingAtticFan:
          draftData?.supplyingAtticFan || details.supplyingAtticFan || "",
        kitchenDuctInfo:
          draftData?.kitchenDuctInfo || details.kitchenDuctInfo || "",
        kitchenYesNo: draftData?.kitchenYesNo || details.kitchenYesNo || "",
        kitchenFanType:
          draftData?.kitchenFanType || details.kitchenFanType || "",
        kitchenAreas: draftData?.kitchenAreas?.length
          ? draftData.kitchenAreas
          : details.kitchenAreas || [],
        kitchenDist: draftData?.kitchenDist || details.kitchenDist || "",
        bathroomDuctInfo:
          draftData?.bathroomDuctInfo || details.bathroomDuctInfo || "",
        bathroomYesNo: draftData?.bathroomYesNo || details.bathroomYesNo || "",
        bathroomFanType:
          draftData?.bathroomFanType || details.bathroomFanType || "",
        specialtyControl:
          draftData?.specialtyControl || details.specialtyControl || "",
        bathroomAreas: draftData?.bathroomAreas?.length
          ? draftData.bathroomAreas
          : details.bathroomAreas || [],
        bathroomDist: draftData?.bathroomDist || details.bathroomDist || "",
        panelLocation: draftData?.panelLocation || details.panelLocation || "",
        panelLocationOther:
          draftData?.panelLocationOther || details.panelLocationOther || "",
        panelClosePhotos: draftData?.panelClosePhotos?.length
          ? draftData.panelClosePhotos
          : details.panelClosePhotos || [],
        panelWidePhotos: draftData?.panelWidePhotos?.length
          ? draftData.panelWidePhotos
          : details.panelWidePhotos || [],
        photosKitchenLocation: draftData?.photosKitchenLocation?.length
          ? draftData.photosKitchenLocation
          : details.photosKitchenLocation || [],
        photosKitchenCurrentFan: draftData?.photosKitchenCurrentFan?.length
          ? draftData.photosKitchenCurrentFan
          : details.photosKitchenCurrentFan || [],
        photosKitchenNewFan: draftData?.photosKitchenNewFan?.length
          ? draftData.photosKitchenNewFan
          : details.photosKitchenNewFan || [],
        photosBathromlocation: draftData?.photosBathromlocation?.length
          ? draftData.photosBathromlocation
          : details.photosBathromlocation || [],
        photosBathroomCurrentFan: draftData?.photosBathroomCurrentFan?.length
          ? draftData.photosBathroomCurrentFan
          : details.photosBathroomCurrentFan || [],
        photosBathroomNewFan: draftData?.photosBathroomNewFan?.length
          ? draftData.photosBathroomNewFan
          : details.photosBathroomNewFan || [],
        photosNewFan: draftData?.photosNewFan?.length
          ? draftData.photosNewFan
          : details.photosNewFan || [],
        photosAtticLocation: draftData?.photosAtticLocation?.length
          ? draftData.photosAtticLocation
          : details.photosAtticLocation || [],
        additionalNotes:
          draftData?.additionalNotes ||
          draftData?.additionalInformation ||
          details.additionalNotes ||
          "",
      };
    }
    return {
      installationType: "",
      fanType: "",
      fanLocation: "",
      atticFanType: "",
      stories: "",
      existingFan: "",
      supplyingAtticFan: "",
      kitchenDuctInfo: "",
      kitchenYesNo: "",
      kitchenFanType: "",
      kitchenAreas: [],
      kitchenDist: "",
      bathroomDuctInfo: "",
      bathroomYesNo: "",
      bathroomFanType: "",
      specialtyControl: "",
      bathroomAreas: [],
      bathroomDist: "",
      panelLocation: "",
      panelLocationOther: "",
      panelClosePhotos: [],
      panelWidePhotos: [],
      photosKitchenLocation: [],
      photosKitchenCurrentFan: [],
      photosKitchenNewFan: [],
      photosBathromlocation: [],
      photosBathroomCurrentFan: [],
      photosBathroomNewFan: [],
      photosNewFan: [],
      photosAtticLocation: [],
      additionalNotes: "",
    };
  };

  const details = getExhaustFanDetails();

  return (
    <View>
      {/* ─── Installation Details ───────────────────────────────────────────── */}
      <ReviewSectionTitle title="Installation Details" />
      <ReviewRow
        label="Install Type"
        value={details.installationType || "Not specified"}
      />
      <ReviewRow
        label="Fan Location"
        value={details.fanLocation || details.fanType || "Not specified"}
      />

      {/* ─── Attic Fan ──────────────────────────────────────────────────────── */}
      {details.fanType === "Attic" && (
        <>
          <ReviewSectionTitle title="Attic Details" />
          <ReviewRow
            label="Roof or Gable Fan"
            value={details.atticFanType || "Not specified"}
          />
          <ReviewRow
            label="Stories"
            value={details.stories || "Not specified"}
          />
          <ReviewRow
            label="Supplying Fan"
            value={
              details.existingFan === "Yes" ||
              details.supplyingAtticFan === "Yes"
                ? "Yes"
                : "No"
            }
          />
        </>
      )}

      {/* ─── Kitchen Fan ────────────────────────────────────────────────────── */}
      {details.fanType === "Kitchen" && (
        <>
          <ReviewSectionTitle title="Kitchen Details" />
          <ReviewRow
            label="Providing Fan"
            value={details.kitchenYesNo === "Yes" ? "Yes" : "No"}
          />
          <ReviewRow
            label="Fan Type"
            value={details.kitchenFanType || "Not specified"}
          />
          <ReviewRow
            label="Duct Info"
            value={details.kitchenDuctInfo || "Not specified"}
          />
          <ReviewRow
            label="Above/Below Area"
            value={details.kitchenAreas?.join(", ") || "Not specified"}
          />
          <ReviewRow
            label="Panel Distance"
            value={details.kitchenDist || "Not specified"}
          />
        </>
      )}

      {/* ─── Bathroom Fan ───────────────────────────────────────────────────── */}
      {details.fanType === "Bathroom" && (
        <>
          <ReviewSectionTitle title="Bathroom Details" />
          <ReviewRow
            label="Providing Fan"
            value={details.bathroomYesNo === "Yes" ? "Yes" : "No"}
          />
          <ReviewRow
            label="Fan Type"
            value={details.bathroomFanType || "Not specified"}
          />
          <ReviewRow
            label="Specialty Control"
            value={details.specialtyControl || "Not specified"}
          />
          <ReviewRow
            label="Duct Info"
            value={details.bathroomDuctInfo || "Not specified"}
          />
          <ReviewRow
            label="Above/Below Area"
            value={details.bathroomAreas?.join(", ") || "Not specified"}
          />
          <ReviewRow
            label="Panel Distance"
            value={details.bathroomDist || "Not specified"}
          />
        </>
      )}

      {/* ─── Panel Location ────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Panel Location" />
      <ReviewRow
        label="Panel Location"
        value={
          details.panelLocation === "Other"
            ? details.panelLocationOther || "Other"
            : details.panelLocation || "Not specified"
        }
      />

      {/* ─── Photos ─────────────────────────────────────────────────────────── */}
      {(details.panelClosePhotos.length > 0 ||
        details.panelWidePhotos.length > 0 ||
        details.photosKitchenLocation.length > 0 ||
        details.photosBathromlocation.length > 0 ||
        details.photosAtticLocation.length > 0) && (
        <ReviewSectionTitle title="Photos" />
      )}

      {details.panelClosePhotos.length > 0 && (
        <PhotosRow
          label="Panel Close-Up Photos"
          photos={details.panelClosePhotos}
        />
      )}

      {details.panelWidePhotos.length > 0 && (
        <PhotosRow
          label="Panel Wide Shot Photos"
          photos={details.panelWidePhotos}
        />
      )}

      {/* Conditionally show location photos based on fan type */}
      {details.fanType === "Kitchen" &&
        details.photosKitchenLocation.length > 0 && (
          <PhotosRow
            label="Kitchen Location Photos"
            photos={details.photosKitchenLocation}
          />
        )}

      {details.fanType === "Kitchen" &&
        details.photosKitchenCurrentFan.length > 0 && (
          <PhotosRow
            label="Current Kitchen Fan Photos"
            photos={details.photosKitchenCurrentFan}
          />
        )}

      {details.fanType === "Kitchen" &&
        details.photosKitchenNewFan.length > 0 && (
          <PhotosRow
            label="New Kitchen Fan Photos"
            photos={details.photosKitchenNewFan}
          />
        )}

      {details.fanType === "Bathroom" &&
        details.photosBathromlocation.length > 0 && (
          <PhotosRow
            label="Bathroom Location Photos"
            photos={details.photosBathromlocation}
          />
        )}

      {details.fanType === "Bathroom" &&
        details.photosBathroomCurrentFan.length > 0 && (
          <PhotosRow
            label="Current Bathroom Fan Photos"
            photos={details.photosBathroomCurrentFan}
          />
        )}

      {details.fanType === "Bathroom" &&
        details.photosBathroomNewFan.length > 0 && (
          <PhotosRow
            label="New Bathroom Fan Photos"
            photos={details.photosBathroomNewFan}
          />
        )}

      {details.fanType === "Attic" &&
        details.photosAtticLocation.length > 0 && (
          <PhotosRow
            label="Attic Location Photos"
            photos={details.photosAtticLocation}
          />
        )}

      {details.fanType === "Attic" && details.photosNewFan.length > 0 && (
        <PhotosRow label="New Fan Photos" photos={details.photosNewFan} />
      )}

      {/* ─── Additional Information ─────────────────────────────────────────── */}
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

export default ExhaustFanReviewForm;
