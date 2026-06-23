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

interface RemodelingReviewFormProps {
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

const RemodelingReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
  serviceCallId,
  serviceType,
}: RemodelingReviewFormProps) => {
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

  // ─── Get Remodeling Details ───────────────────────────────────────────────────
  const getRemodelingDetails = () => {
    if (categoryData?.categoryId === "4" && categoryData.details) {
      const details = categoryData.details as any;
      return {
        panelLocation: draftData?.panelLocation || details.panelLocation || "",
        panelLocationOther: details.panelLocationOther || "",
        remodelingAreas:
          draftData?.remodelingAreas || details.remodlingArea || "",
        hasPlansDrawings:
          draftData?.hasPlansDrawings !== undefined
            ? draftData.hasPlansDrawings
            : details.hasPlans === "Yes",
        plansDrawings: draftData?.plansDrawings?.length
          ? draftData.plansDrawings
          : details.planPhotos || [],
        electricalNeeds:
          draftData?.electricalNeeds || details.electricalNeeds || "",
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
      panelLocation: "",
      panelLocationOther: "",
      remodelingAreas: "",
      hasPlansDrawings: false,
      plansDrawings: [],
      electricalNeeds: "",
      permitApplied: false,
      permitNumber: "",
      existingSpacePhotos: [],
      panelPhotos: [],
      additionalInformation: "",
    };
  };

  const handleSubmit = async () => {
    const details = getRemodelingDetails();

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
      panelLocation:
        details.panelLocation === "Other (please specify)"
          ? details.panelLocationOther
          : details.panelLocation,
      remodelingAreas: details.remodelingAreas,
      hasPlansDrawings: details.hasPlansDrawings,
      plansDrawings: details.plansDrawings,
      electricalNeeds: details.electricalNeeds,
      permitApplied: details.permitApplied,
      permitNumber: details.permitNumber,
      existingSpacePhotos: details.existingSpacePhotos,
      panelPhotos: details.panelPhotos,
      additionalInformation: details.additionalInformation,
      status: "pending" as const,
      completionPercentage: 100,
    };

    console.log("Submitting Remodeling payload:", payload);

    setIsSubmitting(true);
    try {
      let result;

      // ─── Check if we have an ID (existing draft) or not ─────────────────────
      if (serviceCallId) {
        // ✅ UPDATE - existing draft
        result = await updateDraft(
          serviceCallId,
          serviceType || "Remodeling",
          createFormData(payload),
        );
        console.log("Updated existing draft:", result);
      } else {
        // ✅ CREATE - new draft
        result = await createDraft(
          serviceType || "Remodeling",
          createFormData({
            serviceType: serviceType || "Remodeling",
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

  const details = getRemodelingDetails();

  return (
    <View>
      {/* ─── Project Basics ───────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Project Basics" />
      <ReviewRow
        label="Panel Location"
        value={
          details.panelLocation === "Other (please specify)"
            ? details.panelLocationOther || "Other"
            : details.panelLocation
        }
      />
      <ReviewRow label="Remodeling Area" value={details.remodelingAreas} />

      {/* ─── Plans & Electrical ───────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Plans & Electrical Needs" />
      <ReviewRow
        label="Has Plans/Drawings"
        value={details.hasPlansDrawings ? "Yes" : "No"}
      />
      {details.hasPlansDrawings && (
        <PhotosRow label="Plans/Drawings" photos={details.plansDrawings} />
      )}
      <ReviewRow label="Electrical Needs" value={details.electricalNeeds} />

      {/* ─── Permit ───────────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Permit" />
      <ReviewRow
        label="Permit Applied"
        value={details.permitApplied ? "Yes" : "No"}
      />
      {details.permitApplied && (
        <ReviewRow label="Permit Number" value={details.permitNumber} />
      )}

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Photos" />
      <PhotosRow
        label="Existing Space Photos"
        photos={details.existingSpacePhotos}
      />
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

export default RemodelingReviewForm;
