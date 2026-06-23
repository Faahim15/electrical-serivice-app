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

interface DockPowerReviewFormProps {
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

const DockPowerReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
  serviceCallId,
  serviceType,
}: DockPowerReviewFormProps) => {
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

  // ─── Get Dock Power Details ──────────────────────────────────────────────────
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
        // Note: permitNumber might not be in DockPowerRecord, but we can get it from Redux
        permitNumber: draftData?.permitNumber || details.permitNumber || "",
        additionalInformation:
          draftData?.additionalInformation || details.additionalInfo || "",
        panelPhotos: draftData?.panelPhotos?.length
          ? draftData.panelPhotos
          : details.panelPhotos || [],
        existingSpacePhotos: draftData?.existingSpacePhotos?.length
          ? draftData.existingSpacePhotos
          : details.existingSpacePhotos || [],
        // For private utilities - might be in Redux but not in draft response
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

  const handleSubmit = async () => {
    const details = getDockPowerDetails();

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

    // ─── Build payload matching DockPowerPayload ─────────────────────────────
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
      isDockBuilt: details.isDockBuilt,
      electricalNeedsDetails: details.electricalNeedsDetails,
      receptacleCount: details.receptacleCount,
      electricalServiceType: details.electricalServiceType,
      subPanelSize: details.subPanelSize,
      panelLocation: details.panelLocation,
      routeDistanceDetails: details.routeDistanceDetails,
      hasPlansDrawings: details.hasPlansDrawings,
      plansDrawingsPhotos: details.plansDrawingsPhotos,
      permitApplied: details.permitApplied,
      // permitNumber is not in the payload, but we can include if API expects it
      // If API has a separate field for permit number, add it here
      additionalInformation: details.additionalInformation,
      panelPhotos: details.panelPhotos,
      existingSpacePhotos: details.existingSpacePhotos,
      status: "pending" as const,
      completionPercentage: 100,
    };

    // Only add permitNumber if the field exists in the payload type
    // If your API expects permitNumber, uncomment this:
    // if (details.permitNumber) {
    //   (payload as any).permitNumber = details.permitNumber;
    // }

    console.log("Submitting Dock Power payload:", payload);

    setIsSubmitting(true);
    try {
      let result;

      // ─── Check if we have an ID (existing draft) or not ─────────────────────
      if (serviceCallId) {
        // ✅ UPDATE - existing draft
        result = await updateDraft(
          serviceCallId,
          serviceType || "Dock Power",
          createFormData(payload),
        );
        console.log("Updated existing draft:", result);
      } else {
        // ✅ CREATE - new draft
        result = await createDraft(
          serviceType || "Dock Power",
          createFormData({
            serviceType: serviceType || "Dock Power",
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

  const details = getDockPowerDetails();

  return (
    <View>
      {/* ─── Dock Basics ───────────────────────────────────────────────────────── */}
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

      {/* ─── Power Requirements ────────────────────────────────────────────────── */}
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

      {/* ─── Route Details ────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Route Details" />
      <ReviewRow
        label="Route Distance"
        value={details.routeDistanceDetails || "Not specified"}
      />

      {/* ─── Plans & Permit ───────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Plans & Permit" />
      <ReviewRow
        label="Has Plans/Drawings"
        value={details.hasPlansDrawings ? "Yes" : "No"}
      />
      <ReviewRow
        label="Permit Applied"
        value={details.permitApplied ? "Yes" : "No"}
      />

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
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

      {/* ─── Additional Information ───────────────────────────────────────────── */}
      <ReviewSectionTitle title="Additional Information" />
      <ReviewRow
        label="Additional Notes"
        value={details.additionalInformation || "None provided"}
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

export default DockPowerReviewForm;
