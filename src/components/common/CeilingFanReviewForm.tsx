import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { ReviewRow } from "@/src/components/quote/review/ReviewRow";
import { ReviewSectionTitle } from "@/src/components/quote/review/ReviewSectionTitle";
import { useCreateCeilingFanMutation } from "@/src/redux/api-slices/quote/ceiling-fan-api";
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

interface CeilingFanReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
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

const CeilingFanReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  setIsSubmitting,
  isSubmitting,
}: CeilingFanReviewFormProps) => {
  const [createCeilingFan] = useCreateCeilingFanMutation();

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

  // ─── Get Ceiling Fan Details ────────────────────────────────────────────────
  const getCeilingFanDetails = () => {
    if (categoryData?.categoryId === "18" && categoryData.details) {
      const details = categoryData.details as any;

      // St1 - Installation Type
      const installationType =
        draftData?.installationType || details.installationType || "";
      const photosOfCurrentCeilingFan = draftData?.photosOfCurrentCeilingFan
        ?.length
        ? draftData.photosOfCurrentCeilingFan
        : details.photosOfCurrentCeilingFan || [];
      const aboveBelowAreaOfCeilingFan = draftData?.aboveBelowAreaOfCeilingFan
        ?.length
        ? draftData.aboveBelowAreaOfCeilingFan
        : details.aboveBelowAreaOfCeilingFan || [];
      const isThereCurrentLightFixture =
        draftData?.isThereCurrentLightFixture !== undefined
          ? draftData.isThereCurrentLightFixture
          : details.isThereCurrentLightFixture === "Yes";
      const wasAreaPrewired =
        draftData?.wasAreaPrewired || details.wasAreaPrewired || "";

      // St2 - Fan Details
      const willProvideNewCeilingFan =
        draftData?.willProvideNewCeilingFan !== undefined
          ? draftData.willProvideNewCeilingFan
          : details.willProvideNewCeilingFan === "Yes";
      const photosOfNewCeilingFan = draftData?.photosOfNewCeilingFan?.length
        ? draftData.photosOfNewCeilingFan
        : details.photosOfNewCeilingFan || [];
      const describeFanWantInstalled =
        draftData?.describeFanWantInstalled ||
        details.describeFanWantInstalled ||
        "";
      const tallOfCeilingFanFromFloor =
        draftData?.tallOfCeilingFanFromFloor ||
        details.tallOfCeilingFanFromFloor ||
        "";

      // St3 - Switch Details
      const willConnectNewOrExistingSwitch =
        draftData?.willConnectNewOrExistingSwitch ||
        details.willConnectNewOrExistingSwitch ||
        "";
      const wantUpgradeSwitch =
        draftData?.wantUpgradeSwitch !== undefined
          ? draftData.wantUpgradeSwitch
          : details.wantUpgradeSwitch === "Yes";
      const kindOfSwitchWant =
        draftData?.kindOfSwitchWant || details.kindOfSwitchWant || "";

      // St4 - Additional Notes
      const additionalInformation =
        draftData?.additionalInformation || details.additionalInformation || "";

      return {
        installationType,
        photosOfCurrentCeilingFan,
        aboveBelowAreaOfCeilingFan,
        isThereCurrentLightFixture,
        wasAreaPrewired,
        willProvideNewCeilingFan,
        photosOfNewCeilingFan,
        describeFanWantInstalled,
        tallOfCeilingFanFromFloor,
        willConnectNewOrExistingSwitch,
        wantUpgradeSwitch,
        kindOfSwitchWant,
        additionalInformation,
      };
    }
    return {
      installationType: "",
      photosOfCurrentCeilingFan: [],
      aboveBelowAreaOfCeilingFan: [],
      isThereCurrentLightFixture: false,
      wasAreaPrewired: "",
      willProvideNewCeilingFan: false,
      photosOfNewCeilingFan: [],
      describeFanWantInstalled: "",
      tallOfCeilingFanFromFloor: "",
      willConnectNewOrExistingSwitch: "",
      wantUpgradeSwitch: false,
      kindOfSwitchWant: "",
      additionalInformation: "",
    };
  };

  const handleSubmit = async () => {
    const details = getCeilingFanDetails();

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

    // ─── Validate Ceiling Fan specific fields ─────────────────────────────────
    if (!details.installationType) {
      toast.error("Please select installation type");
      return;
    }

    // ─── Build payload matching CeilingFanPayload ────────────────────────────
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

      // St1 - Installation Type
      installationType: details.installationType,
      photosOfCurrentCeilingFan: details.photosOfCurrentCeilingFan,
      aboveBelowAreaOfCeilingFan: details.aboveBelowAreaOfCeilingFan,
      isThereCurrentLightFixture: details.isThereCurrentLightFixture,
      wasAreaPrewired: details.wasAreaPrewired,

      // St2 - Fan Details
      willProvideNewCeilingFan: details.willProvideNewCeilingFan,
      photosOfNewCeilingFan: details.photosOfNewCeilingFan,
      describeFanWantInstalled: details.describeFanWantInstalled,
      tallOfCeilingFanFromFloor: details.tallOfCeilingFanFromFloor,

      // St3 - Switch Details
      willConnectNewOrExistingSwitch: details.willConnectNewOrExistingSwitch,
      wantUpgradeSwitch: details.wantUpgradeSwitch,
      kindOfSwitchWant: details.kindOfSwitchWant,

      // St4 - Additional Notes
      additionalInformation: details.additionalInformation,

      status: "submitted" as const,
      completionPercentage: 100,
    };

    console.log("Submitting Ceiling Fan payload:", payload);

    setIsSubmitting(true);
    try {
      const result = await createCeilingFan(
        createFormData(payload) as any,
      ).unwrap();

      console.log("Submit result:", result);

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

  const details = getCeilingFanDetails();

  // ─── Helper to format display values ────────────────────────────────────────
  const formatYesNo = (value: boolean) => (value ? "Yes" : "No");
  const formatArray = (arr: string[]) => arr?.join(", ") || "None selected";

  return (
    <View>
      {/* ─── Installation Type ────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Installation Details" />
      <ReviewRow
        label="Installation Type"
        value={details.installationType || "Not specified"}
      />

      {/* ─── Above/Below Area ────────────────────────────────────────────────── */}
      {details.installationType === "New install" && (
        <>
          <ReviewRow
            label="Above/Below Area"
            value={formatArray(details.aboveBelowAreaOfCeilingFan)}
          />
          <ReviewRow
            label="Current Light Fixture"
            value={formatYesNo(details.isThereCurrentLightFixture)}
          />
          <ReviewRow
            label="Area Prewired"
            value={details.wasAreaPrewired || "Not specified"}
          />
        </>
      )}

      {/* ─── Fan Details ─────────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Fan Details" />
      <ReviewRow
        label="Providing New Fan"
        value={formatYesNo(details.willProvideNewCeilingFan)}
      />

      {!details.willProvideNewCeilingFan && (
        <ReviewRow
          label="Fan Description"
          value={details.describeFanWantInstalled || "Not specified"}
        />
      )}

      <ReviewRow
        label="Ceiling Height"
        value={details.tallOfCeilingFanFromFloor || "Not specified"}
      />

      {/* ─── Switch Details ──────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Switch Details" />
      <ReviewRow
        label="Switch Connection"
        value={details.willConnectNewOrExistingSwitch || "Not specified"}
      />

      {details.willConnectNewOrExistingSwitch === "Existing" && (
        <ReviewRow
          label="Upgrade Switch"
          value={formatYesNo(details.wantUpgradeSwitch)}
        />
      )}

      {(details.willConnectNewOrExistingSwitch === "New" ||
        (details.willConnectNewOrExistingSwitch === "Existing" &&
          details.wantUpgradeSwitch)) && (
        <ReviewRow
          label="Switch Type"
          value={details.kindOfSwitchWant || "Not specified"}
        />
      )}

      {details.willConnectNewOrExistingSwitch ===
        "My fan comes with a remote" && (
        <ReviewRow label="Remote" value="Comes with remote" />
      )}

      {/* ─── Additional Notes ────────────────────────────────────────────────── */}
      {details.additionalInformation && (
        <>
          <ReviewSectionTitle title="Additional Notes" />
          <ReviewRow label="Notes" value={details.additionalInformation} />
        </>
      )}

      {/* ─── Photos ───────────────────────────────────────────────────────────── */}
      {(details.photosOfCurrentCeilingFan.length > 0 ||
        details.photosOfNewCeilingFan.length > 0) && (
        <ReviewSectionTitle title="Photos" />
      )}

      {details.photosOfCurrentCeilingFan.length > 0 && (
        <PhotosRow
          label="Current Fan Photos"
          photos={details.photosOfCurrentCeilingFan}
        />
      )}

      {details.photosOfNewCeilingFan.length > 0 && (
        <PhotosRow
          label="New Fan Photos"
          photos={details.photosOfNewCeilingFan}
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

export default CeilingFanReviewForm;
