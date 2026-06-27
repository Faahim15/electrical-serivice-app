import { GradientButton } from "@/src/components/onboarding/GradientButton";
import { ReviewRow } from "@/src/components/quote/review/ReviewRow";
import { ReviewSectionTitle } from "@/src/components/quote/review/ReviewSectionTitle";
import React from "react";
import {
  ScrollView as HorizontalScroll,
  Image,
  Text,
  View,
} from "react-native";

interface LightingReviewFormProps {
  draftData: any;
  categoryData: any;
  onSuccess: () => void;
  setIsSubmitting: (value: boolean) => void;
  isSubmitting: boolean;
  serviceCallId?: string;
  serviceType?: string;
}

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

const LightingReviewForm = ({
  draftData,
  categoryData,
  onSuccess,
  isSubmitting,
}: LightingReviewFormProps) => {
  // ─── Get Lighting Details ──────────────────────────────────────────────────
  const getDetails = () => {
    if (categoryData?.categoryId === "17" && categoryData.details) {
      const d = categoryData.details as any;

      // ⭐ Priority: draftData first, then Redux (categoryData.details)
      return {
        // Lighting Type
        lightingType: draftData?.lightingType || d.lightingType || "",

        // Interior
        fixtureWeight: draftData?.fixtureWeight || d.fixtureWeight || "",
        fixtureKind: draftData?.fixtureKind || d.fixtureKind || "",
        complexAssembly: draftData?.complexAssembly || d.complexAssembly || "",
        interiorInstallType:
          draftData?.interiorInstallType || d.interiorInstallType || "",
        ceilingHeight: draftData?.ceilingHeight || d.ceilingHeight || "",
        providingFixture:
          draftData?.providingFixture || d.providingFixture || "",
        fixtureDetails: draftData?.fixtureDetails || d.fixtureDetails || "",
        switchNewExisting:
          draftData?.switchNewExisting || d.switchNewExisting || "",
        upgradeSwitch: draftData?.upgradeSwitch || d.upgradeSwitch || "",
        switchKind: draftData?.switchKind || d.switchKind || "",
        multiSwitch: draftData?.multiSwitch || d.multiSwitch || "",
        photosOfWhereWantToInstall: draftData?.photosOfWhereWantToInstall
          ?.length
          ? draftData.photosOfWhereWantToInstall
          : d.photosOfWhereWantToInstall || [],
        photosOfCurrentLightFixture: draftData?.photosOfCurrentLightFixture
          ?.length
          ? draftData.photosOfCurrentLightFixture
          : d.photosOfCurrentLightFixture || [],
        photosOfNewLightFixture: draftData?.photosOfNewLightFixture?.length
          ? draftData.photosOfNewLightFixture
          : d.photosOfNewLightFixture || [],

        // Flood Lights
        floodInstallType:
          draftData?.floodInstallType || d.floodInstallType || "",
        floodInstallHeight:
          draftData?.floodInstallHeight || d.floodInstallHeight || "",
        floodProviding: draftData?.floodProviding || d.floodProviding || "",
        floodDetails: draftData?.floodDetails || d.floodDetails || "",
        floodPowerControl:
          draftData?.floodPowerControl || d.floodPowerControl || "",
        floodSwitchNewExisting:
          draftData?.floodSwitchNewExisting || d.floodSwitchNewExisting || "",
        floodUpgradeSwitch:
          draftData?.floodUpgradeSwitch || d.floodUpgradeSwitch || "",
        floodSwitchKind: draftData?.floodSwitchKind || d.floodSwitchKind || "",
        floodSwitchOtherText:
          draftData?.floodSwitchOtherText || d.floodSwitchOtherText || "",
        floodMultiSwitch:
          draftData?.floodMultiSwitch || d.floodMultiSwitch || "",
        photosOfInstallationAreaFloodLight: draftData
          ?.photosOfInstallationAreaFloodLight?.length
          ? draftData.photosOfInstallationAreaFloodLight
          : d.photosOfInstallationAreaFloodLight || [],
        photosOfCurrentFloodLight: draftData?.photosOfCurrentFloodLight?.length
          ? draftData.photosOfCurrentFloodLight
          : d.photosOfCurrentFloodLight || [],
        photosOfNewFloodLight: draftData?.photosOfNewFloodLight?.length
          ? draftData.photosOfNewFloodLight
          : d.photosOfNewFloodLight || [],

        // Wall / Coach
        wallInstallType: draftData?.wallInstallType || d.wallInstallType || "",
        wallSurface: draftData?.wallSurface || d.wallSurface || "",
        wallProviding: draftData?.wallProviding || d.wallProviding || "",
        wallNewLightDetails:
          draftData?.wallNewLightDetails || d.wallNewLightDetails || "",
        wallSwitchNewExisting:
          draftData?.wallSwitchNewExisting || d.wallSwitchNewExisting || "",
        wallUpgradeSwitch:
          draftData?.wallUpgradeSwitch || d.wallUpgradeSwitch || "",
        wallSwitchKind: draftData?.wallSwitchKind || d.wallSwitchKind || "",
        wallMultiSwitch: draftData?.wallMultiSwitch || d.wallMultiSwitch || "",
        wallPhotosNew: draftData?.wallPhotosNew?.length
          ? draftData.wallPhotosNew
          : d.wallPhotosNew || [],
        wallPhotosCurrent: draftData?.wallPhotosCurrent?.length
          ? draftData.wallPhotosCurrent
          : d.wallPhotosCurrent || [],
        wallPhotosFixtureNew: draftData?.wallPhotosFixtureNew?.length
          ? draftData.wallPhotosFixtureNew
          : d.wallPhotosFixtureNew || [],

        // Driveway
        drivewayInstallType:
          draftData?.drivewayInstallType || d.drivewayInstallType || "",
        drivewayProviding:
          draftData?.drivewayProviding || d.drivewayProviding || "",
        drivewayNewLightDetails:
          draftData?.drivewayNewLightDetails || d.drivewayNewLightDetails || "",
        drivewayDistance:
          draftData?.drivewayDistance || d.drivewayDistance || "",
        drivewayPowerControl:
          draftData?.drivewayPowerControl || d.drivewayPowerControl || "",
        drivewaySwitchNewExisting:
          draftData?.drivewaySwitchNewExisting ||
          d.drivewaySwitchNewExisting ||
          "",
        drivewayUpgradeSwitch:
          draftData?.drivewayUpgradeSwitch || d.drivewayUpgradeSwitch || "",
        drivewaySwitchKind:
          draftData?.drivewaySwitchKind || d.drivewaySwitchKind || "",
        drivewaySwitchOtherText:
          draftData?.drivewaySwitchOtherText || d.drivewaySwitchOtherText || "",
        drivewayMultiSwitch:
          draftData?.drivewayMultiSwitch || d.drivewayMultiSwitch || "",
        drivewayPhotosNew: draftData?.drivewayPhotosNew?.length
          ? draftData.drivewayPhotosNew
          : d.drivewayPhotosNew || [],
        drivewayPhotosCurrent: draftData?.drivewayPhotosCurrent?.length
          ? draftData.drivewayPhotosCurrent
          : d.drivewayPhotosCurrent || [],
        drivewayPhotosFixtureNew: draftData?.drivewayPhotosFixtureNew?.length
          ? draftData.drivewayPhotosFixtureNew
          : d.drivewayPhotosFixtureNew || [],

        // Pole / Area
        poleInstallType: draftData?.poleInstallType || d.poleInstallType || "",
        poleProviding: draftData?.poleProviding || d.poleProviding || "",
        poleLightDetails:
          draftData?.poleLightDetails || d.poleLightDetails || "",
        poleDistance: draftData?.poleDistance || d.poleDistance || "",
        polePowerControl:
          draftData?.polePowerControl || d.polePowerControl || "",
        poleSwitchNewExisting:
          draftData?.poleSwitchNewExisting || d.poleSwitchNewExisting || "",
        poleUpgradeSwitch:
          draftData?.poleUpgradeSwitch || d.poleUpgradeSwitch || "",
        poleSwitchKind: draftData?.poleSwitchKind || d.poleSwitchKind || "",
        poleSwitchOtherText:
          draftData?.poleSwitchOtherText || d.poleSwitchOtherText || "",
        poleMultiSwitch: draftData?.poleMultiSwitch || d.poleMultiSwitch || "",
        polePhotosNew: draftData?.polePhotosNew?.length
          ? draftData.polePhotosNew
          : d.polePhotosNew || [],
        polePhotosCurrent: draftData?.polePhotosCurrent?.length
          ? draftData.polePhotosCurrent
          : d.polePhotosCurrent || [],
        polePhotosFixtureNew: draftData?.polePhotosFixtureNew?.length
          ? draftData.polePhotosFixtureNew
          : d.polePhotosFixtureNew || [],

        // Landscape
        landscapeVoltage:
          draftData?.landscapeVoltage || d.landscapeVoltage || "",

        // Additional
        additionalInformation:
          draftData?.additionalInformation || d.additionalInformation || "",
      };
    }
    return null;
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

      {/* ─── Submit ───────────────────────────────────────────────────────────── */}
      <GradientButton
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={onSuccess}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default LightingReviewForm;
