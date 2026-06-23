import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { EVChargerReview } from "@/src/components/quote/review/EVChargerRow";
import { useDraftSave } from "@/src/hook/useDraftSave";
import { RootState } from "@/src/redux/store";
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { toast } from "sonner-native";

interface EVChargerReviewFormProps {
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

const EVChargerReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
  serviceCallId,
  serviceType, // ← Receive serviceType
}: EVChargerReviewFormProps) => {
  const { createDraft, updateDraft } = useDraftSave();

  // ─── Get values from Redux ──────────────────────────────────────────────────
  const contactDetails = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );
  const serviceAddress = useSelector(
    (state: RootState) => state.serviceForm.serviceAddress,
  );
  const projectBasics = useSelector(
    (state: RootState) => state.serviceForm.projectBasics,
  );

  const getEVChargerDetails = () => {
    if (categoryData?.categoryId === "2" && categoryData.details) {
      const details = categoryData.details as any;
      const isEvChargerDraft = draftData?.chargerConnectionType !== undefined;

      return {
        chargerConnectionType: isEvChargerDraft
          ? draftData.chargerConnectionType || ""
          : details.chargerType || "",
        nemaConfiguration: isEvChargerDraft
          ? draftData.nemaConfiguration || ""
          : details.nemaConfig || "",
        chargerProvidedByUser: isEvChargerDraft
          ? draftData.chargerProvidedByUser || false
          : details.providingCharger === "Yes",
        chargerStatus: isEvChargerDraft
          ? draftData.chargerStatus || ""
          : details.chargerStatus || "",
        installationLocation: isEvChargerDraft
          ? draftData.installationLocation || ""
          : details.installationLocation || "",
        panelLocation: isEvChargerDraft
          ? draftData.panelLocation || ""
          : details.panelLocation || "",
        panelDistance: isEvChargerDraft
          ? draftData.panelDistance || ""
          : details.panelDistance || "",
        environment: isEvChargerDraft
          ? draftData.environment || ""
          : details.environment || "",
        budget: isEvChargerDraft
          ? draftData.budget || ""
          : details.budget || "",
        accessibility: isEvChargerDraft
          ? draftData.accessibility || ""
          : details.accessibility || "",
        schedule: isEvChargerDraft
          ? draftData.schedule || ""
          : details.schedule || "",
        additionalInformation: isEvChargerDraft
          ? draftData.additionalInformation || ""
          : details.additionalInfo || "",
        areaPhoto: isEvChargerDraft
          ? draftData.areaPhoto || ""
          : details.chargerAreaPhotos?.length > 0
            ? details.chargerAreaPhotos[0]
            : "",
        panelPhotos: isEvChargerDraft
          ? draftData.panelPhotos || []
          : details.panelPhotos || [],
      };
    }
    return {
      chargerConnectionType: "",
      nemaConfiguration: "",
      chargerProvidedByUser: false,
      chargerStatus: "",
      installationLocation: "",
      panelLocation: "",
      panelDistance: "",
      environment: "",
      budget: "",
      accessibility: "",
      schedule: "",
      additionalInformation: "",
      areaPhoto: "",
      panelPhotos: [],
    };
  };

  const handleSubmit = async () => {
    const details = getEVChargerDetails();

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

    // ─── Build payload ─────────────────────────────────────────────────────────
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
      chargerConnectionType: details.chargerConnectionType,
      nemaConfiguration: details.nemaConfiguration,
      chargerProvidedByUser: details.chargerProvidedByUser,
      chargerStatus: details.chargerStatus,
      installationLocation: details.installationLocation,
      panelLocation: details.panelLocation,
      panelDistance: details.panelDistance,
      environment: details.environment,
      budget: details.budget,
      accessibility: details.accessibility,
      schedule: details.schedule,
      additionalInformation: details.additionalInformation,
      areaPhoto: details.areaPhoto,
      panelPhotos: details.panelPhotos,
      status: "pending" as const,
      completionPercentage: 100,
    };

    console.log("Submitting EV Charger payload:", payload);

    setIsSubmitting(true);
    try {
      let result;

      // ─── Check if we have an ID (existing draft) or not ─────────────────────
      if (serviceCallId) {
        // ✅ UPDATE - existing draft
        result = await updateDraft(
          serviceCallId,
          serviceType || "EV Charger Installation", // ← Use dynamic serviceType
          createFormData(payload),
        );
        console.log("Updated existing draft:", result);
      } else {
        // ✅ CREATE - new draft
        result = await createDraft(
          serviceType || "EV Charger Installation", // ← Use dynamic serviceType
          createFormData({
            serviceType: serviceType || "EV Charger Installation",
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

  return (
    <View>
      <EVChargerReview details={categoryData?.details} />

      <GradientButton
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default EVChargerReviewForm;
