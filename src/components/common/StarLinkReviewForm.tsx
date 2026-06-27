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

interface StarlinkReviewFormProps {
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

const StarlinkReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: StarlinkReviewFormProps) => {
  // ─── Get Starlink Details ──────────────────────────────────────────────────
  const getStarlinkDetails = () => {
    if (categoryData?.categoryId === "12" && categoryData.details) {
      const details = categoryData.details as any;

      // ⭐ Priority: draftData first, then Redux (categoryData.details)
      return {
        haveStarlinkEquipment:
          draftData?.haveStarlinkEquipment !== undefined
            ? draftData.haveStarlinkEquipment
            : details.haveStarlinkEquipment === "Yes",
        whenHaveEquipment:
          draftData?.whenHaveEquipment || details.whenHaveEquipment || "",
        dishLocation: draftData?.dishLocation || details.dishLocation || "",
        haveMountingEquipment:
          draftData?.haveMountingEquipment !== undefined
            ? draftData.haveMountingEquipment
            : details.haveMountingEquipment === "Yes",
        roomOfRouterIn:
          draftData?.roomOfRouterIn || details.roomOfRouterIn || "",
        roomCondition: draftData?.roomCondition || details.roomCondition || "",
        areaOfInstallationPhotos: draftData?.areaOfInstallationPhotos?.length
          ? draftData.areaOfInstallationPhotos
          : details.areaOfInstallationPhotos || [],
        photosOfRoomForRouter: draftData?.photosOfRoomForRouter?.length
          ? draftData.photosOfRoomForRouter
          : details.photosOfRoomForRouter || [],
        additionalNotes:
          draftData?.additionalNotes ||
          draftData?.additionalInformation ||
          details.additionalNotes ||
          "",
      };
    }
    return {
      haveStarlinkEquipment: false,
      whenHaveEquipment: "",
      dishLocation: "",
      haveMountingEquipment: false,
      roomOfRouterIn: "",
      roomCondition: "",
      areaOfInstallationPhotos: [],
      photosOfRoomForRouter: [],
      additionalNotes: "",
    };
  };

  const details = getStarlinkDetails();

  // ─── Helper to format display values ────────────────────────────────────────
  const formatYesNo = (value: boolean) => (value ? "Yes" : "No");

  return (
    <View>
      {/* ─── Equipment Details ───────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Equipment Details" />
      <ReviewRow
        label="Have Starlink Equipment"
        value={formatYesNo(details.haveStarlinkEquipment)}
      />
      {!details.haveStarlinkEquipment && (
        <ReviewRow
          label="When Expect Equipment"
          value={details.whenHaveEquipment || "Not specified"}
        />
      )}
      <ReviewRow
        label="Have Mounting Equipment"
        value={formatYesNo(details.haveMountingEquipment)}
      />
      <ReviewRow
        label="Dish Location"
        value={details.dishLocation || "Not specified"}
      />

      {/* ─── Router Details ──────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Router Details" />
      <ReviewRow
        label="Router Room"
        value={details.roomOfRouterIn || "Not specified"}
      />
      <ReviewRow
        label="Room Condition"
        value={details.roomCondition || "Not specified"}
      />

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      {(details.areaOfInstallationPhotos.length > 0 ||
        details.photosOfRoomForRouter.length > 0) && (
        <ReviewSectionTitle title="Photos" />
      )}

      {details.areaOfInstallationPhotos.length > 0 && (
        <PhotosRow
          label="Installation Area Photos"
          photos={details.areaOfInstallationPhotos}
        />
      )}

      {details.photosOfRoomForRouter.length > 0 && (
        <PhotosRow
          label="Router Room Photos"
          photos={details.photosOfRoomForRouter}
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

export default StarlinkReviewForm;
