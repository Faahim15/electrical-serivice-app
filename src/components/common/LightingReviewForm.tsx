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

const normalizeInstallType = (value: string) => {
  if (!value) return "";
  const lowerValue = value.toLowerCase();
  if (
    lowerValue.includes("new install") ||
    lowerValue.includes("new installation")
  )
    return "New Installation";
  if (lowerValue.includes("replacement")) return "Replacement";
  return value;
};

const normalizeSwitchConnection = (value: string) => {
  if (!value) return "";
  const lowerValue = value.toLowerCase();
  if (lowerValue === "new" || lowerValue === "n") return "New";
  if (lowerValue === "existing" || lowerValue === "e") return "Existing";
  return value;
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
        // Lighting Type
        lightingType: d.lightingType || "",

        // Interior
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

        // Flood Lights
        floodInstallType: d.floodInstallType || "",
        floodInstallHeight: d.floodInstallHeight || "",
        floodProviding: d.floodProviding || "",
        floodDetails: d.floodDetails || "",
        floodPowerControl: d.floodPowerControl || "",
        floodSwitchNewExisting: d.floodSwitchNewExisting || "",
        floodUpgradeSwitch: d.floodUpgradeSwitch || "",
        floodSwitchKind: d.floodSwitchKind || "",
        floodSwitchOtherText: d.floodSwitchOtherText || "",
        floodMultiSwitch: d.floodMultiSwitch || "",
        photosOfInstallationAreaFloodLight:
          d.photosOfInstallationAreaFloodLight || [],
        photosOfCurrentFloodLight: d.photosOfCurrentFloodLight || [],
        photosOfNewFloodLight: d.photosOfNewFloodLight || [],

        // Wall / Coach
        wallInstallType: d.wallInstallType || "",
        wallSurface: d.wallSurface || "",
        wallProviding: d.wallProviding || "",
        wallNewLightDetails: d.wallNewLightDetails || "",
        wallSwitchNewExisting: d.wallSwitchNewExisting || "",
        wallUpgradeSwitch: d.wallUpgradeSwitch || "",
        wallSwitchKind: d.wallSwitchKind || "",
        wallMultiSwitch: d.wallMultiSwitch || "",
        wallPhotosNew: d.wallPhotosNew || [],
        wallPhotosCurrent: d.wallPhotosCurrent || [],
        wallPhotosFixtureNew: d.wallPhotosFixtureNew || [],

        // Driveway
        drivewayInstallType: d.drivewayInstallType || "",
        drivewayProviding: d.drivewayProviding || "",
        drivewayNewLightDetails: d.drivewayNewLightDetails || "",
        drivewayDistance: d.drivewayDistance || "",
        drivewayPowerControl: d.drivewayPowerControl || "",
        drivewaySwitchNewExisting: d.drivewaySwitchNewExisting || "",
        drivewayUpgradeSwitch: d.drivewayUpgradeSwitch || "",
        drivewaySwitchKind: d.drivewaySwitchKind || "",
        drivewaySwitchOtherText: d.drivewaySwitchOtherText || "",
        drivewayMultiSwitch: d.drivewayMultiSwitch || "",
        drivewayPhotosNew: d.drivewayPhotosNew || [],
        drivewayPhotosCurrent: d.drivewayPhotosCurrent || [],
        drivewayPhotosFixtureNew: d.drivewayPhotosFixtureNew || [],

        // Pole / Area
        poleInstallType: d.poleInstallType || "",
        poleProviding: d.poleProviding || "",
        poleLightDetails: d.poleLightDetails || "",
        poleDistance: d.poleDistance || "",
        polePowerControl: d.polePowerControl || "",
        poleSwitchNewExisting: d.poleSwitchNewExisting || "",
        poleUpgradeSwitch: d.poleUpgradeSwitch || "",
        poleSwitchKind: d.poleSwitchKind || "",
        poleSwitchOtherText: d.poleSwitchOtherText || "",
        poleMultiSwitch: d.poleMultiSwitch || "",
        polePhotosNew: d.polePhotosNew || [],
        polePhotosCurrent: d.polePhotosCurrent || [],
        polePhotosFixtureNew: d.polePhotosFixtureNew || [],

        // Landscape
        landscapeVoltage: d.landscapeVoltage || "",

        // Additional
        additionalInformation: d.additionalInformation || "",
      };
    }
    return null;
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

      // Lighting Type
      lightingType: details?.lightingType || "",

      // Interior
      typeOfInteriorLightingFixture: details?.fixtureKind || "",
      kindOfLightingFixture: details?.fixtureWeight || "",
      isFixtureHaveComplexAssembly: details?.complexAssembly === "Yes",
      tallOfCeiling: details?.ceilingHeight || "",
      detailsOnTypeOfFixture: details?.fixtureDetails || "",
      willProvideNewLight: details?.providingFixture === "Yes",
      kindOfSwitchWant: details?.switchKind || "",
      wantToUpgradeSwitch: details?.upgradeSwitch === "Yes",
      moreThanOneSwitchLocation: details?.multiSwitch === "Yes",
      photosOfWhereWantToInstall: details?.photosOfWhereWantToInstall || [],
      photosOfCurrentLightFixture: details?.photosOfCurrentLightFixture || [],
      photosOfNewLightFixture: details?.photosOfNewLightFixture || [],

      // Flood Lights
      floodInstallHeight: details?.floodInstallHeight || "",
      floodProviding: details?.floodProviding || "",
      floodDetails: details?.floodDetails || "",
      floodPowerControl: details?.floodPowerControl || "",
      floodUpgradeSwitch: details?.floodUpgradeSwitch || "",
      floodSwitchKind: details?.floodSwitchKind || "",
      floodSwitchOtherText: details?.floodSwitchOtherText || "",
      floodMultiSwitch: details?.floodMultiSwitch || "",
      photosOfInstallationAreaFloodLight:
        details?.photosOfInstallationAreaFloodLight || [],
      photosOfCurrentFloodLight: details?.photosOfCurrentFloodLight || [],
      photosOfNewFloodLight: details?.photosOfNewFloodLight || [],

      // Wall Coach
      wallSurface: details?.wallSurface || "",
      wallProviding: details?.wallProviding || "",
      wallNewLightDetails: details?.wallNewLightDetails || "",
      wallUpgradeSwitch: details?.wallUpgradeSwitch || "",
      wallSwitchKind: details?.wallSwitchKind || "",
      wallMultiSwitch: details?.wallMultiSwitch || "",

      // Driveway
      drivewayProviding: details?.drivewayProviding || "",
      drivewayNewLightDetails: details?.drivewayNewLightDetails || "",
      drivewayDistance: details?.drivewayDistance || "",
      drivewayPowerControl: details?.drivewayPowerControl || "",
      drivewayUpgradeSwitch: details?.drivewayUpgradeSwitch || "",
      drivewaySwitchKind: details?.drivewaySwitchKind || "",
      drivewaySwitchOtherText: details?.drivewaySwitchOtherText || "",
      drivewayMultiSwitch: details?.drivewayMultiSwitch || "",

      // Pole Area
      poleProviding: details?.poleProviding || "",
      poleLightDetails: details?.poleLightDetails || "",
      poleDistance: details?.poleDistance || "",
      polePowerControl: details?.polePowerControl || "",
      poleUpgradeSwitch: details?.poleUpgradeSwitch || "",
      poleSwitchKind: details?.poleSwitchKind || "",
      poleSwitchOtherText: details?.poleSwitchOtherText || "",
      poleMultiSwitch: details?.poleMultiSwitch || "",

      // Landscape
      landscapeVoltage: details?.landscapeVoltage || "",

      // Additional
      additionalInformation: details?.additionalInformation || "",

      // ─── Conditional enum fields (omitted if empty) ──────────────────────────
      ...(normalizeInstallType(details?.interiorInstallType || "") && {
        isNewOrReplacement: normalizeInstallType(
          details?.interiorInstallType || "",
        ),
      }),
      ...(normalizeSwitchConnection(details?.switchNewExisting || "") && {
        fixtureConnectedToNewOrExistingSwitch: normalizeSwitchConnection(
          details?.switchNewExisting || "",
        ),
      }),
      ...(normalizeInstallType(details?.floodInstallType || "") && {
        floodInstallType: normalizeInstallType(details?.floodInstallType || ""),
      }),
      ...(normalizeSwitchConnection(details?.floodSwitchNewExisting || "") && {
        floodSwitchNewExisting: normalizeSwitchConnection(
          details?.floodSwitchNewExisting || "",
        ),
      }),
      ...(normalizeInstallType(details?.wallInstallType || "") && {
        wallInstallType: normalizeInstallType(details?.wallInstallType || ""),
      }),
      ...(normalizeSwitchConnection(details?.wallSwitchNewExisting || "") && {
        wallSwitchNewExisting: normalizeSwitchConnection(
          details?.wallSwitchNewExisting || "",
        ),
      }),
      ...(normalizeInstallType(details?.drivewayInstallType || "") && {
        drivewayInstallType: normalizeInstallType(
          details?.drivewayInstallType || "",
        ),
      }),
      ...(normalizeSwitchConnection(
        details?.drivewaySwitchNewExisting || "",
      ) && {
        drivewaySwitchNewExisting: normalizeSwitchConnection(
          details?.drivewaySwitchNewExisting || "",
        ),
      }),
      ...(normalizeInstallType(details?.poleInstallType || "") && {
        poleInstallType: normalizeInstallType(details?.poleInstallType || ""),
      }),
      ...(normalizeSwitchConnection(details?.poleSwitchNewExisting || "") && {
        poleSwitchNewExisting: normalizeSwitchConnection(
          details?.poleSwitchNewExisting || "",
        ),
      }),

      status: "pending" as const,
      completionPercentage: 100,
    };

    setIsSubmitting(true);
    try {
      let result;
      if (serviceCallId) {
        result = await updateDraft(
          serviceCallId,
          serviceType || "Lighting",
          createFormData(payload),
        );
      } else {
        result = await createDraft(
          serviceType || "Lighting",
          createFormData({
            serviceType: serviceType || "Lighting",
            ...payload,
          }),
        );
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
  if (!details) return null;

  return (
    <View>
      {/* ─── Lighting Type ─────────────────────────────────────────────────── */}
      <ReviewSectionTitle title="Lighting Details" />
      <ReviewRow
        label="Lighting Type"
        value={details.lightingType || "Not specified"}
      />

      {/* ─── Interior Lighting ─────────────────────────────────────────────── */}
      {details.lightingType === "Interior Lighting" && (
        <>
          <ReviewSectionTitle title="Interior Lighting" />
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
          {details.providingFixture === "No" && (
            <ReviewRow
              label="Fixture Details"
              value={details.fixtureDetails || "Not specified"}
            />
          )}
          <ReviewRow
            label="Switch Connection"
            value={details.switchNewExisting || "Not specified"}
          />
          {details.switchNewExisting === "Existing" && (
            <ReviewRow
              label="Upgrade Switch"
              value={details.upgradeSwitch || "Not specified"}
            />
          )}
          {(details.switchNewExisting === "New" ||
            details.upgradeSwitch === "Yes") && (
            <ReviewRow
              label="Switch Kind"
              value={details.switchKind || "Not specified"}
            />
          )}
          <ReviewRow
            label="Multiple Switch Locations"
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
        </>
      )}

      {/* ─── Flood Lights ──────────────────────────────────────────────────── */}
      {details.lightingType === "Flood Lights" && (
        <>
          <ReviewSectionTitle title="Flood Lights" />
          <ReviewRow
            label="Install Type"
            value={details.floodInstallType || "Not specified"}
          />
          <ReviewRow
            label="Install Height"
            value={details.floodInstallHeight || "Not specified"}
          />
          <ReviewRow
            label="Providing Fixture"
            value={details.floodProviding || "Not specified"}
          />
          {details.floodProviding === "No" && (
            <ReviewRow
              label="Light Details"
              value={details.floodDetails || "Not specified"}
            />
          )}
          <ReviewRow
            label="Power Control"
            value={details.floodPowerControl || "Not specified"}
          />
          {details.floodPowerControl === "Switch" && (
            <>
              <ReviewRow
                label="Switch Connection"
                value={details.floodSwitchNewExisting || "Not specified"}
              />
              {details.floodSwitchNewExisting === "Existing" && (
                <ReviewRow
                  label="Upgrade Switch"
                  value={details.floodUpgradeSwitch || "Not specified"}
                />
              )}
              {(details.floodSwitchNewExisting === "New" ||
                details.floodUpgradeSwitch === "Yes") && (
                <ReviewRow
                  label="Switch Kind"
                  value={details.floodSwitchKind || "Not specified"}
                />
              )}
              {details.floodSwitchKind === "Other" && (
                <ReviewRow
                  label="Switch Other"
                  value={details.floodSwitchOtherText || "Not specified"}
                />
              )}
              <ReviewRow
                label="Multiple Switch Locations"
                value={details.floodMultiSwitch || "Not specified"}
              />
            </>
          )}
          <ReviewSectionTitle title="Photos" />
          <PhotosRow
            label="Installation Area Photos"
            photos={details.photosOfInstallationAreaFloodLight}
          />
          <PhotosRow
            label="Current Flood Light Photos"
            photos={details.photosOfCurrentFloodLight}
          />
          <PhotosRow
            label="New Flood Light Photos"
            photos={details.photosOfNewFloodLight}
          />
        </>
      )}

      {/* ─── Wall / Coach Lights ───────────────────────────────────────────── */}
      {details.lightingType === "Wall / Coach Lights" && (
        <>
          <ReviewSectionTitle title="Wall / Coach Lights" />
          <ReviewRow
            label="Install Type"
            value={details.wallInstallType || "Not specified"}
          />
          <ReviewRow
            label="Wall Surface"
            value={details.wallSurface || "Not specified"}
          />
          <ReviewRow
            label="Providing Fixture"
            value={details.wallProviding || "Not specified"}
          />
          {details.wallProviding === "No" && (
            <ReviewRow
              label="Light Details"
              value={details.wallNewLightDetails || "Not specified"}
            />
          )}
          <ReviewRow
            label="Switch Connection"
            value={details.wallSwitchNewExisting || "Not specified"}
          />
          {details.wallSwitchNewExisting === "Existing" && (
            <ReviewRow
              label="Upgrade Switch"
              value={details.wallUpgradeSwitch || "Not specified"}
            />
          )}
          {(details.wallSwitchNewExisting === "New" ||
            details.wallUpgradeSwitch === "Yes") && (
            <ReviewRow
              label="Switch Kind"
              value={details.wallSwitchKind || "Not specified"}
            />
          )}
          <ReviewRow
            label="Multiple Switch Locations"
            value={details.wallMultiSwitch || "Not specified"}
          />
          <ReviewSectionTitle title="Photos" />
          <PhotosRow
            label="Installation Area Photos"
            photos={details.wallPhotosNew}
          />
          <PhotosRow
            label="Current Fixture Photos"
            photos={details.wallPhotosCurrent}
          />
          <PhotosRow
            label="New Fixture Photos"
            photos={details.wallPhotosFixtureNew}
          />
        </>
      )}

      {/* ─── Driveway Lighting ─────────────────────────────────────────────── */}
      {details.lightingType === "Driveway Lighting" && (
        <>
          <ReviewSectionTitle title="Driveway Lighting" />
          <ReviewRow
            label="Install Type"
            value={details.drivewayInstallType || "Not specified"}
          />
          <ReviewRow
            label="Providing Fixture"
            value={details.drivewayProviding || "Not specified"}
          />
          {details.drivewayProviding === "No" && (
            <ReviewRow
              label="Light Details"
              value={details.drivewayNewLightDetails || "Not specified"}
            />
          )}
          <ReviewRow
            label="Distance from House"
            value={details.drivewayDistance || "Not specified"}
          />
          <ReviewRow
            label="Power Control"
            value={details.drivewayPowerControl || "Not specified"}
          />
          {details.drivewayPowerControl === "Switch" && (
            <>
              <ReviewRow
                label="Switch Connection"
                value={details.drivewaySwitchNewExisting || "Not specified"}
              />
              {details.drivewaySwitchNewExisting === "Existing" && (
                <ReviewRow
                  label="Upgrade Switch"
                  value={details.drivewayUpgradeSwitch || "Not specified"}
                />
              )}
              {(details.drivewaySwitchNewExisting === "New" ||
                details.drivewayUpgradeSwitch === "Yes") && (
                <ReviewRow
                  label="Switch Kind"
                  value={details.drivewaySwitchKind || "Not specified"}
                />
              )}
              {details.drivewaySwitchKind === "Other" && (
                <ReviewRow
                  label="Switch Other"
                  value={details.drivewaySwitchOtherText || "Not specified"}
                />
              )}
              <ReviewRow
                label="Multiple Switch Locations"
                value={details.drivewayMultiSwitch || "Not specified"}
              />
            </>
          )}
          <ReviewSectionTitle title="Photos" />
          <PhotosRow
            label="Installation Area Photos"
            photos={details.drivewayPhotosNew}
          />
          <PhotosRow
            label="Current Fixture Photos"
            photos={details.drivewayPhotosCurrent}
          />
          <PhotosRow
            label="New Fixture Photos"
            photos={details.drivewayPhotosFixtureNew}
          />
        </>
      )}

      {/* ─── Pole / Area Lighting ──────────────────────────────────────────── */}
      {details.lightingType === "Pole / Area Lighting" && (
        <>
          <ReviewSectionTitle title="Pole / Area Lighting" />
          <ReviewRow
            label="Install Type"
            value={details.poleInstallType || "Not specified"}
          />
          <ReviewRow
            label="Providing Fixture"
            value={details.poleProviding || "Not specified"}
          />
          {details.poleProviding === "No" && (
            <ReviewRow
              label="Light Details"
              value={details.poleLightDetails || "Not specified"}
            />
          )}
          <ReviewRow
            label="Distance"
            value={details.poleDistance || "Not specified"}
          />
          <ReviewRow
            label="Power Control"
            value={details.polePowerControl || "Not specified"}
          />
          {details.polePowerControl === "Switch" && (
            <>
              <ReviewRow
                label="Switch Connection"
                value={details.poleSwitchNewExisting || "Not specified"}
              />
              {details.poleSwitchNewExisting === "Existing" && (
                <ReviewRow
                  label="Upgrade Switch"
                  value={details.poleUpgradeSwitch || "Not specified"}
                />
              )}
              {(details.poleSwitchNewExisting === "New" ||
                details.poleUpgradeSwitch === "Yes") && (
                <ReviewRow
                  label="Switch Kind"
                  value={details.poleSwitchKind || "Not specified"}
                />
              )}
              {details.poleSwitchKind === "Other" && (
                <ReviewRow
                  label="Switch Other"
                  value={details.poleSwitchOtherText || "Not specified"}
                />
              )}
              <ReviewRow
                label="Multiple Switch Locations"
                value={details.poleMultiSwitch || "Not specified"}
              />
            </>
          )}
          <ReviewSectionTitle title="Photos" />
          <PhotosRow
            label="Installation Area Photos"
            photos={details.polePhotosNew}
          />
          <PhotosRow
            label="Current Fixture Photos"
            photos={details.polePhotosCurrent}
          />
          <PhotosRow
            label="New Fixture Photos"
            photos={details.polePhotosFixtureNew}
          />
        </>
      )}

      {/* ─── Landscape ─────────────────────────────────────────────────────── */}
      {details.lightingType === "Landscape" && (
        <>
          <ReviewSectionTitle title="Landscape Lighting" />
          <ReviewRow
            label="Voltage"
            value={details.landscapeVoltage || "Not specified"}
          />
        </>
      )}

      {/* ─── Additional Info ───────────────────────────────────────────────── */}
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
