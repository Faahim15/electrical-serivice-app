import PhotoUploadSection from "@/src/components/quote/PhotoUploadSection";
import { ExhaustFanPhotosFormData } from "@/src/schemas/upload-photos/upload-photos.schema";
import {
  AreaOption,
  AtticFanType,
  BathroomFanType,
  Distance,
  KitchenFanType,
  SpecialtyControl,
  Stories,
  YesNo,
} from "@/src/types/serviceForm.types";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, View } from "react-native";
import { Divider, Label, SectionCard } from "./ExhaustFanCard";
import { OtherInput, StyledInput } from "./ExhaustFanInput";
import { AnimatedOption, ChipOption, RowOption } from "./ExhaustFanOption";

interface ExhaustFanSectionsProps {
  fanLocation: string;
  installType: string;
  // Attic props
  atticFanType: string;
  supplyingAtticFan: string;
  stories: string;
  photosNewFan: string[];
  photosAtticLocation: string[];
  // Kitchen props
  kitchenDuctInfo: string;
  kitchenYesNo: string;
  kitchenFanType: string;
  kitchenAreas: string[];
  kitchenAreaOther: string;
  kitchenDist: string;
  photosKitchenLocation: string[];
  photosKitchenCurrentFan: string[];
  photosKitchenNewFan: string[];
  // Bathroom props
  bathroomDuctInfo: string;
  bathroomYesNo: string;
  bathroomFanType: string;
  specialtyControl: string;
  bathroomAreas: string[];
  bathroomAreaOther: string;
  bathroomDist: string;
  photosBathromlocation: string[];
  photosBathroomCurrentFan: string[];
  photosBathroomNewFan: string[];
  // Upload handler
  onUploadSingle: (uri: string) => Promise<string>;
  onDeleteSingle: (url: string) => Promise<void>;
  isUploading: boolean;
  // Update field
  updateField: (field: string, value: any) => void;
  // Toggle handlers
  toggleKitchenArea: (area: AreaOption) => void;
  toggleBathroomArea: (area: AreaOption) => void;
  // Form props
  control: Control<ExhaustFanPhotosFormData>;
  errors: FieldErrors<ExhaustFanPhotosFormData>;
}

export const ExhaustFanSections = ({
  fanLocation,
  installType,
  // Attic
  atticFanType,
  supplyingAtticFan,
  stories,
  photosNewFan,
  photosAtticLocation,
  // Kitchen
  kitchenDuctInfo,
  kitchenYesNo,
  kitchenFanType,
  kitchenAreas,
  kitchenAreaOther,
  kitchenDist,
  photosKitchenLocation,
  photosKitchenCurrentFan,
  photosKitchenNewFan,
  // Bathroom
  bathroomDuctInfo,
  bathroomYesNo,
  bathroomFanType,
  specialtyControl,
  bathroomAreas,
  bathroomAreaOther,
  bathroomDist,
  photosBathromlocation,
  photosBathroomCurrentFan,
  photosBathroomNewFan,
  // Handlers
  onUploadSingle,
  onDeleteSingle,
  isUploading,
  updateField,
  toggleKitchenArea,
  toggleBathroomArea,
  // Form props
  control,
  errors,
}: ExhaustFanSectionsProps) => {
  const areaOptions: AreaOption[] = [
    "Attic above",
    "Occupied space above",
    "Crawlspace (unfinished)",
    "Crawlspace (finished)",
    "Basement (unfinished)",
    "Basement (finished)",
    "Other",
  ];
  const distanceOptions: Distance[] = [
    "Less than 25 ft",
    "25 – 50 ft",
    "50 – 100 ft",
    "More than 100 ft",
    "Unsure",
  ];

  // ─── Attic Section ──────────────────────────────────────────────────────────
  if (fanLocation === "Attic") {
    return (
      <SectionCard title="Attic Fan Details">
        <Label text="Is it a roof or gable (wall) fan?" />
        <View className="flex-row gap-2.5 mb-4">
          {(["Roof fan", "Gable (wall) fan"] as AtticFanType[]).map((t) => (
            <AnimatedOption
              key={t}
              label={t}
              selected={atticFanType === t}
              onPress={() => updateField("atticFanType", t)}
            />
          ))}
        </View>

        <Label text="Will you be supplying the attic fan?" />
        <View className="flex-row gap-2.5 mb-4">
          {(["Yes", "No"] as YesNo[]).map((v) => (
            <AnimatedOption
              key={v}
              label={v}
              selected={supplyingAtticFan === v}
              onPress={() => updateField("supplyingAtticFan", v)}
            />
          ))}
        </View>

        {supplyingAtticFan === "Yes" && (
          <>
            <Label text="Upload photo of new fan" />
            <Controller
              control={control}
              name="photoOfNewFan"
              render={({ field: { value, onChange } }) => (
                <View>
                  <PhotoUploadSection
                    label="Upload New Fan Photo"
                    photos={value || []}
                    onPhotosChange={(photos) => {
                      onChange(photos);
                      updateField("photosNewFan", photos);
                    }}
                    onUploadSingle={onUploadSingle}
                    onDeleteSingle={onDeleteSingle}
                    isUploading={isUploading}
                  />
                  {errors.photoOfNewFan && (
                    <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                      {errors.photoOfNewFan.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </>
        )}

        <Label text="How many stories is your home?" />
        <View className="flex-row gap-2.5 mb-4">
          {(["1", "2"] as Stories[]).map((s) => (
            <AnimatedOption
              key={s}
              label={s}
              selected={stories === s}
              onPress={() => updateField("stories", s)}
            />
          ))}
        </View>

        <Label text="Upload photo from the ground showing where the attic fan will be installed" />
        <Controller
          control={control}
          name="photosOfInstallationArea"
          render={({ field: { value, onChange } }) => (
            <View>
              <PhotoUploadSection
                label="Upload Install Location Photo"
                photos={value || []}
                onPhotosChange={(photos) => {
                  onChange(photos);
                  updateField("photosAtticLocation", photos);
                }}
                onUploadSingle={onUploadSingle}
                onDeleteSingle={onDeleteSingle}
                isUploading={isUploading}
              />
              {errors.photosOfInstallationArea && (
                <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                  {errors.photosOfInstallationArea.message}
                </Text>
              )}
            </View>
          )}
        />
        <Text className="font-Inter_Regular text-[11px] text-[#717182]">
          This photo helps us understand access and installation conditions.
        </Text>
      </SectionCard>
    );
  }

  // ─── Kitchen Section ───────────────────────────────────────────────────────
  if (fanLocation === "Kitchen") {
    return (
      <SectionCard title="Kitchen Exhaust Fan Details">
        {installType === "New Installation" && (
          <View>
            <Label text="New Kitchen Fan" />
            <Controller
              control={control}
              name="photosOfInstallationArea"
              render={({ field: { value, onChange } }) => (
                <View>
                  <PhotoUploadSection
                    label="Upload photo of installation location"
                    photos={value || []}
                    onPhotosChange={(photos) => {
                      onChange(photos);
                      updateField("photosKitchenLocation", photos);
                    }}
                    onUploadSingle={onUploadSingle}
                    onDeleteSingle={onDeleteSingle}
                    isUploading={isUploading}
                  />
                  {errors.photosOfInstallationArea && (
                    <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                      {errors.photosOfInstallationArea.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        )}

        {installType === "Replacement" && (
          <View>
            <Label text="Current Kitchen Fan" />
            <Label text="Upload photo of current exhaust fan" />
            <PhotoUploadSection
              label="Upload Current Fan Photo"
              photos={photosKitchenCurrentFan}
              onPhotosChange={(p) => updateField("photosKitchenCurrentFan", p)}
              onUploadSingle={onUploadSingle}
              onDeleteSingle={onDeleteSingle}
              isUploading={isUploading}
            />

            <Label text="Existing duct diameter and vent location if known" />
            <StyledInput
              placeholder="duct venting through exterior wall"
              value={kitchenDuctInfo}
              onChangeText={(t) => updateField("kitchenDuctInfo", t)}
            />
          </View>
        )}

        <Label text="Will you be providing the new kitchen exhaust fan?" />
        <View className="flex-row gap-2.5 mb-4">
          {(["Yes", "No"] as YesNo[]).map((v) => (
            <AnimatedOption
              key={v}
              label={v}
              selected={kitchenYesNo === v}
              onPress={() => updateField("kitchenYesNo", v)}
            />
          ))}
        </View>

        {kitchenYesNo === "Yes" && (
          <>
            <Label text="Upload photo of new fan" />
            <Controller
              control={control}
              name="photoOfNewFan"
              render={({ field: { value, onChange } }) => (
                <View>
                  <PhotoUploadSection
                    label="Upload New Fan Photo"
                    photos={value || []}
                    onPhotosChange={(photos) => {
                      onChange(photos);
                      updateField("photosKitchenNewFan", photos);
                    }}
                    onUploadSingle={onUploadSingle}
                    onDeleteSingle={onDeleteSingle}
                    isUploading={isUploading}
                  />
                  {errors.photoOfNewFan && (
                    <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                      {errors.photoOfNewFan.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </>
        )}

        {kitchenYesNo === "No" && (
          <>
            <Label text="What type of exhaust fan do you want?" />
            {(
              [
                "Hood fan over range / stove",
                "Over the range microwave",
                "Through the wall vent",
                "Through the ceiling (commonly over an Island)",
              ] as KitchenFanType[]
            ).map((t) => (
              <RowOption
                key={t}
                label={t}
                selected={kitchenFanType === t}
                onPress={() => updateField("kitchenFanType", t)}
              />
            ))}
          </>
        )}

        <Divider />
        <Label text="What is above / below the area the exhaust fan will be installed? (Select all that apply)" />
        <View className="flex-row flex-wrap mb-1">
          {areaOptions.map((a) => (
            <ChipOption
              key={a}
              label={a}
              selected={kitchenAreas.includes(a)}
              onPress={() => toggleKitchenArea(a)}
            />
          ))}
        </View>
        <OtherInput
          visible={kitchenAreas.includes("Other")}
          placeholder='Please describe "Other" area...'
          value={kitchenAreaOther}
          onChangeText={(t) => updateField("kitchenAreaOther", t)}
        />

        <Divider />
        <Label
          text="What is the approximate distance of the electrical panel from the install location?"
          sub="Measured along walls and ceiling in right angles."
        />
        {distanceOptions.map((d) => (
          <RowOption
            key={d}
            label={d}
            selected={kitchenDist === d}
            onPress={() => updateField("kitchenDist", d)}
          />
        ))}
      </SectionCard>
    );
  }

  // ─── Bathroom Section ─────────────────────────────────────────────────────
  return (
    <SectionCard title="Bathroom Exhaust Fan Details">
      {installType === "New Installation" && (
        <View>
          <Label text="New Bathroom Fan" />
          <Controller
            control={control}
            name="photosOfInstallationArea"
            render={({ field: { value, onChange } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload photo of installation location"
                  photos={value || []}
                  onPhotosChange={(photos) => {
                    onChange(photos);
                    updateField("photosBathromlocation", photos);
                  }}
                  onUploadSingle={onUploadSingle}
                  onDeleteSingle={onDeleteSingle}
                  isUploading={isUploading}
                />
                {errors.photosOfInstallationArea && (
                  <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                    {errors.photosOfInstallationArea.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      )}

      {installType === "Replacement" && (
        <View>
          <Label text="Current Bathroom Fan" />
          <Label text="Upload photo of current exhaust fan" />
          <PhotoUploadSection
            label="Upload Current Fan Photo"
            photos={photosBathroomCurrentFan}
            onPhotosChange={(p) => updateField("photosBathroomCurrentFan", p)}
            onUploadSingle={onUploadSingle}
            onDeleteSingle={onDeleteSingle}
            isUploading={isUploading}
          />

          <Label text="Existing duct diameter and vent location if known" />
          <StyledInput
            placeholder="duct venting through exterior wall"
            value={bathroomDuctInfo}
            onChangeText={(t) => updateField("bathroomDuctInfo", t)}
          />
        </View>
      )}

      <Label text="Will you be providing the new bathroom exhaust fan?" />
      <View className="flex-row gap-2.5 mb-4">
        {(["Yes", "No"] as YesNo[]).map((v) => (
          <AnimatedOption
            key={v}
            label={v}
            selected={bathroomYesNo === v}
            onPress={() => updateField("bathroomYesNo", v)}
          />
        ))}
      </View>

      {bathroomYesNo === "Yes" && (
        <>
          <Label text="Upload photo of new fan" />
          <Controller
            control={control}
            name="photoOfNewFan"
            render={({ field: { value, onChange } }) => (
              <View>
                <PhotoUploadSection
                  label="Upload New Fan Photo"
                  photos={value || []}
                  onPhotosChange={(photos) => {
                    onChange(photos);
                    updateField("photosBathroomNewFan", photos);
                  }}
                  onUploadSingle={onUploadSingle}
                  onDeleteSingle={onDeleteSingle}
                  isUploading={isUploading}
                />
                {errors.photoOfNewFan && (
                  <Text className="text-red-500 text-xs mt-1 ml-2 font-Inter_Regular">
                    {errors.photoOfNewFan.message}
                  </Text>
                )}
              </View>
            )}
          />
        </>
      )}

      {bathroomYesNo === "No" && (
        <>
          <Label text="What type of exhaust fan do you want?" />
          {(
            [
              "Standard",
              "Quiet operation",
              "Bluetooth speaker",
              "Light/fan combo",
              "Heater/light fan combo",
              "Heater/fan (no light) combo",
            ] as BathroomFanType[]
          ).map((t) => (
            <RowOption
              key={t}
              label={t}
              selected={bathroomFanType === t}
              onPress={() => updateField("bathroomFanType", t)}
            />
          ))}
          <Divider />
          <Label text="Do you want a specialty control?" />
          {(
            [
              "No specialty control",
              "Speed control",
              "Humidity sensor",
              "Timer",
            ] as SpecialtyControl[]
          ).map((c) => (
            <RowOption
              key={c}
              label={c}
              selected={specialtyControl === c}
              onPress={() => updateField("specialtyControl", c)}
            />
          ))}
        </>
      )}

      <Divider />
      <Label text="What is above / below the area the exhaust fan will be installed? (Select all that apply)" />
      <View className="flex-row flex-wrap mb-1">
        {areaOptions.map((a) => (
          <ChipOption
            key={a}
            label={a}
            selected={bathroomAreas.includes(a)}
            onPress={() => toggleBathroomArea(a)}
          />
        ))}
      </View>
      <OtherInput
        visible={bathroomAreas.includes("Other")}
        placeholder='Please describe "Other" area...'
        value={bathroomAreaOther}
        onChangeText={(t) => updateField("bathroomAreaOther", t)}
      />

      <Divider />
      <Label
        text="What is the approximate distance of the electrical panel from the install location?"
        sub="Measured along walls and ceiling in right angles."
      />
      {distanceOptions.map((d) => (
        <RowOption
          key={d}
          label={d}
          selected={bathroomDist === d}
          onPress={() => updateField("bathroomDist", d)}
        />
      ))}
    </SectionCard>
  );
};
