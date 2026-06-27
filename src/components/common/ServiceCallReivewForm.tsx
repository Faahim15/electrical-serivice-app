import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { ServiceCallReview } from "@/src/components/quote/review/ServiceCallReview";
import React from "react";
import { View } from "react-native";

interface ServiceCallReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
  serviceCallId?: string;
  serviceType?: string;
}

const ServiceCallReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: ServiceCallReviewFormProps) => {
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
        onPress={onSuccess}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default ServiceCallReviewForm;
