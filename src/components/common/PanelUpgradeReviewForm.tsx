import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { ReviewRow } from "@/src/components/quote/review/ReviewRow";
import { ReviewSectionTitle } from "@/src/components/quote/review/ReviewSectionTitle";
import { useCreatePanelUpgradeMutation } from "@/src/redux/api-slices/quote/quote-api-two";
import { RootState } from "@/src/redux/store";
import React from "react";
import {
  ScrollView as HorizontalScroll,
  Image,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { toast } from "sonner-native";

interface PanelUpgradeReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
}

// ─── Helper to build FormData ────────────────────────────────────────────────
const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

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
  setIsSubmitting,
  isSubmitting,
}: PanelUpgradeReviewFormProps) => {
  const [createPanelUpgrade] = useCreatePanelUpgradeMutation();

  // ─── Get values from Redux ────────────────────────────────────────────────────
  const contactDetails = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const serviceAddress = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const projectBasics = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  // ─── Get Panel Upgrade Details ────────────────────────────────────────────────
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

  const handleSubmit = async () => {
    const details = getPanelUpgradeDetails();

    // ─── Get values from draftData (API) or fallback to Redux ────────────────
    const finalFullName = draftData?.fullName || contactDetails.fullName;
    const finalEmail = draftData?.emailAddress || contactDetails.email;
    const finalPhone = draftData?.phoneNumber || contactDetails.phone;
    const finalPreferredContact =
      draftData?.preferredContactMethod || contactDetails.preferredContact;
    const finalStreetAddress =
      draftData?.streetAddress || serviceAddress.streetAddress;
    const finalApartment = draftData?.apartmentUnit || serviceAddress.apartment;
    const finalCity = draftData?.city || serviceAddress.city;
    const finalState = draftData?.state || serviceAddress.state;
    const finalZipCode = draftData?.zipCode || serviceAddress.zipCode;
    const finalPropertyType =
      draftData?.propertyType || projectBasics.propertyType;
    const finalOwnershipStatus =
      draftData?.ownershipStatus || projectBasics.ownershipStatus;
    const finalTimeline = draftData?.timelineUrgency || projectBasics.timeline;

    // ─── Validate required fields ─────────────────────────────────────────────
    if (!finalFullName) {
      toast.error("Please enter your full name");
      return;
    }
    if (!finalEmail) {
      toast.error("Please enter your email address");
      return;
    }
    if (!finalPhone) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!finalStreetAddress) {
      toast.error("Please enter your street address");
      return;
    }
    if (!finalCity) {
      toast.error("Please enter your city");
      return;
    }
    if (!finalState) {
      toast.error("Please enter your state");
      return;
    }
    if (!finalZipCode) {
      toast.error("Please enter your zip code");
      return;
    }
    if (!finalPropertyType) {
      toast.error("Please select property type");
      return;
    }

    const payload = {
      fullName: finalFullName,
      phoneNumber: finalPhone,
      emailAddress: finalEmail,
      preferredContactMethod: finalPreferredContact,
      streetAddress: finalStreetAddress,
      apartmentUnit: finalApartment,
      city: finalCity,
      state: finalState,
      zipCode: finalZipCode,
      propertyType: finalPropertyType,
      ownershipStatus: finalOwnershipStatus,
      timelineUrgency: finalTimeline,
      panelServiceType: details.panelServiceType,
      desiredPanelAmperage: details.desiredPanelAmperage,
      currentPanelAmperage:
        details.currentPanelAmperage === "Other"
          ? details.currentAmperageOther
          : details.currentPanelAmperage,
      powerFeedType: details.powerFeedType,
      panelLocation:
        details.panelLocation === "Other (please specify)"
          ? details.panelLocationOther
          : details.panelLocation,
      meterPhotos: details.meterPhotos,
      panelPhotos: details.panelPhotos,
      additionalInformation: details.additionalInformation,
      status: "submitted" as const,
      completionPercentage: 100,
    };

    console.log("Submitting Panel Upgrade payload:", payload);

    setIsSubmitting(true);
    try {
      const result = await createPanelUpgrade(
        createFormData(payload) as any,
      ).unwrap();

      console.log("Submit result:", result);

      if (result.success) {
        onSuccess();
      } else {
        toast.error(result.message || "Failed to submit request");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(
        error?.data?.message || "Failed to submit request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default PanelUpgradeReviewForm;
