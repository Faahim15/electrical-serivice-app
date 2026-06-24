import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { ReviewRow } from "@/src/components/quote/review/ReviewRow";
import { ReviewSectionTitle } from "@/src/components/quote/review/ReviewSectionTitle";
import { useDraftSave } from "@/src/hook/useDraftSave";
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

interface ExhaustFanReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
  serviceCallId?: string;
  serviceType?: string;
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

const ExhaustFanReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
  serviceCallId,
  serviceType,
}: ExhaustFanReviewFormProps) => {
  const { createDraft, updateDraft } = useDraftSave();

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

  // ─── Get Exhaust Fan Details ─────────────────────────────────────────────────
  const getExhaustFanDetails = () => {
    if (categoryData?.categoryId === "14" && categoryData.details) {
      const details = categoryData.details as any;
      return {
        installationType: details.installationType || "",
        fanType: details.fanType || "",
        fanLocation: details.fanLocation || "",
        atticFanType: details.atticFanType || "",
        stories: details.stories || "",
        existingFan: details.existingFan || "",
        supplyingAtticFan: details.supplyingAtticFan || "",
        kitchenDuctInfo: details.kitchenDuctInfo || "",
        kitchenYesNo: details.kitchenYesNo || "",
        kitchenFanType: details.kitchenFanType || "",
        kitchenAreas: details.kitchenAreas || [],
        kitchenDist: details.kitchenDist || "",
        bathroomDuctInfo: details.bathroomDuctInfo || "",
        bathroomYesNo: details.bathroomYesNo || "",
        bathroomFanType: details.bathroomFanType || "",
        specialtyControl: details.specialtyControl || "",
        bathroomAreas: details.bathroomAreas || [],
        bathroomDist: details.bathroomDist || "",
        panelLocation: details.panelLocation || "",
        panelLocationOther: details.panelLocationOther || "",
        panelClosePhotos: details.panelClosePhotos || [],
        panelWidePhotos: details.panelWidePhotos || [],
        photosKitchenLocation: details.photosKitchenLocation || [],
        photosKitchenCurrentFan: details.photosKitchenCurrentFan || [],
        photosKitchenNewFan: details.photosKitchenNewFan || [],
        photosBathromlocation: details.photosBathromlocation || [],
        photosBathroomCurrentFan: details.photosBathroomCurrentFan || [],
        photosBathroomNewFan: details.photosBathroomNewFan || [],
        photosNewFan: details.photosNewFan || [],
        photosAtticLocation: details.photosAtticLocation || [],
        additionalNotes: details.additionalNotes || "",
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

  const handleSubmit = async () => {
    const details = getExhaustFanDetails();

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

    if (!finalFullName) {
      toast.error("Please enter your full name");
      return;
    }

    // ─── Build payload matching API fields ────────────────────────────────────
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

      newOrReplacement: details.installationType || "",
      locationOfExhaustFan: details.fanLocation || details.fanType || "",
      isRoofOrGableFan: details.atticFanType || "",
      willSupplyAtticFan:
        details.existingFan === "Yes" || details.supplyingAtticFan === "Yes",
      howManyStories: parseInt(details.stories) || 0,
      whereElectricalPanelLocated:
        details.panelLocation === "Other"
          ? details.panelLocationOther
          : details.panelLocation || "",
      existingDuctAndVentDiameterLocation:
        details.kitchenDuctInfo || details.bathroomDuctInfo || "",
      willProvideKitchenExhaustFan: details.kitchenYesNo === "Yes",
      willProvideBathroomExhaustFan: details.bathroomYesNo === "Yes",
      typeOfExhaustFanWanted:
        details.kitchenFanType || details.bathroomFanType || "",
      specialityControlsWanted: details.specialtyControl || "",
      aboveBelowAreaOfExhaustFan:
        details.kitchenAreas?.length > 0
          ? details.kitchenAreas[0]
          : details.bathroomAreas?.length > 0
            ? details.bathroomAreas[0]
            : "",
      distanceOfElectricalPanelToExhaustFan:
        details.kitchenDist || details.bathroomDist || "",
      additionalInformation: details.additionalNotes || "",

      // ─── Photos ──────────────────────────────────────────────────────────────
      photosOfInstallationArea:
        details.photosKitchenLocation?.length > 0
          ? details.photosKitchenLocation
          : details.photosBathromlocation?.length > 0
            ? details.photosBathromlocation
            : details.photosAtticLocation || [],
      photoOfNewFan:
        details.photosNewFan?.length > 0
          ? details.photosNewFan
          : details.photosKitchenNewFan?.length > 0
            ? details.photosKitchenNewFan
            : details.photosBathroomNewFan || [],
      photosOfPanelCloseUp: details.panelClosePhotos || [],
      photosOfPanelWideShot: details.panelWidePhotos || [],
      photosOfCurrentKitchenExhaustFan: details.photosKitchenCurrentFan || [],
      photosOfCurrentBathroomExhaustFan: details.photosBathroomCurrentFan || [],

      status: "pending" as const,
      completionPercentage: 100,
    };

    console.log("Submitting Exhaust Fan payload:", payload);

    setIsSubmitting(true);
    try {
      let result;

      if (serviceCallId) {
        result = await updateDraft(
          serviceCallId,
          serviceType || "Exhaust Fan",
          createFormData(payload),
        );
        console.log("Updated existing draft:", result);
      } else {
        result = await createDraft(
          serviceType || "Exhaust Fan",
          createFormData({
            serviceType: serviceType || "Exhaust Fan",
            ...payload,
          }),
        );
        console.log("Created new draft:", result);
      }

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

  const details = getExhaustFanDetails();

  return (
    <View>
      {/* ─── Installation Details ─────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Installation Details" />
      <ReviewRow
        label="Install Type"
        value={details.installationType || "Not specified"}
      />
      <ReviewRow
        label="Fan Location"
        value={details.fanLocation || details.fanType || "Not specified"}
      />

      {/* ─── Attic Details ────────────────────────────────────────────────────── */}
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

      {/* ─── Kitchen Details ───────────────────────────────────────────────────── */}
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

      {/* ─── Bathroom Details ─────────────────────────────────────────────────── */}
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

      {/* ─── Panel Location ───────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Panel Location" />
      <ReviewRow
        label="Panel Location"
        value={
          details.panelLocation === "Other"
            ? details.panelLocationOther
            : details.panelLocation || "Not specified"
        }
      />

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      {(details.panelClosePhotos?.length > 0 ||
        details.panelWidePhotos?.length > 0 ||
        details.photosKitchenLocation?.length > 0 ||
        details.photosBathromlocation?.length > 0 ||
        details.photosAtticLocation?.length > 0) && (
        <ReviewSectionTitle title="Photos" />
      )}

      <PhotosRow
        label="Panel Close-Up Photos"
        photos={details.panelClosePhotos || []}
      />
      <PhotosRow
        label="Panel Wide Shot Photos"
        photos={details.panelWidePhotos || []}
      />
      <PhotosRow
        label="Installation Area Photos"
        photos={
          details.photosKitchenLocation?.length > 0
            ? details.photosKitchenLocation
            : details.photosBathromlocation?.length > 0
              ? details.photosBathromlocation
              : details.photosAtticLocation || []
        }
      />

      {/* ─── Additional Information ───────────────────────────────────────────── */}
      <ReviewSectionTitle title="Additional Information" />
      <ReviewRow
        label="Additional Notes"
        value={details.additionalNotes || "None provided"}
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

export default ExhaustFanReviewForm;
