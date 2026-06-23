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

interface StarlinkReviewFormProps {
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

const StarlinkReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
  serviceCallId,
  serviceType,
}: StarlinkReviewFormProps) => {
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

  // ─── Get Starlink Details ────────────────────────────────────────────────────
  const getStarlinkDetails = () => {
    if (categoryData?.categoryId === "12" && categoryData.details) {
      const details = categoryData.details as any;
      return {
        haveStarlinkEquipment: details.haveStarlinkEquipment === "Yes",
        whenHaveEquipment: details.whenHaveEquipment || "",
        dishLocation: details.dishLocation || "",
        haveMountingEquipment: details.haveMountingEquipment === "Yes",
        roomOfRouterIn: details.roomOfRouterIn || "",
        roomCondition: details.roomCondition || "",
        areaOfInstallationPhotos: details.areaOfInstallationPhotos || [],
        photosOfRoomForRouter: details.photosOfRoomForRouter || [],
        additionalNotes: details.additionalNotes || "",
      };
    }
    return {
      haveStarlinkEquipment: false,
      whenHaveEquipment: "",
      dishLocation: "",
      haveMountingEquipment: false,
      roomOfRouterIn: "",
      roomCondition: "",
      areaOfInstallationPhotos: [],
      photosOfRoomForRouter: [],
      additionalNotes: "",
    };
  };

  const handleSubmit = async () => {
    const details = getStarlinkDetails();

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
      haveStarlinkEquipment: details.haveStarlinkEquipment,
      whenHaveEquipment: details.whenHaveEquipment,
      dishLocation: details.dishLocation,
      haveMountingEquipment: details.haveMountingEquipment,
      roomOfRouterIn: details.roomOfRouterIn,
      roomCondition: details.roomCondition,
      areaOfInstallationPhotos: details.areaOfInstallationPhotos,
      photosOfRoomForRouter: details.photosOfRoomForRouter,
      additionalNotes: details.additionalNotes,
      status: "pending" as const,
      completionPercentage: 100,
    };

    console.log("Submitting Starlink payload:", payload);

    setIsSubmitting(true);
    try {
      let result;

      // ─── Check if we have an ID (existing draft) or not ─────────────────────
      if (serviceCallId) {
        // ✅ UPDATE - existing draft
        result = await updateDraft(
          serviceCallId,
          serviceType || "Starlink Installation",
          createFormData(payload),
        );
        console.log("Updated existing draft:", result);
      } else {
        // ✅ CREATE - new draft
        result = await createDraft(
          serviceType || "Starlink Installation",
          createFormData({
            serviceType: serviceType || "Starlink Installation",
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

  const details = getStarlinkDetails();

  return (
    <View>
      {/* ─── Equipment Details ────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Equipment Details" />
      <ReviewRow
        label="Have Starlink Equipment"
        value={details.haveStarlinkEquipment ? "Yes" : "No"}
      />
      {!details.haveStarlinkEquipment && (
        <ReviewRow
          label="When Expect Equipment"
          value={details.whenHaveEquipment || "Not specified"}
        />
      )}
      <ReviewRow
        label="Have Mounting Equipment"
        value={details.haveMountingEquipment ? "Yes" : "No"}
      />
      <ReviewRow
        label="Dish Location"
        value={details.dishLocation || "Not specified"}
      />

      {/* ─── Router Details ───────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Router Details" />
      <ReviewRow
        label="Router Room"
        value={details.roomOfRouterIn || "Not specified"}
      />
      <ReviewRow
        label="Room Condition"
        value={details.roomCondition || "Not specified"}
      />

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Photos" />
      <PhotosRow
        label="Installation Area Photos"
        photos={details.areaOfInstallationPhotos}
      />
      <PhotosRow
        label="Router Room Photos"
        photos={details.photosOfRoomForRouter}
      />

      {/* ─── Additional Information ───────────────────────────────────────────── */}
      <ReviewSectionTitle title="Additional Information" />
      <ReviewRow
        label="Additional Notes"
        value={details.additionalNotes || "None provided"}
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

export default StarlinkReviewForm;
