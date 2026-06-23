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

interface AccessoryBuildingReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
  serviceCallId?: string;
  serviceType?: string; // ← Add this prop
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

const AccessoryBuildingReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
  serviceCallId,
  serviceType, // ← Receive serviceType
}: AccessoryBuildingReviewFormProps) => {
  const { createDraft, updateDraft } = useDraftSave();

  const contactDetails = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const serviceAddress = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const projectBasics = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  // ─── Get Accessory Building Details ──────────────────────────────────────────
  const getAccessoryBuildingDetails = () => {
    if (categoryData?.categoryId === "5" && categoryData.details) {
      const details = categoryData.details as any;

      const isNewService = details.serviceType === "New Service";
      const isSubPanel = details.serviceType === "Sub-panel";
      const isDedicatedCircuits =
        details.serviceType === "1-2 dedicated circuits";

      const resolvedServiceSize = isNewService
        ? details.newServiceSize === "Other"
          ? details.newServiceSizeOther
          : details.newServiceSize
        : isSubPanel
          ? details.subPanelSize === "Other"
            ? details.subPanelSizeOther
            : details.subPanelSize
          : isDedicatedCircuits
            ? `${details.circuitCount} circuit(s) @ ${details.ampRating}A`
            : "";

      const combinedRouteDetails = [
        details.privateUtilities,
        details.routeDistance,
      ]
        .filter(Boolean)
        .join(" | ");

      return {
        entireSquareFootage:
          draftData?.entireSquareFootage || Number(details.squareFootage) || 0,
        intendedUse: draftData?.intendedUse || details.intendedUse || "",
        buildingStatus:
          draftData?.buildingStatus || details.buildingStatus || "",
        constructionType:
          draftData?.constructionType || details.constructionType || "",
        floorType: draftData?.floorType || details.floorType || "",
        electricalNeeds:
          draftData?.electricalNeeds || details.electricalNeeds || "",
        hasHeatingOrCooling:
          draftData?.hasHeatingOrCooling !== undefined
            ? draftData.hasHeatingOrCooling
            : details.hasHeatingCooling === "Yes",
        electricalServiceType:
          draftData?.electricalServiceType || details.serviceType || "",
        serviceSize: draftData?.serviceSize || resolvedServiceSize || "",
        panelLocation:
          draftData?.panelLocation ||
          (details.panelLocation === "Other (please specify)"
            ? details.panelLocationOther
            : details.panelLocation) ||
          "",
        routeDetails: draftData?.routeDetails || combinedRouteDetails || "",
        hasPlansDrawings:
          draftData?.hasPlansDrawings !== undefined
            ? draftData.hasPlansDrawings
            : details.hasPlans === "Yes",
        plansDrawings: draftData?.plansDrawings?.length
          ? draftData.plansDrawings
          : details.planDrawingPhotos || [],
        permitApplied:
          draftData?.permitApplied !== undefined
            ? draftData.permitApplied
            : details.hasPermit === "Yes",
        permitNumber: draftData?.permitNumber || details.permitNumber || "",
        existingSpacePhotos: draftData?.existingSpacePhotos?.length
          ? draftData.existingSpacePhotos
          : details.existingSpacePhotos || [],
        panelPhotos: draftData?.panelPhotos?.length
          ? draftData.panelPhotos
          : details.panelPhotos || [],
        additionalInformation:
          draftData?.additionalInformation || details.additionalInfo || "",
      };
    }
    return {
      entireSquareFootage: 0,
      intendedUse: "",
      buildingStatus: "",
      constructionType: "",
      floorType: "",
      electricalNeeds: "",
      hasHeatingOrCooling: false,
      electricalServiceType: "",
      serviceSize: "",
      panelLocation: "",
      routeDetails: "",
      hasPlansDrawings: false,
      plansDrawings: [],
      permitApplied: false,
      permitNumber: "",
      existingSpacePhotos: [],
      panelPhotos: [],
      additionalInformation: "",
    };
  };

  const handleSubmit = async () => {
    const details = getAccessoryBuildingDetails();

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
      entireSquareFootage: details.entireSquareFootage,
      intendedUse: details.intendedUse,
      buildingStatus: details.buildingStatus,
      constructionType: details.constructionType,
      floorType: details.floorType,
      electricalNeeds: details.electricalNeeds,
      hasHeatingOrCooling: details.hasHeatingOrCooling,
      electricalServiceType: details.electricalServiceType,
      serviceSize: details.serviceSize,
      panelLocation: details.panelLocation,
      routeDetails: details.routeDetails,
      hasPlansDrawings: details.hasPlansDrawings,
      plansDrawings: details.plansDrawings,
      permitApplied: details.permitApplied,
      permitNumber: details.permitNumber,
      existingSpacePhotos: details.existingSpacePhotos,
      panelPhotos: details.panelPhotos,
      additionalInformation: details.additionalInformation,
      status: "pending" as const,
      completionPercentage: 100,
    };

    console.log("Submitting Accessory Building payload:", payload);

    setIsSubmitting(true);
    try {
      let result;

      // ─── Check if we have an ID (existing draft) or not ─────────────────────
      if (serviceCallId) {
        // ✅ UPDATE - existing draft
        result = await updateDraft(
          serviceCallId,
          serviceType || "Accessory Building / Shed Power", // ← Use dynamic serviceType
          createFormData(payload),
        );
        console.log("Updated existing draft:", result);
      } else {
        // ✅ CREATE - new draft
        result = await createDraft(
          serviceType || "Accessory Building / Shed Power", // ← Use dynamic serviceType
          createFormData({
            serviceType: serviceType || "Accessory Building / Shed Power",
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

  const details = getAccessoryBuildingDetails();

  return (
    <View>
      <ReviewSectionTitle title="Building Basics" />
      <ReviewRow
        label="Square Footage"
        value={String(details.entireSquareFootage)}
      />
      <ReviewRow label="Intended Use" value={details.intendedUse} />

      <ReviewSectionTitle title="Construction Details" />
      <ReviewRow label="Building Status" value={details.buildingStatus} />
      <ReviewRow label="Construction Type" value={details.constructionType} />
      <ReviewRow label="Floor Type" value={details.floorType} />

      <ReviewSectionTitle title="Electrical Needs" />
      <ReviewRow label="Electrical Needs" value={details.electricalNeeds} />
      <ReviewRow
        label="Heating/Cooling Equipment"
        value={details.hasHeatingOrCooling ? "Yes" : "No"}
      />

      <ReviewSectionTitle title="Service Type" />
      <ReviewRow
        label="Electrical Service Type"
        value={details.electricalServiceType}
      />
      <ReviewRow label="Service Size" value={details.serviceSize} />
      <ReviewRow label="Panel Location" value={details.panelLocation} />

      <ReviewSectionTitle title="Route Details" />
      <ReviewRow label="Route Details" value={details.routeDetails} />

      <ReviewSectionTitle title="Plans & Permit" />
      <ReviewRow
        label="Has Plans/Drawings"
        value={details.hasPlansDrawings ? "Yes" : "No"}
      />
      {details.hasPlansDrawings && (
        <PhotosRow label="Plans/Drawings" photos={details.plansDrawings} />
      )}
      <ReviewRow
        label="Permit Applied"
        value={details.permitApplied ? "Yes" : "No"}
      />
      {details.permitApplied && (
        <ReviewRow label="Permit Number" value={details.permitNumber} />
      )}

      <ReviewSectionTitle title="Photos" />
      <PhotosRow
        label="Existing Space / Route Photos"
        photos={details.existingSpacePhotos}
      />
      <PhotosRow label="Panel Photos" photos={details.panelPhotos} />

      <ReviewSectionTitle title="Additional Information" />
      <ReviewRow
        label="Additional Notes"
        value={details.additionalInformation}
      />

      <GradientButton
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default AccessoryBuildingReviewForm;
