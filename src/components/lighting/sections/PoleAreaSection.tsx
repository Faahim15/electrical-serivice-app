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

export const PoleAreaSection = ({
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
        Pole / Area Lighting Details
      </Text>

      <Label>Is this a new install or replacement lighting?</Label>
      <View className="flex-row gap-3 mb-4">
        {(["New Installation", "Replacement"] as InstallType[]).map((opt) => (
          <View key={opt!} style={{ flex: 1 }}>
            <OptionButton
              label={opt!}
              selected={getValue("poleInstallType") === opt}
              onPress={() => updateField("poleInstallType", opt)}
            />
          </View>
        ))}
      </View>

      {getValue("poleInstallType") === "New Installation" && (
        <>
          <Label>
            Upload photos of the area where you want light fixture(s) installed
          </Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload Area Photos"
              photos={getValue("polePhotosNew") || []}
              onPhotosChange={(p) => updateField("polePhotosNew", p)}
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      {getValue("poleInstallType") === "Replacement" && (
        <>
          <Label>Upload photos of current light fixture(s)</Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload Current Fixture Photos"
              photos={getValue("polePhotosCurrent") || []}
              onPhotosChange={(p) => updateField("polePhotosCurrent", p)}
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      <Label>Will you be providing the new lighting?</Label>
      <YesNoRow
        value={getValue("poleProviding")}
        onChange={(v) => updateField("poleProviding", v)}
      />
      <View className="mb-4" />

      {getValue("poleProviding") === "Yes" && (
        <>
          <Label>Upload photo(s) of new lights</Label>
          <View className="mb-4">
            <LightingPhotoUpload
              label="Upload Photos"
              photos={getValue("polePhotosFixtureNew") || []}
              onPhotosChange={(p) => updateField("polePhotosFixtureNew", p)}
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />
          </View>
        </>
      )}

      {getValue("poleProviding") === "No" && (
        <>
          <Label>Describe the lighting you want provided</Label>
          <LightingTextField
            placeholder="Enter lighting details..."
            value={getValue("poleLightDetails")}
            onChangeText={(v) => updateField("poleLightDetails", v)}
            multiline
          />
        </>
      )}

      <Label>
        How far from the house do you want the pole / area lighting?
      </Label>
      <LightingTextField
        placeholder="Enter distance from house"
        value={getValue("poleDistance")}
        onChangeText={(v) => updateField("poleDistance", v)}
      />

      <Label>How do you want the lighting controlled?</Label>
      <View className="gap-2 mb-4">
        {controls.map((c) => (
          <OptionButton
            key={c!}
            label={c!}
            selected={getValue("polePowerControl") === c}
            onPress={() => updateField("polePowerControl", c)}
            fullWidth
          />
        ))}
      </View>

      {getValue("polePowerControl") === "Switch" && (
        <>
          <Label>
            Will the fixture(s) be connected to a new or existing switch?
          </Label>
          <View className="flex-row gap-3 mb-4">
            {(["New", "Existing"] as SwitchNewExisting[]).map((opt) => (
              <View key={opt!} style={{ flex: 1 }}>
                <OptionButton
                  label={opt!}
                  selected={getValue("poleSwitchNewExisting") === opt}
                  onPress={() => updateField("poleSwitchNewExisting", opt)}
                />
              </View>
            ))}
          </View>

          {getValue("poleSwitchNewExisting") === "New" && (
            <>
              <Label>What kind of switch do you want installed?</Label>
              <TwoColGrid
                items={["Standard", "Smart", "Other", "I'll provide my own"]}
                selected={getValue("poleSwitchKind")}
                onSelect={(v) => updateField("poleSwitchKind", v)}
              />
              {getValue("poleSwitchKind") === "Other" && (
                <LightingTextField
                  placeholder="Enter the Name of switch want install"
                  value={getValue("poleSwitchOtherText")}
                  onChangeText={(v) => updateField("poleSwitchOtherText", v)}
                />
              )}
              <View className="mb-4" />
            </>
          )}

          {getValue("poleSwitchNewExisting") === "Existing" && (
            <>
              <Label>Do you want to upgrade your switch?</Label>
              <YesNoRow
                value={getValue("poleUpgradeSwitch")}
                onChange={(v) => updateField("poleUpgradeSwitch", v)}
              />
              <View className="mb-4" />
              {getValue("poleUpgradeSwitch") === "Yes" && (
                <>
                  <Label>What kind of switch do you want installed?</Label>
                  <TwoColGrid
                    items={[
                      "Standard",
                      "Smart",
                      "Other",
                      "I'll provide my own",
                    ]}
                    selected={getValue("poleSwitchKind")}
                    onSelect={(v) => updateField("poleSwitchKind", v)}
                  />
                  {getValue("poleSwitchKind") === "Other" && (
                    <LightingTextField
                      placeholder="Enter the Name of switch want install"
                      value={getValue("poleSwitchOtherText")}
                      onChangeText={(v) =>
                        updateField("poleSwitchOtherText", v)
                      }
                    />
                  )}
                  <View className="mb-4" />
                </>
              )}
            </>
          )}

          <Label>Will there be more than one switch location?</Label>
          <YesNoRow
            value={getValue("poleMultiSwitch")}
            onChange={(v) => updateField("poleMultiSwitch", v)}
          />
        </>
      )}
    </SectionCard>
  );
};
