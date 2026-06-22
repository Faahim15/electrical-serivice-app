import {
  InstallType,
  PowerControl,
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

const controls: PowerControl[] = ["Switch", "Dusk to dawn", "Timer"];

export const DrivewaySection = ({
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
        Driveway Lighting Details
      </Text>

      <Label>Is this a new install or replacement lighting?</Label>
      <View className="flex-row gap-3 mb-4">
        {(["New Installation", "Replacement"] as InstallType[]).map((opt) => (
          <View key={opt!} style={{ flex: 1 }}>
            <OptionButton
              label={opt!}
              selected={getValue("drivewayInstallType") === opt}
              onPress={() => updateField("drivewayInstallType", opt)}
            />
          </View>
        ))}
      </View>

      {getValue("drivewayInstallType") === "New Installation" && (
        <>
          <Label>
            Upload photos of the area where you want light fixture(s) installed
          </Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload Area Photos"
              photos={getValue("drivewayPhotosNew") || []}
              onPhotosChange={(p) => updateField("drivewayPhotosNew", p)}
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      {getValue("drivewayInstallType") === "Replacement" && (
        <>
          <Label>Upload photos of current light fixture(s)</Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload Current Fixture Photos"
              photos={getValue("drivewayPhotosCurrent") || []}
              onPhotosChange={(p) => updateField("drivewayPhotosCurrent", p)}
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      <Label>Will you be providing the new lighting?</Label>
      <YesNoRow
        value={getValue("drivewayProviding")}
        onChange={(v) => updateField("drivewayProviding", v)}
      />
      <View className="mb-4" />

      {getValue("drivewayProviding") === "Yes" && (
        <>
          <Label>Upload photo(s) of new lights</Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload Current Lighting Photos"
              photos={getValue("drivewayPhotosFixtureNew") || []}
              onPhotosChange={(p) => updateField("drivewayPhotosFixtureNew", p)}
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      {getValue("drivewayProviding") === "No" && (
        <>
          <Label>
            Please provide details on the type of New light(s) you want provided
          </Label>
          <LightingTextField
            placeholder="Enter new light details..."
            value={getValue("drivewayNewLightDetails")}
            onChangeText={(v) => updateField("drivewayNewLightDetails", v)}
            multiline
          />
        </>
      )}

      <Label>How far from the house is the driveway lighting?</Label>
      <LightingTextField
        placeholder="Enter distance from house"
        value={getValue("drivewayDistance")}
        onChangeText={(v) => updateField("drivewayDistance", v)}
      />

      <Label>How do you want the lighting controlled?</Label>
      <View className="gap-2 mb-4">
        {controls.map((c) => (
          <OptionButton
            key={c!}
            label={c!}
            selected={getValue("drivewayPowerControl") === c}
            onPress={() => updateField("drivewayPowerControl", c)}
            fullWidth
          />
        ))}
      </View>

      {getValue("drivewayPowerControl") === "Switch" && (
        <>
          <Label>
            Will the fixture(s) be connected to a new or existing switch?
          </Label>
          <View className="flex-row gap-3 mb-4">
            {(["New", "Existing"] as SwitchNewExisting[]).map((opt) => (
              <View key={opt!} style={{ flex: 1 }}>
                <OptionButton
                  label={opt!}
                  selected={getValue("drivewaySwitchNewExisting") === opt}
                  onPress={() => updateField("drivewaySwitchNewExisting", opt)}
                />
              </View>
            ))}
          </View>

          {getValue("drivewaySwitchNewExisting") === "New" && (
            <>
              <Label>What kind of switch do you want installed?</Label>
              <TwoColGrid
                items={["Standard", "Smart", "Other", "I'll provide my own"]}
                selected={getValue("drivewaySwitchKind")}
                onSelect={(v) => updateField("drivewaySwitchKind", v)}
              />
              {getValue("drivewaySwitchKind") === "Other" && (
                <LightingTextField
                  placeholder="Enter the Name of switch want install"
                  value={getValue("drivewaySwitchOtherText")}
                  onChangeText={(v) =>
                    updateField("drivewaySwitchOtherText", v)
                  }
                />
              )}
              <View className="mb-4" />
            </>
          )}

          {getValue("drivewaySwitchNewExisting") === "Existing" && (
            <>
              <Label>Do you want to upgrade your switch?</Label>
              <YesNoRow
                value={getValue("drivewayUpgradeSwitch")}
                onChange={(v) => updateField("drivewayUpgradeSwitch", v)}
              />
              <View className="mb-4" />
            </>
          )}

          {getValue("drivewayUpgradeSwitch") === "Yes" && (
            <>
              <Label>What kind of switch do you want installed?</Label>
              <TwoColGrid
                items={["Standard", "Smart", "Other", "I'll provide my own"]}
                selected={getValue("drivewaySwitchKind")}
                onSelect={(v) => updateField("drivewaySwitchKind", v)}
              />
              {getValue("drivewaySwitchKind") === "Other" && (
                <LightingTextField
                  placeholder="Enter the Name of switch want install"
                  value={getValue("drivewaySwitchOtherText")}
                  onChangeText={(v) =>
                    updateField("drivewaySwitchOtherText", v)
                  }
                />
              )}
              <View className="mb-4" />
            </>
          )}

          <Label>Will there be more than one switch location?</Label>
          <YesNoRow
            value={getValue("drivewayMultiSwitch")}
            onChange={(v) => updateField("drivewayMultiSwitch", v)}
          />
        </>
      )}
    </SectionCard>
  );
};
