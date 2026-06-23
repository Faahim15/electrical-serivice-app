import { updateLightingDetails } from "@/src/redux/slices/serviceFormSlice";
import { RootState } from "@/src/redux/store";
import { LightingSectionProps } from "@/src/types/lighting.types";
import React from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { OptionButton } from "../LightingOptionButton";
import { TwoColGrid, YesNoRow } from "../LightingOptionGrid";
import { LightingPhotoUpload } from "../LightingPhotoUpload";
import { Label, SectionCard } from "../LightingSectionCard";
import { LightingTextField } from "../LightingTextField";

const surfaces = ["Brick", "Siding", "Stucco", "Concrete", "Wood", "Metal"];
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

export const WallCoachSection = ({
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

  const wallInstallType = getValue("wallInstallType");

  return (
    <SectionCard>
      <Text className="text-[#0A0A0A] font-Inter_SemiBold text-base mb-4">
        Wall / Coach Lights Details
      </Text>

      <Label>Is this a new install or replacement light fixture(s)?</Label>
      <View className="flex-row gap-3 mb-4">
        {["New Installation", "Replacement"].map((opt) => (
          <View key={opt} style={{ flex: 1 }}>
            <OptionButton
              label={opt}
              selected={wallInstallType === opt}
              onPress={() => {
                if (opt === "New Installation") {
                  updateField("wallInstallType", "New Installation");
                  updateField("wallPhotosCurrent", []);
                } else if (opt === "Replacement") {
                  updateField("wallInstallType", "Replacement");
                  updateField("wallPhotosNew", []);
                }
              }}
            />
          </View>
        ))}
      </View>

      {wallInstallType === "New Installation" && (
        <>
          <Label>
            Upload photos of the area where you want light fixture(s) installed
          </Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload Area Photos"
              photos={getValue("wallPhotosNew") || []}
              onPhotosChange={(p) => updateField("wallPhotosNew", p)}
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      {wallInstallType === "Replacement" && (
        <>
          <Label>Upload photos of current light fixture(s)</Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload Current Fixture Photos"
              photos={getValue("wallPhotosCurrent") || []}
              onPhotosChange={(p) => updateField("wallPhotosCurrent", p)}
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      {wallInstallType === "New Installation" && (
        <View>
          <Label>What type of surface will the lights be mounted to?</Label>
          <TwoColGrid
            items={surfaces}
            selected={getValue("wallSurface")}
            onSelect={(v) => updateField("wallSurface", v)}
          />
          <View className="mb-4" />
        </View>
      )}

      <Label>Will you be providing the new light fixture(s)?</Label>
      <YesNoRow
        value={getValue("wallProviding")}
        onChange={(v) => updateField("wallProviding", v)}
      />
      <View className="mb-4" />

      {getValue("wallProviding") === "Yes" && (
        <>
          <Label>Upload photo(s) of your new light fixture(s)</Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload New Fixture Photos"
              photos={getValue("wallPhotosFixtureNew") || []}
              onPhotosChange={(p) => updateField("wallPhotosFixtureNew", p)}
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      {getValue("wallProviding") === "No" && (
        <>
          <Label>
            Please provide details on the type of New light(s) you want provided
          </Label>
          <LightingTextField
            placeholder="Enter new light details..."
            value={getValue("wallNewLightDetails")}
            onChangeText={(v) => updateField("wallNewLightDetails", v)}
            multiline
          />
        </>
      )}

      <Label>
        Will the fixture(s) be connected to a new or existing switch?
      </Label>
      <View className="flex-row gap-3 mb-4">
        {["New", "Existing"].map((opt) => (
          <View key={opt} style={{ flex: 1 }}>
            <OptionButton
              label={opt}
              selected={getValue("wallSwitchNewExisting") === opt}
              onPress={() => updateField("wallSwitchNewExisting", opt)}
            />
          </View>
        ))}
      </View>

      {getValue("wallSwitchNewExisting") === "New" && (
        <>
          <Label>What kind of switch do you want installed?</Label>
          <TwoColGrid
            items={switchKinds}
            selected={getValue("wallSwitchKind")}
            onSelect={(v) => updateField("wallSwitchKind", v)}
          />
          <View className="mb-4" />
        </>
      )}

      {getValue("wallSwitchNewExisting") === "Existing" && (
        <>
          <Label>Do you want to upgrade your switch?</Label>
          <YesNoRow
            value={getValue("wallUpgradeSwitch")}
            onChange={(v) => updateField("wallUpgradeSwitch", v)}
          />
          <View className="mb-4" />
          {getValue("wallUpgradeSwitch") === "Yes" && (
            <>
              <Label>What kind of switch do you want installed?</Label>
              <TwoColGrid
                items={[
                  "Standard",
                  "Toggle",
                  "Rocker (Decorator)",
                  "Smart",
                  "Dimmer",
                  "Motion",
                  "Timer",
                  "I'll provide my own",
                ]}
                selected={getValue("wallSwitchKind")}
                onSelect={(v) => updateField("wallSwitchKind", v)}
              />
              <View className="mb-4" />
            </>
          )}
        </>
      )}

      <Label>Will there be more than one switch location?</Label>
      <YesNoRow
        value={getValue("wallMultiSwitch")}
        onChange={(v) => updateField("wallMultiSwitch", v)}
      />
    </SectionCard>
  );
};
