import {
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
import { Label, SectionCard } from "../LightingSectionCard";
import { LightingTextField } from "../LightingTextField";

const switchKinds = [
  "Standard (Toggle)",
  "Smart",
  "Standard (Rocker/Decorator)",
  "Other",
  "I'll provide my own",
];

export const FloodLightsSection = ({
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
      <Text className="text-[#0A0A0A] font-Inter_SemiBold text-base mb-4">
        Flood Lights Details
      </Text>

      <Label>Is this a new install or replacement flood light(s)?</Label>
      <View className="flex-row gap-3 mb-4">
        {(["New Installation", "Replacement"] as InstallType[]).map((opt) => (
          <View key={opt!} style={{ flex: 1 }}>
            <OptionButton
              label={opt!}
              selected={getValue("floodInstallType") === opt}
              onPress={() => updateField("floodInstallType", opt)}
            />
          </View>
        ))}
      </View>

      {getValue("floodInstallType") === "New Installation" && (
        <>
          <Label>
            Upload photos of the area where you want light fixture(s) installed
          </Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload Area Photos"
              photos={getValue("photosOfInstallationAreaFloodLight") || []}
              onPhotosChange={(p) =>
                updateField("photosOfInstallationAreaFloodLight", p)
              }
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      {getValue("floodInstallType") === "Replacement" && (
        <>
          <Label>Upload photos of current light fixture(s)</Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload Current Fixture Photos"
              photos={getValue("photosOfCurrentFloodLight") || []}
              onPhotosChange={(p) =>
                updateField("photosOfCurrentFloodLight", p)
              }
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      <Label>How high will the flood light(s) be installed?</Label>
      <LightingTextField
        placeholder="Enter installation height"
        value={getValue("floodInstallHeight")}
        onChangeText={(v) => updateField("floodInstallHeight", v)}
      />

      <Label>Will you be providing the new flood light(s)?</Label>
      <YesNoRow
        value={getValue("floodProviding")}
        onChange={(v) => updateField("floodProviding", v)}
      />
      <View className="mb-4" />

      {getValue("floodProviding") === "Yes" && (
        <>
          <Label>Upload photo(s) of new fixture(s)</Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload New Flood Light Photos"
              photos={getValue("photosOfNewFloodLight") || []}
              onPhotosChange={(p) => updateField("photosOfNewFloodLight", p)}
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      {getValue("floodProviding") === "No" && (
        <>
          <Label>
            Please provide details on the type of flood light(s) you want
            provided
          </Label>
          <LightingTextField
            placeholder="Enter flood light details..."
            value={getValue("floodDetails")}
            onChangeText={(v) => updateField("floodDetails", v)}
            multiline
          />
        </>
      )}

      <Label>
        Will the flood light(s) be controlled by a switch or have constant
        power?
      </Label>
      <View className="gap-2 mb-4">
        {(
          [
            "Switch",
            "Constant Power (for motion / camera flood lights)",
          ] as string[]
        ).map((opt) => (
          <OptionButton
            key={opt}
            label={opt}
            selected={getValue("floodPowerControl") === opt}
            onPress={() => updateField("floodPowerControl", opt)}
            fullWidth
          />
        ))}
      </View>

      {getValue("floodPowerControl") === "Switch" && (
        <>
          <Label>
            Will the fixture(s) be connected to a new or existing switch?
          </Label>
          <View className="flex-row gap-3 mb-4">
            {(["New", "Existing"] as SwitchNewExisting[]).map((opt) => (
              <View key={opt!} style={{ flex: 1 }}>
                <OptionButton
                  label={opt!}
                  selected={getValue("floodSwitchNewExisting") === opt}
                  onPress={() => updateField("floodSwitchNewExisting", opt)}
                />
              </View>
            ))}
          </View>

          {getValue("floodSwitchNewExisting") === "New" && (
            <>
              <Label>What kind of switch do you want installed?</Label>
              <TwoColGrid
                items={switchKinds}
                selected={getValue("floodSwitchKind")}
                onSelect={(v) => updateField("floodSwitchKind", v)}
              />
              {getValue("floodSwitchKind") === "Other" && (
                <LightingTextField
                  placeholder="Enter the Name of switch want install"
                  value={getValue("floodSwitchOtherText")}
                  onChangeText={(v) => updateField("floodSwitchOtherText", v)}
                />
              )}
              <View className="mb-4" />
            </>
          )}

          {getValue("floodSwitchNewExisting") === "Existing" && (
            <>
              <Label>Do you want to upgrade your switch?</Label>
              <YesNoRow
                value={getValue("floodUpgradeSwitch")}
                onChange={(v) => updateField("floodUpgradeSwitch", v)}
              />
              <View className="mb-4" />
            </>
          )}

          {getValue("floodUpgradeSwitch") === "Yes" && (
            <>
              <Label>What kind of switch do you want installed?</Label>
              <TwoColGrid
                items={switchKinds}
                selected={getValue("floodSwitchKind")}
                onSelect={(v) => updateField("floodSwitchKind", v)}
              />
              {getValue("floodSwitchKind") === "Other" && (
                <LightingTextField
                  placeholder="Enter the Name of switch want install"
                  value={getValue("floodSwitchOtherText")}
                  onChangeText={(v) => updateField("floodSwitchOtherText", v)}
                />
              )}
              <View className="mb-4" />
            </>
          )}

          <Label>Will there be more than one switch location?</Label>
          <YesNoRow
            value={getValue("floodMultiSwitch")}
            onChange={(v) => updateField("floodMultiSwitch", v)}
          />
        </>
      )}
    </SectionCard>
  );
};
