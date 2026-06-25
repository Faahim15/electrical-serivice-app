import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { EVChargerReview } from "@/src/components/quote/review/EVChargerRow";
import React from "react";
import { View } from "react-native";

interface EVChargerReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
  serviceCallId?: string;
  serviceType?: string;
}

const EVChargerReviewForm = ({
  categoryData,
  onSuccess,
  isSubmitting,
}: EVChargerReviewFormProps) => {
  return (
    <View>
      <EVChargerReview details={categoryData?.details} />
      <GradientButton
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={onSuccess}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default EVChargerReviewForm;
