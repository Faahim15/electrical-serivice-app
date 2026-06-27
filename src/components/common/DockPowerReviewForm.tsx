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

interface DockPowerReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
  serviceCallId?: string;
  serviceType?: string;
}

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

const DockPowerReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: DockPowerReviewFormProps) => {
  const getDockPowerDetails = () => {
    if (categoryData?.categoryId === "7" && categoryData.details) {
      const details = categoryData.details as any;
      return {
        isDockBuilt:
          draftData?.isDockBuilt !== undefined
            ? draftData.isDockBuilt
            : details.dockBuilt === "Yes",
        electricalNeedsDetails:
          draftData?.electricalNeedsDetails || details.electricalNeeds || "",
        receptacleCount:
          draftData?.receptacleCount || parseInt(details.receptacleCount) || 0,
        electricalServiceType:
          draftData?.electricalServiceType || details.serviceType || "",
        subPanelSize: draftData?.subPanelSize || details.subPanelSize || "",
        panelLocation: draftData?.panelLocation || details.panelLocation || "",
        routeDistanceDetails:
          draftData?.routeDistanceDetails || details.routeDistance || "",
        hasPlansDrawings:
          draftData?.hasPlansDrawings !== undefined
            ? draftData.hasPlansDrawings
            : details.hasPlans === "Yes",
        plansDrawingsPhotos: draftData?.plansDrawingsPhotos?.length
          ? draftData.plansDrawingsPhotos
          : details.planDrawingPhotos || [],
        permitApplied:
          draftData?.permitApplied !== undefined
            ? draftData.permitApplied
            : details.hasPermit === "Yes",
        permitNumber: draftData?.permitNumber || details.permitNumber || "",
        additionalInformation:
          draftData?.additionalInformation || details.additionalInfo || "",
        panelPhotos: draftData?.panelPhotos?.length
          ? draftData.panelPhotos
          : details.panelPhotos || [],
        existingSpacePhotos: draftData?.existingSpacePhotos?.length
          ? draftData.existingSpacePhotos
          : details.existingSpacePhotos || [],
        privateUtilities: details.privateUtilities || "",
      };
    }
    return {
      isDockBuilt: false,
      electricalNeedsDetails: "",
      receptacleCount: 0,
      electricalServiceType: "",
      subPanelSize: "",
      panelLocation: "",
      routeDistanceDetails: "",
      hasPlansDrawings: false,
      plansDrawingsPhotos: [],
      permitApplied: false,
      permitNumber: "",
      additionalInformation: "",
      panelPhotos: [],
      existingSpacePhotos: [],
      privateUtilities: "",
    };
  };

  const details = getDockPowerDetails();

  return (
    <View>
      <ReviewSectionTitle title="Dock Basics" />
      <ReviewRow
        label="Dock Built"
        value={details.isDockBuilt ? "Yes" : "No"}
      />
      <ReviewRow
        label="Electrical Needs"
        value={details.electricalNeedsDetails || "Not specified"}
      />
      <ReviewRow
        label="Receptacle Count"
        value={String(details.receptacleCount) || "0"}
      />

      <ReviewSectionTitle title="Power Requirements" />
      <ReviewRow
        label="Service Type"
        value={details.electricalServiceType || "Not specified"}
      />
      {details.electricalServiceType === "Sub-panel" && (
        <ReviewRow
          label="Sub-Panel Size"
          value={details.subPanelSize || "Not specified"}
        />
      )}
      <ReviewRow
        label="Panel Location"
        value={details.panelLocation || "Not specified"}
      />

      <ReviewSectionTitle title="Route Details" />
      <ReviewRow
        label="Route Distance"
        value={details.routeDistanceDetails || "Not specified"}
      />

      <ReviewSectionTitle title="Plans & Permit" />
      <ReviewRow
        label="Has Plans/Drawings"
        value={details.hasPlansDrawings ? "Yes" : "No"}
      />
      <ReviewRow
        label="Permit Applied"
        value={details.permitApplied ? "Yes" : "No"}
      />

      <ReviewSectionTitle title="Photos" />
      <PhotosRow
        label="Dock & Surrounding Area"
        photos={details.existingSpacePhotos}
      />
      <PhotosRow label="Panel Photos" photos={details.panelPhotos} />
      {details.hasPlansDrawings && (
        <PhotosRow
          label="Plans/Drawings Photos"
          photos={details.plansDrawingsPhotos}
        />
      )}

      <ReviewSectionTitle title="Additional Information" />
      <ReviewRow
        label="Additional Notes"
        value={details.additionalInformation || "None provided"}
      />

      <GradientButton
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={onSuccess}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default DockPowerReviewForm;
