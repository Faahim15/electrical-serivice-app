import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { ServiceCallReview } from "@/src/components/quote/review/ServiceCallReview";
import { useDraftSave } from "@/src/hook/useDraftSave";
import { RootState } from "@/src/redux/store";
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { toast } from "sonner-native";

interface ServiceCallReviewFormProps {
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

const ServiceCallReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
  serviceCallId,
  serviceType,
}: ServiceCallReviewFormProps) => {
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

  const getServiceCallDetails = () => {
    if (categoryData?.categoryId === "1" && categoryData.details) {
      const details = categoryData.details as any;
      return {
        issueDescription:
          draftData?.issueDescription || details.projectDetails || "",
        preferredTime: draftData?.preferredTime || details.preferredTime || "",
        schedulingPreference: draftData?.schedulingPreference?.length
          ? draftData.schedulingPreference
          : details.schedulingDays || [],
        panelPhotos: draftData?.panelPhotos?.length
          ? draftData.panelPhotos
          : details.panelPhotos || [],
        workAreaPhotos: draftData?.workAreaPhotos?.length
          ? draftData.workAreaPhotos
          : details.workAreaPhotos || [],
        extraReferencePhotos: draftData?.extraReferencePhotos?.length
          ? draftData.extraReferencePhotos
          : details.referencePhotos || [],
        notes: draftData?.notes || details.additionalNotes || "",
        quickTags: draftData?.quickTags?.length
          ? draftData.quickTags
          : details.quickTags || [],
      };
    }
    return {
      issueDescription: "",
      preferredTime: "",
      schedulingPreference: [],
      panelPhotos: [],
      workAreaPhotos: [],
      extraReferencePhotos: [],
      notes: "",
      quickTags: [],
    };
  };

  const handleSubmit = async () => {
    const details = getServiceCallDetails();

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
      serviceType: draftData?.serviceType || "Service Call",
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
      issueDescription: details.issueDescription,
      preferredTime: details.preferredTime,
      schedulingPreference: details.schedulingPreference,
      panelPhotos: details.panelPhotos,
      workAreaPhotos: details.workAreaPhotos,
      extraReferencePhotos: details.extraReferencePhotos,
      notes: details.notes,
      quickTags: details.quickTags,
      status: "pending" as const,
      completionPercentage: 100,
    };

    console.log("Submitting Service Call payload:", payload);

    setIsSubmitting(true);
    try {
      let result;

      // ─── Check if we have an ID (existing draft) or not ─────────────────────
      if (serviceCallId) {
        // ✅ UPDATE - existing draft
        result = await updateDraft(
          serviceCallId,
          serviceType || "Service Call",
          createFormData(payload),
        );
        console.log("Updated existing draft:", result);
      } else {
        // ✅ CREATE - new draft - Remove duplicate serviceType
        result = await createDraft(
          serviceType || "Service Call",
          createFormData(payload), // ← Fixed: No duplicate serviceType
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
      <ServiceCallReview
        details={{
          projectDetails: getServiceCallDetails().issueDescription,
          preferredTime: getServiceCallDetails().preferredTime,
          schedulingDays: getServiceCallDetails().schedulingPreference,
          additionalNotes: getServiceCallDetails().notes,
          quickTags: getServiceCallDetails().quickTags,
          panelPhotos: getServiceCallDetails().panelPhotos,
          workAreaPhotos: getServiceCallDetails().workAreaPhotos,
          referencePhotos: getServiceCallDetails().extraReferencePhotos,
        }}
      />

      <GradientButton
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default ServiceCallReviewForm;
