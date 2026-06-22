import {
  FixtureWeight,
  InstallType,
  SwitchNewExisting,
} from "@/src/redux/slices/globalstore/lightingDataSlice";
import { updateLightingDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { LightingSectionProps } from "@/src/types/lighting.types";
import React from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { OptionButton } from "../LightingOptionButton";
import { TwoColGrid, YesNoRow } from "../LightingOptionGrid";
import { LightingPhotoUpload } from "../LightingPhotoUpload";
import { Label, SectionCard, SubHeading } from "../LightingSectionCard";
import { LightingTextField } from "../LightingTextField";

const fixtureKinds = [
  "Surface Mount",
  "Recessed",
  "Chain hung chandelier",
  "Pendant (Chain)",
  "Crystal Chandelier",
  "Pendant (Rod)",
  "Pendant (Cord)",
];

const switchKinds = [
  "Standard (Toggle)",
  "Smart",
  "Standard (Rocker/Decorator)",
  "Dimmer (Rocker/Decorator)",
  "Dimmer (Toggle)",
  "Motion",
  "Timer",
  "I'll provide my own",
];

export const InteriorSection = ({
  onUploadSingle,
  onDeleteSingle,
  isUploading,
}: LightingSectionProps) => {
  const dispatch = useDispatch();
  const lightingDetails = useSelector(
    (state: RootState) => state.serviceForm.categoryData?.details,
  );

  const updateField = (field: string, value: any) => {
    dispatch(updateLightingDetails({ [field]: value }));
  };

  const getValue = (field: string) => {
    return (lightingDetails as any)?.[field] ?? "";
  };

  return (
    <SectionCard>
      <Text className="text-lg font-Inter_SemiBold text-[#1F2937] mb-4">
        Interior Lighting Details
      </Text>

      <Label>
        What type of interior lighting fixture(s) will be installed?
      </Label>
      <View className="gap-2 mb-4">
        {(["less than 15 lbs", "greater than 15 lbs"] as FixtureWeight[]).map(
          (w) => (
            <OptionButton
              key={w!}
              label={`Lighting Fixture(s) ${w}`}
              selected={getValue("fixtureWeight") === w}
              onPress={() => updateField("fixtureWeight", w)}
              fullWidth
            />
          ),
        )}
      </View>

      <Label>What kind of light fixture(s) will be installed?</Label>
      <TwoColGrid
        items={fixtureKinds}
        selected={getValue("fixtureKind")}
        onSelect={(v) => updateField("fixtureKind", v)}
      />
      <View className="mb-4" />

      <Label>Does your fixture(s) have a complex assembly?</Label>
      <SubHeading>
        Many parts to be assembled, multiple attachment points, or delivered in
        multiple boxes
      </SubHeading>
      <YesNoRow
        value={getValue("complexAssembly")}
        onChange={(v) => updateField("complexAssembly", v)}
      />
      <View className="mb-4" />

      <Label>Is this a new install or replacement light fixture(s)?</Label>
      <View className="flex-row gap-3 mb-4">
        {(["New Installation", "Replacement"] as InstallType[]).map((opt) => (
          <View key={opt!} style={{ flex: 1 }}>
            <OptionButton
              label={opt!}
              selected={getValue("interiorInstallType") === opt}
              onPress={() => updateField("interiorInstallType", opt)}
            />
          </View>
        ))}
      </View>

      {getValue("interiorInstallType") === "New Installation" && (
        <>
          <Label>
            Upload photos of the area where you want light fixture(s) installed
          </Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload Area Photos"
              photos={getValue("photosOfWhereWantToInstall") || []}
              onPhotosChange={(p) =>
                updateField("photosOfWhereWantToInstall", p)
              }
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      {getValue("interiorInstallType") === "Replacement" && (
        <>
          <Label>Upload photos of current light fixture(s)</Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload Current Fixture Photos"
              photos={getValue("photosOfCurrentLightFixture") || []}
              onPhotosChange={(p) =>
                updateField("photosOfCurrentLightFixture", p)
              }
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      <Label>
        How tall is the ceiling where the light(s) will be installed?
      </Label>
      <LightingTextField
        placeholder="Enter ceiling height"
        value={getValue("ceilingHeight")}
        onChangeText={(v) => updateField("ceilingHeight", v)}
      />

      <Label>Will you be providing the new light fixture(s)?</Label>
      <YesNoRow
        value={getValue("providingFixture")}
        onChange={(v) => updateField("providingFixture", v)}
      />
      <View className="mb-4" />

      {getValue("providingFixture") === "Yes" && (
        <>
          <Label>Upload photo(s) of your new light fixture(s)</Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload New Fixture Photos"
              photos={getValue("photosOfNewLightFixture") || []}
              onPhotosChange={(p) => updateField("photosOfNewLightFixture", p)}
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      {getValue("providingFixture") === "No" && (
        <>
          <Label>
            Please provide details on the type of fixture(s) you want provided
          </Label>
          <LightingTextField
            placeholder="Enter fixture details..."
            value={getValue("fixtureDetails")}
            onChangeText={(v) => updateField("fixtureDetails", v)}
            multiline
          />
        </>
      )}

      <Label>
        Will the fixture(s) be connected to a new or existing switch?
      </Label>
      <View className="flex-row gap-3 mb-4">
        {(["New", "Existing"] as SwitchNewExisting[]).map((opt) => (
          <View key={opt!} style={{ flex: 1 }}>
            <OptionButton
              label={opt!}
              selected={getValue("switchNewExisting") === opt}
              onPress={() => updateField("switchNewExisting", opt)}
            />
          </View>
        ))}
      </View>

      {getValue("switchNewExisting") === "New" && (
        <>
          <Label>What kind of switch do you want installed?</Label>
          <TwoColGrid
            items={switchKinds}
            selected={getValue("switchKind")}
            onSelect={(v) => updateField("switchKind", v)}
          />
          <View className="mb-4" />
        </>
      )}

      {getValue("switchNewExisting") === "Existing" && (
        <>
          <Label>Do you want to upgrade your switch?</Label>
          <YesNoRow
            value={getValue("upgradeSwitch")}
            onChange={(v) => updateField("upgradeSwitch", v)}
          />
          <View className="mb-4" />
        </>
      )}

      {getValue("upgradeSwitch") === "Yes" && (
        <>
          <Label>What kind of switch do you want installed?</Label>
          <TwoColGrid
            items={switchKinds}
            selected={getValue("switchKind")}
            onSelect={(v) => updateField("switchKind", v)}
          />
          <View className="mb-4" />
        </>
      )}

      <Label>Will there be more than one switch location?</Label>
      <YesNoRow
        value={getValue("multiSwitch")}
        onChange={(v) => updateField("multiSwitch", v)}
      />
    </SectionCard>
  );
};
