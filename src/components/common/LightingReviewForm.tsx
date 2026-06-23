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

interface LightingReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
  serviceCallId?: string;
  serviceType?: string;
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

const LightingReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
  serviceCallId,
  serviceType,
}: LightingReviewFormProps) => {
  const { createDraft, updateDraft } = useDraftSave();
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
    if (categoryData?.categoryId === "17" && categoryData.details) {
      const d = categoryData.details as any;
      return {
        lightingType: d.lightingType || "",
        fixtureWeight: d.fixtureWeight || "",
        fixtureKind: d.fixtureKind || "",
        complexAssembly: d.complexAssembly || "",
        interiorInstallType: d.interiorInstallType || "",
        ceilingHeight: d.ceilingHeight || "",
        providingFixture: d.providingFixture || "",
        fixtureDetails: d.fixtureDetails || "",
        switchNewExisting: d.switchNewExisting || "",
        upgradeSwitch: d.upgradeSwitch || "",
        switchKind: d.switchKind || "",
        multiSwitch: d.multiSwitch || "",
        photosOfWhereWantToInstall: d.photosOfWhereWantToInstall || [],
        photosOfCurrentLightFixture: d.photosOfCurrentLightFixture || [],
        photosOfNewLightFixture: d.photosOfNewLightFixture || [],
        additionalInformation: d.additionalNotes || "",
      };
    }
    return {
      lightingType: "",
      fixtureWeight: "",
      fixtureKind: "",
      complexAssembly: "",
      interiorInstallType: "",
      ceilingHeight: "",
      providingFixture: "",
      fixtureDetails: "",
      switchNewExisting: "",
      upgradeSwitch: "",
      switchKind: "",
      multiSwitch: "",
      photosOfWhereWantToInstall: [],
      photosOfCurrentLightFixture: [],
      photosOfNewLightFixture: [],
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
      lightingType: details.lightingType,
      photosOfWhereWantToInstall: details.photosOfWhereWantToInstall,
      photosOfCurrentLightFixture: details.photosOfCurrentLightFixture,
      photosOfNewLightFixture: details.photosOfNewLightFixture,
      additionalInformation: details.additionalInformation,
      status: "pending" as const,
      completionPercentage: 100,
    };

    setIsSubmitting(true);
    try {
      let result;

      // ─── Check if we have an ID (existing draft) or not ─────────────────────
      if (serviceCallId) {
        // ✅ UPDATE - existing draft
        result = await updateDraft(
          serviceCallId,
          serviceType || "Lighting",
          createFormData(payload),
        );
        console.log("Updated existing draft:", result);
      } else {
        // ✅ CREATE - new draft
        result = await createDraft(
          serviceType || "Lighting",
          createFormData({
            serviceType: serviceType || "Lighting",
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
      <ReviewSectionTitle title="Lighting Details" />
      <ReviewRow
        label="Lighting Type"
        value={details.lightingType || "Not specified"}
      />
      <ReviewRow
        label="Fixture Weight"
        value={details.fixtureWeight || "Not specified"}
      />
      <ReviewRow
        label="Fixture Kind"
        value={details.fixtureKind || "Not specified"}
      />
      <ReviewRow
        label="Complex Assembly"
        value={details.complexAssembly || "Not specified"}
      />
      <ReviewRow
        label="Install Type"
        value={details.interiorInstallType || "Not specified"}
      />
      <ReviewRow
        label="Ceiling Height"
        value={details.ceilingHeight || "Not specified"}
      />
      <ReviewRow
        label="Providing Fixture"
        value={details.providingFixture || "Not specified"}
      />
      <ReviewRow
        label="Fixture Details"
        value={details.fixtureDetails || "Not specified"}
      />
      <ReviewRow
        label="Switch Type"
        value={details.switchNewExisting || "Not specified"}
      />
      <ReviewRow
        label="Upgrade Switch"
        value={details.upgradeSwitch || "Not specified"}
      />
      <ReviewRow
        label="Switch Kind"
        value={details.switchKind || "Not specified"}
      />
      <ReviewRow
        label="Multi Switch"
        value={details.multiSwitch || "Not specified"}
      />

      <ReviewSectionTitle title="Photos" />
      <PhotosRow
        label="Installation Area Photos"
        photos={details.photosOfWhereWantToInstall}
      />
      <PhotosRow
        label="Current Fixture Photos"
        photos={details.photosOfCurrentLightFixture}
      />
      <PhotosRow
        label="New Fixture Photos"
        photos={details.photosOfNewLightFixture}
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

export default LightingReviewForm;
