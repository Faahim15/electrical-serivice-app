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

interface DedicatedCircuitReviewFormProps {
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

const DedicatedCircuitReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
  serviceCallId,
  serviceType,
}: DedicatedCircuitReviewFormProps) => {
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

  // ─── Log to debug ────────────────────────────────────────────────────────────
  console.log("categoryData:", categoryData);
  console.log("categoryData.details:", categoryData?.details);

  // ─── Get Dedicated Circuit Details from categoryData ──────────────────────
  const getDedicatedCircuitDetails = () => {
    // If categoryData exists and has details, use them
    if (categoryData?.categoryId === "13" && categoryData.details) {
      const details = categoryData.details as any;
      console.log("Details from categoryData:", details);

      return {
        whyNeedDedicatedCircuit: details.whyNeedDedicatedCircuit || "",
        electricalPanelLocation: details.electricalPanelLocation || "",
        whereWillDedicatedCircuitInstalled:
          details.whereWillDedicatedCircuitInstalled || "",
        aboveBelowArea: details.aboveBelowArea || "",
        distanceElectricalPanelToInstallationArea:
          details.distanceElectricalPanelToInstallationArea || "",
        ampsNeeded: details.ampsNeeded || "",
        voltsNeeded: details.voltsNeeded || "",
        NEMAConfiguration: details.NEMAConfiguration || "",
        photosOfElectricalMeter: details.photosOfElectricalMeter || [],
        photosOfInstallationLocation:
          details.photosOfInstallationLocation || [],
        additionalInformation: details.additionalNotes || "",
      };
    }

    // If draftData exists, try to get values from there (fallback)
    if (draftData) {
      console.log("Using draftData as fallback:", draftData);
      return {
        whyNeedDedicatedCircuit: draftData.whyNeedDedicatedCircuit || "",
        electricalPanelLocation: draftData.electricalPanelLocation || "",
        whereWillDedicatedCircuitInstalled:
          draftData.whereWillDedicatedCircuitInstalled || "",
        aboveBelowArea: draftData.aboveBelowArea || "",
        distanceElectricalPanelToInstallationArea:
          draftData.distanceElectricalPanelToInstallationArea || "",
        ampsNeeded: draftData.ampsNeeded || "",
        voltsNeeded: draftData.voltsNeeded || "",
        NEMAConfiguration: draftData.NEMAConfiguration || "",
        photosOfElectricalMeter: draftData.photosOfElectricalMeter || [],
        photosOfInstallationLocation:
          draftData.photosOfInstallationLocation || [],
        additionalInformation: draftData.additionalInformation || "",
      };
    }

    return {
      whyNeedDedicatedCircuit: "",
      electricalPanelLocation: "",
      whereWillDedicatedCircuitInstalled: "",
      aboveBelowArea: "",
      distanceElectricalPanelToInstallationArea: "",
      ampsNeeded: "",
      voltsNeeded: "",
      NEMAConfiguration: "",
      photosOfElectricalMeter: [],
      photosOfInstallationLocation: [],
      additionalInformation: "",
    };
  };

  const handleSubmit = async () => {
    const details = getDedicatedCircuitDetails();

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
      whyNeedDedicatedCircuit: details.whyNeedDedicatedCircuit,
      electricalPanelLocation: details.electricalPanelLocation,
      whereWillDedicatedCircuitInstalled:
        details.whereWillDedicatedCircuitInstalled,
      aboveBelowArea: details.aboveBelowArea,
      distanceElectricalPanelToInstallationArea:
        details.distanceElectricalPanelToInstallationArea,
      ampsNeeded: details.ampsNeeded,
      voltsNeeded: details.voltsNeeded,
      NEMAConfiguration: details.NEMAConfiguration,
      photosOfElectricalMeter: details.photosOfElectricalMeter,
      photosOfInstallationLocation: details.photosOfInstallationLocation,
      additionalInformation: details.additionalInformation,
      status: "pending" as const,
      completionPercentage: 100,
    };

    console.log("Submitting Dedicated Circuit payload:", payload);

    setIsSubmitting(true);
    try {
      let result;

      // ─── Check if we have an ID (existing draft) or not ─────────────────────
      if (serviceCallId) {
        // ✅ UPDATE - existing draft
        result = await updateDraft(
          serviceCallId,
          serviceType || "Dedicated Circuit Installation",
          createFormData(payload),
        );
        console.log("Updated existing draft:", result);
      } else {
        // ✅ CREATE - new draft
        result = await createDraft(
          serviceType || "Dedicated Circuit Installation",
          createFormData({
            serviceType: serviceType || "Dedicated Circuit Installation",
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

  const details = getDedicatedCircuitDetails();

  return (
    <View>
      {/* ─── Circuit Details ──────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Circuit Details" />
      <ReviewRow
        label="Intended Use"
        value={details.whyNeedDedicatedCircuit || "Not specified"}
      />
      <ReviewRow
        label="Panel Location"
        value={details.electricalPanelLocation || "Not specified"}
      />
      <ReviewRow
        label="Install Location"
        value={details.whereWillDedicatedCircuitInstalled || "Not specified"}
      />
      <ReviewRow
        label="Above/Below Area"
        value={details.aboveBelowArea || "Not specified"}
      />
      <ReviewRow
        label="Panel Distance"
        value={
          details.distanceElectricalPanelToInstallationArea || "Not specified"
        }
      />

      {/* ─── Electrical Specs ─────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Electrical Specifications" />
      <ReviewRow
        label="Amps Needed"
        value={
          details.ampsNeeded ? `${details.ampsNeeded} amps` : "Not specified"
        }
      />
      <ReviewRow
        label="Volts Needed"
        value={details.voltsNeeded || "Not specified"}
      />
      <ReviewRow
        label="NEMA Configuration"
        value={details.NEMAConfiguration || "Not specified"}
      />

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Photos" />
      <PhotosRow
        label="Electrical Meter Photos"
        photos={details.photosOfElectricalMeter}
      />
      <PhotosRow
        label="Installation Path Photos"
        photos={details.photosOfInstallationLocation}
      />

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

export default DedicatedCircuitReviewForm;
