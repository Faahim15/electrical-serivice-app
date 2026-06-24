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

interface SwitchesReviewFormProps {
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

// ─── Tags Row Component ─────────────────────────────────────────────────────
const TagsRow = ({ label, tags }: { label: string; tags: string[] }) => (
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
    {tags?.length > 0 ? (
      <View className="flex-row flex-wrap gap-2">
        {tags.map((tag, index) => (
          <View key={index} className="bg-[#EFF6FF] px-3 py-1.5 rounded-full">
            <Text className="text-[#4AA9F5] text-[13px] font-Inter_Medium">
              {tag}
            </Text>
          </View>
        ))}
      </View>
    ) : (
      <Text className="text-[#1E293B] text-[14px] font-Inter_SemiBold">
        None selected
      </Text>
    )}
  </View>
);

const SwitchesReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
  serviceCallId,
  serviceType,
}: SwitchesReviewFormProps) => {
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

  // ─── Get Switches Details ────────────────────────────────────────────────────
  const getSwitchesDetails = () => {
    if (categoryData?.categoryId === "16" && categoryData.details) {
      const details = categoryData.details as any;

      const howManySwitchesNeeded =
        draftData?.howManySwitchesNeeded || details.howManySwitchesNeeded || "";
      const isNewInstallationOrReplacement =
        draftData?.isNewInstallationOrReplacement ||
        details.isNewInstallationOrReplacement ||
        "";
      const photosOfWhereSwitchesInstallationNeeded = draftData
        ?.photosOfWhereSwitchesInstallationNeeded?.length
        ? draftData.photosOfWhereSwitchesInstallationNeeded
        : details.photosOfWhereSwitchesInstallationNeeded || [];
      const typeOfSwitchesNeeded = draftData?.typeOfSwitchesNeeded?.length
        ? draftData.typeOfSwitchesNeeded
        : details.typeOfSwitchesNeeded || [];
      const additionalInformation =
        draftData?.additionalInformation || details.additionalInformation || "";

      return {
        howManySwitchesNeeded,
        isNewInstallationOrReplacement,
        photosOfWhereSwitchesInstallationNeeded,
        typeOfSwitchesNeeded,
        additionalInformation,
      };
    }
    return {
      howManySwitchesNeeded: "",
      isNewInstallationOrReplacement: "",
      photosOfWhereSwitchesInstallationNeeded: [],
      typeOfSwitchesNeeded: [],
      additionalInformation: "",
    };
  };

  const handleSubmit = async () => {
    const details = getSwitchesDetails();

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

    // ─── Validate Switches specific fields ─────────────────────────────────────
    if (!details.howManySwitchesNeeded) {
      toast.error("Please enter number of switches needed");
      return;
    }
    if (!details.isNewInstallationOrReplacement) {
      toast.error("Please select installation type");
      return;
    }
    if (details.typeOfSwitchesNeeded.length === 0) {
      toast.error("Please select at least one switch type");
      return;
    }

    // ─── Build payload matching SwitchesPayload ──────────────────────────────
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

      howManySwitchesNeeded: details.howManySwitchesNeeded,
      isNewInstallationOrReplacement: details.isNewInstallationOrReplacement,
      typeOfSwitchesNeeded: details.typeOfSwitchesNeeded,
      additionalInformation: details.additionalInformation,
      photosOfWhereSwitchesInstallationNeeded:
        details.photosOfWhereSwitchesInstallationNeeded,

      status: "pending" as const,
      completionPercentage: 100,
    };

    console.log("Submitting Switches payload:", payload);

    setIsSubmitting(true);
    try {
      let result;

      // ─── Check if we have an ID (existing draft) or not ─────────────────────
      if (serviceCallId) {
        // ✅ UPDATE - existing draft
        result = await updateDraft(
          serviceCallId,
          serviceType || "Switches Installation",
          createFormData(payload),
        );
        console.log("Updated existing draft:", result);
      } else {
        // ✅ CREATE - new draft
        result = await createDraft(
          serviceType || "Switches Installation",
          createFormData({
            serviceType: serviceType || "Switches Installation",
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
      console.error("Submit error:", error.data);
      toast.error(
        error?.data?.message || "Failed to submit request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const details = getSwitchesDetails();

  return (
    <View>
      {/* ─── Switch Details ───────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Switch Details" />
      <ReviewRow
        label="Number of Switches"
        value={details.howManySwitchesNeeded || "Not specified"}
      />
      <ReviewRow
        label="Installation Type"
        value={details.isNewInstallationOrReplacement || "Not specified"}
      />

      {/* ─── Switch Types ────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Switch Types" />
      <TagsRow
        label="Selected Switch Types"
        tags={details.typeOfSwitchesNeeded}
      />

      {/* ─── Additional Notes ────────────────────────────────────────────────── */}
      {details.additionalInformation && (
        <>
          <ReviewSectionTitle title="Additional Notes" />
          <ReviewRow label="Notes" value={details.additionalInformation} />
        </>
      )}

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      {details.photosOfWhereSwitchesInstallationNeeded.length > 0 && (
        <ReviewSectionTitle title="Photos" />
      )}
      {details.photosOfWhereSwitchesInstallationNeeded.length > 0 && (
        <PhotosRow
          label="Installation Location Photos"
          photos={details.photosOfWhereSwitchesInstallationNeeded}
        />
      )}

      {/* ─── Submit ───────────────────────────────────────────────────────────── */}
      <GradientButton
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default SwitchesReviewForm;
