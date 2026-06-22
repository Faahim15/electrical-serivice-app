import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { ReviewRow } from "@/src/components/quote/review/ReviewRow";
import { ReviewSectionTitle } from "@/src/components/quote/review/ReviewSectionTitle";
import { useCreateOutletMutation } from "@/src/redux/api-slices/quote/outlet-api";
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

interface OutletsReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
}

const createFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  return formData;
};

const PhotosRow = ({ label, photos }: { label: string; photos: string[] }) => (
  <View className="bg-white rounded-2xl px-4 py-4 mb-3">
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

const OutletsReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
}: OutletsReviewFormProps) => {
  const [createOutlet] = useCreateOutletMutation();
  const contactDetails = useSelector(
    (s: RootState) => s.serviceForm.contactDetails,
  );
  const serviceAddress = useSelector(
    (s: RootState) => s.serviceForm.serviceAddress,
  );
  const projectBasics = useSelector(
    (s: RootState) => s.serviceForm.projectBasics,
  );

  const getDetails = () => {
    if (categoryData?.categoryId === "15" && categoryData.details) {
      const d = categoryData.details as any;
      return {
        intendedUse: d.intendedUse || "",
        numberOfOutlets: d.numberOfOutlets || "",
        installationType: d.installationType || "",
        outletTypes: d.outletTypes || [],
        ampsNeeded: d.ampsNeeded || "",
        voltsNeeded: d.voltsNeeded || "",
        NEMAConfiguration: d.NEMAConfiguration || "",
        photosOfWhereOutletsInstall: d.photosOfWhereOutletsInstall || [],
        additionalInformation: d.additionalNotes || "",
      };
    }
    return {
      intendedUse: "",
      numberOfOutlets: "",
      installationType: "",
      outletTypes: [],
      ampsNeeded: "",
      voltsNeeded: "",
      NEMAConfiguration: "",
      photosOfWhereOutletsInstall: [],
      additionalInformation: "",
    };
  };

  const handleSubmit = async () => {
    const details = getDetails();
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
      intendedUseOfOutlets: details.intendedUse,
      howManyOutletsNeeds: details.numberOfOutlets,
      newInstallationOrReplacement: details.installationType,
      typeOfOutletsNeed: details.outletTypes.join(", "),
      howManyAmps: details.ampsNeeded,
      ampsOrVoltsNeeded: details.voltsNeeded,
      NEMAConfiguration: details.NEMAConfiguration,
      photosOfWhereOutletsInstall: details.photosOfWhereOutletsInstall,
      additionalInformation: details.additionalInformation,
      status: "submitted" as const,
      completionPercentage: 100,
    };

    setIsSubmitting(true);
    try {
      const result = await createOutlet(
        createFormData(payload) as any,
      ).unwrap();
      if (result.success) onSuccess();
      else toast.error(result.message || "Failed to submit request");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to submit request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const details = getDetails();

  return (
    <View>
      <ReviewSectionTitle title="Outlet Details" />
      <ReviewRow
        label="Intended Use"
        value={details.intendedUse || "Not specified"}
      />
      <ReviewRow
        label="Number of Outlets"
        value={details.numberOfOutlets || "Not specified"}
      />
      <ReviewRow
        label="Installation Type"
        value={details.installationType || "Not specified"}
      />
      <ReviewRow
        label="Outlet Types"
        value={details.outletTypes.join(", ") || "Not specified"}
      />

      <ReviewSectionTitle title="Electrical Specifications" />
      <ReviewRow
        label="Amps"
        value={
          details.ampsNeeded ? `${details.ampsNeeded} amps` : "Not specified"
        }
      />
      <ReviewRow label="Volts" value={details.voltsNeeded || "Not specified"} />
      <ReviewRow
        label="NEMA Configuration"
        value={details.NEMAConfiguration || "Not specified"}
      />

      <ReviewSectionTitle title="Photos" />
      <PhotosRow
        label="Installation Area Photos"
        photos={details.photosOfWhereOutletsInstall}
      />

      <ReviewSectionTitle title="Additional Information" />
      <ReviewRow
        label="Additional Notes"
        value={details.additionalInformation || "None provided"}
      />

      <GradientButton
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default OutletsReviewForm;
