import { useImagePicker } from "@/src/hooks/useImagePicker";
import {
  FixtureKind,
  FixtureWeight,
  InstallType,
  LightingType,
  PowerControl,
  SwitchNewExisting,
  SwitchType,
  VoltageType,
  WallSurface,
  YesNo,
  setDrivewayDistance,
  setDrivewayInstallType,
  setDrivewayMultiSwitch,
  setDrivewayNewLightDetails,
  setDrivewayPhotosCurrent,
  setDrivewayPhotosFixtureNew,
  setDrivewayPhotosNew,
  setDrivewayPowerControl,
  setDrivewayProviding,
  setDrivewaySwitchKind,
  setDrivewaySwitchNewExisting,
  setDrivewaySwitchOtherText,
  setDrivewayUpgradeSwitch,
  setFloodDetails,
  setFloodInstallHeight,
  setFloodInstallType,
  setFloodMultiSwitch,
  setFloodPhotosCurrent,
  setFloodPhotosFixtureNew,
  setFloodPhotosNew,
  setFloodPowerControl,
  setFloodProviding,
  setFloodSwitchKind,
  setFloodSwitchNewExisting,
  setFloodSwitchOtherText,
  setFloodUpgradeSwitch,
  setInteriorCeilingHeight,
  setInteriorComplexAssembly,
  setInteriorFixtureDetails,
  setInteriorFixtureKind,
  setInteriorFixtureWeight,
  setInteriorInstallType,
  setInteriorMultiSwitch,
  setInteriorPhotosCurrent,
  setInteriorPhotosFixtureNew,
  setInteriorPhotosNew,
  setInteriorProviding,
  setInteriorSwitchKind,
  setInteriorSwitchNewExisting,
  setInteriorUpgradeSwitch,
  setLandscapeVoltage,
  setLightingType,
  setPoleDistance,
  setPoleInstallType,
  setPoleLightDetails,
  setPoleMultiSwitch,
  setPolePhotosCurrent,
  setPolePhotosFixtureNew,
  setPolePhotosNew,
  setPolePowerControl,
  setPoleProviding,
  setPoleSwitchKind,
  setPoleSwitchNewExisting,
  setPoleSwitchOtherText,
  setPoleUpgradeSwitch,
  setWallInstallType,
  setWallMultiSwitch,
  setWallNewLightDetails,
  setWallPhotosCurrent,
  setWallPhotosFixtureNew,
  setWallPhotosNew,
  setWallProviding,
  setWallSurface,
  setWallSwitchKind,
  setWallSwitchNewExisting,
  setWallUpgradeSwitch,
} from "@/src/redux/slices/globalstore/lightingDataSlice";
import { RootState } from "@/src/redux/store";
import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PhotoUploadSection from "../../PhotoUploadSection";

// ─── AnimatedPressable ────────────────────────────────────────────────────────
const AnimatedTouchable = ({
  onPress,
  children,
  style,
}: {
  onPress: () => void;
  children: React.ReactNode;
  style?: object;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={press}>{children}</Pressable>
    </Animated.View>
  );
};

// ─── OptionButton ─────────────────────────────────────────────────────────────
const OptionButton = ({
  label,
  selected,
  onPress,
  fullWidth = false,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  fullWidth?: boolean;
}) => (
  <AnimatedTouchable onPress={onPress}>
    <View
      className={`rounded-xl border py-3 px-3 items-center justify-center ${
        fullWidth ? "w-full" : ""
      } ${selected ? "bg-[#4AA9F5] border-[#4AA9F5]" : "bg-white border-gray-200"}`}
      style={{ minHeight: 48 }}
    >
      <Text
        className={`text-sm font-Inter_SemiBold text-center ${
          selected ? "text-white" : "text-[#1F2937]"
        }`}
      >
        {label}
      </Text>
    </View>
  </AnimatedTouchable>
);

// ─── TwoColGrid ───────────────────────────────────────────────────────────────
const TwoColGrid = ({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string | null;
  onSelect: (v: string) => void;
}) => (
  <View className="flex-row flex-wrap gap-2">
    {items.map((item) => (
      <View key={item} style={{ width: "48%" }}>
        <OptionButton
          label={item}
          selected={selected === item}
          onPress={() => onSelect(item)}
        />
      </View>
    ))}
  </View>
);

// ─── YesNoRow ─────────────────────────────────────────────────────────────────
const YesNoRow = ({
  value,
  onChange,
}: {
  value: YesNo;
  onChange: (v: YesNo) => void;
}) => (
  <View className="flex-row gap-3">
    {(["Yes", "No"] as YesNo[]).map((opt) => (
      <View key={opt!} style={{ flex: 1 }}>
        <OptionButton
          label={opt!}
          selected={value === opt}
          onPress={() => onChange(opt)}
        />
      </View>
    ))}
  </View>
);

// ─── SectionCard ──────────────────────────────────────────────────────────────
const SectionCard = ({
  children,
  className: cls = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View className={`bg-white rounded-2xl p-4 mb-4 shadow-sm ${cls}`}>
    {children}
  </View>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-[#364153] font-Inter_Medium text-base mb-3 leading-5">
    {children}
  </Text>
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-[#364153] font-Inter_Medium text-xs mb-1">
    {children}
  </Text>
);

// ─── Interior Lighting Section ────────────────────────────────────────────────
const InteriorSection = () => {
  const dispatch = useDispatch();
  const s = useSelector((state: RootState) => state.lighting.interior);
  useImagePicker(); // keep hook alive if needed elsewhere

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
              selected={s.fixtureWeight === w}
              onPress={() => dispatch(setInteriorFixtureWeight(w))}
              fullWidth
            />
          ),
        )}
      </View>

      <Label>What kind of light fixture(s) will be installed?</Label>
      <TwoColGrid
        items={fixtureKinds}
        selected={s.fixtureKind}
        onSelect={(v) => dispatch(setInteriorFixtureKind(v as FixtureKind))}
      />
      <View className="mb-4" />

      <Label>Does your fixture(s) have a complex assembly?</Label>
      <SubHeading>
        Many parts to be assembled, multiple attachment points, or delivered in
        multiple boxes
      </SubHeading>
      <YesNoRow
        value={s.complexAssembly}
        onChange={(v) => dispatch(setInteriorComplexAssembly(v))}
      />
      <View className="mb-4" />

      <Label>Is this a new install or replacement light fixture(s)?</Label>
      <View className="flex-row gap-3 mb-4">
        {(["New Installation", "Replacement"] as InstallType[]).map((opt) => (
          <View key={opt!} style={{ flex: 1 }}>
            <OptionButton
              label={opt!}
              selected={s.installType === opt}
              onPress={() => dispatch(setInteriorInstallType(opt))}
            />
          </View>
        ))}
      </View>

      {s.installType === "New Installation" && (
        <>
          <Label>
            Upload photos of the area where you want light fixture(s) installed
          </Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload Area Photos"
              photos={s.photosNew}
              onPhotosChange={(p) => dispatch(setInteriorPhotosNew(p))}
            />
          </View>
        </>
      )}

      {s.installType === "Replacement" && (
        <>
          <Label>Upload photos of current light fixture(s)</Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload Current Fixture Photos"
              photos={s.photosCurrent}
              onPhotosChange={(p) => dispatch(setInteriorPhotosCurrent(p))}
            />
          </View>
        </>
      )}

      <Label>
        How tall is the ceiling where the light(s) will be installed?
      </Label>
      <TextInput
        className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
        placeholder="Enter ceiling height"
        placeholderTextColor="#aaa"
        value={s.ceilingHeight}
        onChangeText={(v) => dispatch(setInteriorCeilingHeight(v))}
      />

      <Label>Will you be providing the new light fixture(s)?</Label>
      <YesNoRow
        value={s.providing}
        onChange={(v) => dispatch(setInteriorProviding(v))}
      />
      <View className="mb-4" />

      {s.providing === "Yes" && (
        <>
          <Label>Upload photo(s) of your new light fixture(s)</Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload New Fixture Photos"
              photos={s.photosFixtureNew}
              onPhotosChange={(p) => dispatch(setInteriorPhotosFixtureNew(p))}
            />
          </View>
        </>
      )}

      {s.providing === "No" && (
        <>
          <Label>
            Please provide details on the type of fixture(s) you want provided
          </Label>
          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
            placeholder="Enter fixture details..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: "top" }}
            value={s.fixtureDetails}
            onChangeText={(v) => dispatch(setInteriorFixtureDetails(v))}
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
              selected={s.switchNewExisting === opt}
              onPress={() => dispatch(setInteriorSwitchNewExisting(opt))}
            />
          </View>
        ))}
      </View>

      {s.switchNewExisting === "New" && (
        <>
          <Label>What kind of switch do you want installed?</Label>
          <TwoColGrid
            items={switchKinds}
            selected={s.switchKind}
            onSelect={(v) => dispatch(setInteriorSwitchKind(v as SwitchType))}
          />
          <View className="mb-4" />
        </>
      )}

      {s.switchNewExisting === "Existing" && (
        <>
          <Label>Do you want to upgrade your switch?</Label>
          <YesNoRow
            value={s.upgradeSwitch}
            onChange={(v) => dispatch(setInteriorUpgradeSwitch(v))}
          />
          <View className="mb-4" />
        </>
      )}

      {s.upgradeSwitch === "Yes" && (
        <>
          <Label>What kind of switch do you want installed?</Label>
          <TwoColGrid
            items={switchKinds}
            selected={s.switchKind}
            onSelect={(v) => dispatch(setInteriorSwitchKind(v as SwitchType))}
          />
          <View className="mb-4" />
        </>
      )}

      <Label>Will there be more than one switch location?</Label>
      <YesNoRow
        value={s.multiSwitch}
        onChange={(v) => dispatch(setInteriorMultiSwitch(v))}
      />
    </SectionCard>
  );
};

// ─── Flood Lights Section ─────────────────────────────────────────────────────
const FloodLightsSection = () => {
  const dispatch = useDispatch();
  const s = useSelector((state: RootState) => state.lighting.floodLights);

  const switchKinds = [
    "Standard (Toggle)",
    "Smart",
    "Standard (Rocker/Decorator)",
    "Other",
    "I'll provide my own",
  ];

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
              selected={s.installType === opt}
              onPress={() => dispatch(setFloodInstallType(opt))}
            />
          </View>
        ))}
      </View>

      {s.installType === "New Installation" && (
        <>
          <Label>
            Upload photos of the area where you want light fixture(s) installed
          </Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload Area Photos"
              photos={s.photosNew}
              onPhotosChange={(p) => dispatch(setFloodPhotosNew(p))}
            />
          </View>
        </>
      )}

      {s.installType === "Replacement" && (
        <>
          <Label>Upload photos of current light fixture(s)</Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload Current Fixture Photos"
              photos={s.photosCurrent}
              onPhotosChange={(p) => dispatch(setFloodPhotosCurrent(p))}
            />
          </View>
        </>
      )}

      <Label>How high will the flood light(s) be installed?</Label>
      <TextInput
        className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
        placeholder="Enter installation height"
        placeholderTextColor="#aaa"
        value={s.installHeight}
        onChangeText={(v) => dispatch(setFloodInstallHeight(v))}
      />

      <Label>Will you be providing the new flood light(s)?</Label>
      <YesNoRow
        value={s.providing}
        onChange={(v) => dispatch(setFloodProviding(v))}
      />
      <View className="mb-4" />

      {s.providing === "Yes" && (
        <>
          <Label>Upload photo(s) of new fixture(s)</Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload New Flood Light Photos"
              photos={s.photosFixtureNew}
              onPhotosChange={(p) => dispatch(setFloodPhotosFixtureNew(p))}
            />
          </View>
        </>
      )}

      {s.providing === "No" && (
        <>
          <Label>
            Please provide details on the type of flood light(s) you want
            provided
          </Label>
          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
            placeholder="Enter flood light details..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: "top" }}
            value={s.floodDetails}
            onChangeText={(v) => dispatch(setFloodDetails(v))}
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
            selected={s.powerControl === opt}
            onPress={() => dispatch(setFloodPowerControl(opt))}
            fullWidth
          />
        ))}
      </View>

      {s.powerControl === "Switch" && (
        <>
          <Label>
            Will the fixture(s) be connected to a new or existing switch?
          </Label>
          <View className="flex-row gap-3 mb-4">
            {(["New", "Existing"] as SwitchNewExisting[]).map((opt) => (
              <View key={opt!} style={{ flex: 1 }}>
                <OptionButton
                  label={opt!}
                  selected={s.switchNewExisting === opt}
                  onPress={() => dispatch(setFloodSwitchNewExisting(opt))}
                />
              </View>
            ))}
          </View>

          {s.switchNewExisting === "New" && (
            <>
              <Label>What kind of switch do you want installed?</Label>
              <TwoColGrid
                items={switchKinds}
                selected={s.switchKind}
                onSelect={(v) => dispatch(setFloodSwitchKind(v as SwitchType))}
              />
              {s.switchKind === "Other" && (
                <TextInput
                  className="border mt-3 border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
                  placeholder="Enter the Name of switch want install"
                  placeholderTextColor="#aaa"
                  value={s.switchOtherText}
                  onChangeText={(v) => dispatch(setFloodSwitchOtherText(v))}
                />
              )}
              <View className="mb-4" />
            </>
          )}

          {s.switchNewExisting === "Existing" && (
            <>
              <Label>Do you want to upgrade your switch?</Label>
              <YesNoRow
                value={s.upgradeSwitch}
                onChange={(v) => dispatch(setFloodUpgradeSwitch(v))}
              />
              <View className="mb-4" />
            </>
          )}

          {s.upgradeSwitch === "Yes" && (
            <>
              <Label>What kind of switch do you want installed?</Label>
              <TwoColGrid
                items={switchKinds}
                selected={s.switchKind}
                onSelect={(v) => dispatch(setFloodSwitchKind(v as SwitchType))}
              />
              {s.switchKind === "Other" && (
                <TextInput
                  className="border mt-3 border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
                  placeholder="Enter the Name of switch want install"
                  placeholderTextColor="#aaa"
                  value={s.switchOtherText}
                  onChangeText={(v) => dispatch(setFloodSwitchOtherText(v))}
                />
              )}
              <View className="mb-4" />
            </>
          )}

          <Label>Will there be more than one switch location?</Label>
          <YesNoRow
            value={s.multiSwitch}
            onChange={(v) => dispatch(setFloodMultiSwitch(v))}
          />
        </>
      )}
    </SectionCard>
  );
};

// ─── Wall / Coach Lights Section ──────────────────────────────────────────────
const WallCoachSection = () => {
  const dispatch = useDispatch();
  const s = useSelector((state: RootState) => state.lighting.wallCoach);

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

  return (
    <SectionCard>
      <Text className="text-[#0A0A0A] font-Inter_SemiBold text-base mb-4">
        Wall / Coach Lights Details
      </Text>

      <Label>Is this a new install or replacement light fixture(s)?</Label>
      <View className="flex-row gap-3 mb-4">
        {(["New Installation", "Replacement"] as InstallType[]).map((opt) => (
          <View key={opt!} style={{ flex: 1 }}>
            <OptionButton
              label={opt!}
              selected={s.installType === opt}
              onPress={() => dispatch(setWallInstallType(opt))}
            />
          </View>
        ))}
      </View>

      {s.installType === "New Installation" && (
        <>
          <Label>
            Upload photos of the area where you want light fixture(s) installed
          </Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload Area Photos"
              photos={s.photosNew}
              onPhotosChange={(p) => dispatch(setWallPhotosNew(p))}
            />
          </View>
        </>
      )}

      {s.installType === "Replacement" && (
        <>
          <Label>Upload photos of current light fixture(s)</Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload Current Fixture Photos"
              photos={s.photosCurrent}
              onPhotosChange={(p) => dispatch(setWallPhotosCurrent(p))}
            />
          </View>
        </>
      )}

      {s.installType === "New Installation" && (
        <View>
          <Label>What type of surface will the lights be mounted to?</Label>
          <TwoColGrid
            items={surfaces}
            selected={s.surface}
            onSelect={(v) => dispatch(setWallSurface(v as WallSurface))}
          />
          <View className="mb-4" />
        </View>
      )}

      <Label>Will you be providing the new light fixture(s)?</Label>
      <YesNoRow
        value={s.providing}
        onChange={(v) => dispatch(setWallProviding(v))}
      />
      <View className="mb-4" />

      {s.providing === "Yes" && (
        <>
          <Label>Upload photo(s) of your new light fixture(s)</Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload New Fixture Photos"
              photos={s.photosFixtureNew}
              onPhotosChange={(p) => dispatch(setWallPhotosFixtureNew(p))}
            />
          </View>
        </>
      )}

      {s.providing === "No" && (
        <>
          <Label>
            Please provide details on the type of New light(s) you want provided
          </Label>
          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
            placeholder="Enter new light details..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: "top" }}
            value={s.newLightDetails}
            onChangeText={(v) => dispatch(setWallNewLightDetails(v))}
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
              selected={s.switchNewExisting === opt}
              onPress={() => dispatch(setWallSwitchNewExisting(opt))}
            />
          </View>
        ))}
      </View>

      {s.switchNewExisting === "New" && (
        <>
          <Label>What kind of switch do you want installed?</Label>
          <TwoColGrid
            items={switchKinds}
            selected={s.switchKind}
            onSelect={(v) => dispatch(setWallSwitchKind(v as SwitchType))}
          />
          <View className="mb-4" />
        </>
      )}

      {s.switchNewExisting === "Existing" && (
        <>
          <Label>Do you want to upgrade your switch?</Label>
          <YesNoRow
            value={s.upgradeSwitch}
            onChange={(v) => dispatch(setWallUpgradeSwitch(v))}
          />
          <View className="mb-4" />
          {s.upgradeSwitch === "Yes" && (
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
                selected={s.switchKind}
                onSelect={(v) => dispatch(setWallSwitchKind(v as SwitchType))}
              />
              <View className="mb-4" />
            </>
          )}
        </>
      )}

      <Label>Will there be more than one switch location?</Label>
      <YesNoRow
        value={s.multiSwitch}
        onChange={(v) => dispatch(setWallMultiSwitch(v))}
      />
    </SectionCard>
  );
};

// ─── Driveway Lighting Section ────────────────────────────────────────────────
const DrivewaySection = () => {
  const dispatch = useDispatch();
  const s = useSelector((state: RootState) => state.lighting.driveway);

  const controls: PowerControl[] = ["Switch", "Dusk to dawn", "Timer"];

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
              selected={s.installType === opt}
              onPress={() => dispatch(setDrivewayInstallType(opt))}
            />
          </View>
        ))}
      </View>

      {s.installType === "New Installation" && (
        <>
          <Label>
            Upload photos of the area where you want light fixture(s) installed
          </Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload Area Photos"
              photos={s.photosNew}
              onPhotosChange={(p) => dispatch(setDrivewayPhotosNew(p))}
            />
          </View>
        </>
      )}

      {s.installType === "Replacement" && (
        <>
          <Label>Upload photos of current light fixture(s)</Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload Current Fixture Photos"
              photos={s.photosCurrent}
              onPhotosChange={(p) => dispatch(setDrivewayPhotosCurrent(p))}
            />
          </View>
        </>
      )}

      <Label>Will you be providing the new lighting?</Label>
      <YesNoRow
        value={s.providing}
        onChange={(v) => dispatch(setDrivewayProviding(v))}
      />
      <View className="mb-4" />

      {s.providing === "Yes" && (
        <>
          <Label>Upload photo(s) of new lights</Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload Current Lighting Photos"
              photos={s.photosFixtureNew}
              onPhotosChange={(p) => dispatch(setDrivewayPhotosFixtureNew(p))}
            />
          </View>
        </>
      )}

      {s.providing === "No" && (
        <>
          <Label>
            Please provide details on the type of New light(s) you want provided
          </Label>
          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
            placeholder="Enter new light details..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: "top" }}
            value={s.newLightDetails}
            onChangeText={(v) => dispatch(setDrivewayNewLightDetails(v))}
          />
        </>
      )}

      <Label>How far from the house is the driveway lighting?</Label>
      <TextInput
        className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
        placeholder="Enter distance from house"
        placeholderTextColor="#aaa"
        value={s.distance}
        onChangeText={(v) => dispatch(setDrivewayDistance(v))}
      />

      <Label>How do you want the lighting controlled?</Label>
      <View className="gap-2 mb-4">
        {controls.map((c) => (
          <OptionButton
            key={c!}
            label={c!}
            selected={s.powerControl === c}
            onPress={() => dispatch(setDrivewayPowerControl(c))}
            fullWidth
          />
        ))}
      </View>

      {s.powerControl === "Switch" && (
        <>
          <Label>
            Will the fixture(s) be connected to a new or existing switch?
          </Label>
          <View className="flex-row gap-3 mb-4">
            {(["New", "Existing"] as SwitchNewExisting[]).map((opt) => (
              <View key={opt!} style={{ flex: 1 }}>
                <OptionButton
                  label={opt!}
                  selected={s.switchNewExisting === opt}
                  onPress={() => dispatch(setDrivewaySwitchNewExisting(opt))}
                />
              </View>
            ))}
          </View>

          {s.switchNewExisting === "New" && (
            <>
              <Label>What kind of switch do you want installed?</Label>
              <TwoColGrid
                items={["Standard", "Smart", "Other", "I'll provide my own"]}
                selected={s.switchKind}
                onSelect={(v) =>
                  dispatch(setDrivewaySwitchKind(v as SwitchType))
                }
              />
              {s.switchKind === "Other" && (
                <TextInput
                  className="border mt-3 border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
                  placeholder="Enter the Name of switch want install"
                  placeholderTextColor="#aaa"
                  value={s.switchOtherText}
                  onChangeText={(v) => dispatch(setDrivewaySwitchOtherText(v))}
                />
              )}
              <View className="mb-4" />
            </>
          )}

          {s.switchNewExisting === "Existing" && (
            <>
              <Label>Do you want to upgrade your switch?</Label>
              <YesNoRow
                value={s.upgradeSwitch}
                onChange={(v) => dispatch(setDrivewayUpgradeSwitch(v))}
              />
              <View className="mb-4" />
            </>
          )}

          {s.upgradeSwitch === "Yes" && (
            <>
              <Label>What kind of switch do you want installed?</Label>
              <TwoColGrid
                items={["Standard", "Smart", "Other", "I'll provide my own"]}
                selected={s.switchKind}
                onSelect={(v) =>
                  dispatch(setDrivewaySwitchKind(v as SwitchType))
                }
              />
              {s.switchKind === "Other" && (
                <TextInput
                  className="border mt-3 border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
                  placeholder="Enter the Name of switch want install"
                  placeholderTextColor="#aaa"
                  value={s.switchOtherText}
                  onChangeText={(v) => dispatch(setDrivewaySwitchOtherText(v))}
                />
              )}
              <View className="mb-4" />
            </>
          )}

          <Label>Will there be more than one switch location?</Label>
          <YesNoRow
            value={s.multiSwitch}
            onChange={(v) => dispatch(setDrivewayMultiSwitch(v))}
          />
        </>
      )}
    </SectionCard>
  );
};

// ─── Pole / Area Lighting Section ─────────────────────────────────────────────
const PoleAreaSection = () => {
  const dispatch = useDispatch();
  const s = useSelector((state: RootState) => state.lighting.poleArea);

  const controls: PowerControl[] = ["Switch", "Dusk to dawn", "Timer"];

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
              selected={s.installType === opt}
              onPress={() => dispatch(setPoleInstallType(opt))}
            />
          </View>
        ))}
      </View>

      {s.installType === "New Installation" && (
        <>
          <Label>
            Upload photos of the area where you want light fixture(s) installed
          </Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload Area Photos"
              photos={s.photosNew}
              onPhotosChange={(p) => dispatch(setPolePhotosNew(p))}
            />
          </View>
        </>
      )}

      {s.installType === "Replacement" && (
        <>
          <Label>Upload photos of current light fixture(s)</Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload Current Fixture Photos"
              photos={s.photosCurrent}
              onPhotosChange={(p) => dispatch(setPolePhotosCurrent(p))}
            />
          </View>
        </>
      )}

      <Label>Will you be providing the new lighting?</Label>
      <YesNoRow
        value={s.providing}
        onChange={(v) => dispatch(setPoleProviding(v))}
      />
      <View className="mb-4" />

      {s.providing === "Yes" && (
        <>
          <Label>Upload photo(s) of new lights</Label>
          <View className="mb-4">
            <PhotoUploadSection
              label="Upload Photos"
              photos={s.photosFixtureNew}
              onPhotosChange={(p) => dispatch(setPolePhotosFixtureNew(p))}
            />
          </View>
        </>
      )}

      {s.providing === "No" && (
        <>
          <Label>Describe the lighting you want provided</Label>
          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
            placeholder="Enter lighting details..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: "top" }}
            value={s.lightDetails}
            onChangeText={(v) => dispatch(setPoleLightDetails(v))}
          />
        </>
      )}

      <Label>
        How far from the house do you want the pole / area lighting?
      </Label>
      <TextInput
        className="border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
        placeholder="Enter distance from house"
        placeholderTextColor="#aaa"
        value={s.distance}
        onChangeText={(v) => dispatch(setPoleDistance(v))}
      />

      <Label>How do you want the lighting controlled?</Label>
      <View className="gap-2 mb-4">
        {controls.map((c) => (
          <OptionButton
            key={c!}
            label={c!}
            selected={s.powerControl === c}
            onPress={() => dispatch(setPolePowerControl(c))}
            fullWidth
          />
        ))}
      </View>

      {s.powerControl === "Switch" && (
        <>
          <Label>
            Will the fixture(s) be connected to a new or existing switch?
          </Label>
          <View className="flex-row gap-3 mb-4">
            {(["New", "Existing"] as SwitchNewExisting[]).map((opt) => (
              <View key={opt!} style={{ flex: 1 }}>
                <OptionButton
                  label={opt!}
                  selected={s.switchNewExisting === opt}
                  onPress={() => dispatch(setPoleSwitchNewExisting(opt))}
                />
              </View>
            ))}
          </View>

          {s.switchNewExisting === "New" && (
            <>
              <Label>What kind of switch do you want installed?</Label>
              <TwoColGrid
                items={["Standard", "Smart", "Other", "I'll provide my own"]}
                selected={s.switchKind}
                onSelect={(v) => dispatch(setPoleSwitchKind(v as SwitchType))}
              />
              {s.switchKind === "Other" && (
                <TextInput
                  className="border mt-3 border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
                  placeholder="Enter the Name of switch want install"
                  placeholderTextColor="#aaa"
                  value={s.switchOtherText}
                  onChangeText={(v) => dispatch(setPoleSwitchOtherText(v))}
                />
              )}
              <View className="mb-4" />
            </>
          )}

          {s.switchNewExisting === "Existing" && (
            <>
              <Label>Do you want to upgrade your switch?</Label>
              <YesNoRow
                value={s.upgradeSwitch}
                onChange={(v) => dispatch(setPoleUpgradeSwitch(v))}
              />
              <View className="mb-4" />
              {s.upgradeSwitch === "Yes" && (
                <>
                  <Label>What kind of switch do you want installed?</Label>
                  <TwoColGrid
                    items={[
                      "Standard",
                      "Smart",
                      "Other",
                      "I'll provide my own",
                    ]}
                    selected={s.switchKind}
                    onSelect={(v) =>
                      dispatch(setPoleSwitchKind(v as SwitchType))
                    }
                  />
                  {s.switchKind === "Other" && (
                    <TextInput
                      className="border mt-3 border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800 font-Inter_Regular"
                      placeholder="Enter the Name of switch want install"
                      placeholderTextColor="#aaa"
                      value={s.switchOtherText}
                      onChangeText={(v) => dispatch(setPoleSwitchOtherText(v))}
                    />
                  )}
                  <View className="mb-4" />
                </>
              )}
            </>
          )}

          <Label>Will there be more than one switch location?</Label>
          <YesNoRow
            value={s.multiSwitch}
            onChange={(v) => dispatch(setPoleMultiSwitch(v))}
          />
        </>
      )}
    </SectionCard>
  );
};

// ─── Landscape Section ────────────────────────────────────────────────────────
const LandscapeSection = () => {
  const dispatch = useDispatch();
  const s = useSelector((state: RootState) => state.lighting.landscape);

  return (
    <SectionCard>
      <Text className="text-[#0A0A0A] font-Inter_SemiBold text-base mb-4">
        Landscape Lighting Details
      </Text>

      <Label>
        Will this be Line Voltage (120 volt) or Low Voltage (12–24 volt)?
      </Label>
      <View className="gap-2 mb-4">
        {(["Line Voltage", "Low Voltage"] as VoltageType[]).map((v) => (
          <OptionButton
            key={v!}
            label={v!}
            selected={s.voltage === v}
            onPress={() => dispatch(setLandscapeVoltage(v))}
            fullWidth
          />
        ))}
      </View>

      <View className="border border-[#4AA9F5] rounded-xl p-4 bg-blue-50">
        <Text className="text-[#4AA9F5] font-Inter_Regular text-sm leading-5">
          We will reach out to schedule a site visit as soon as possible in
          order to provide you a quote.
        </Text>
      </View>
    </SectionCard>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const LightingSt1 = () => {
  const dispatch = useDispatch();
  const lightingType = useSelector(
    (state: RootState) => state.lighting.lightingType,
  );

  const lightingTypes: LightingType[] = [
    "Interior Lighting",
    "Flood Lights",
    "Wall / Coach Lights",
    "Driveway Lighting",
    "Pole / Area Lighting",
    "Landscape",
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [lightingType]);

  const handleTypeSelect = (t: LightingType) => {
    fadeAnim.setValue(0);
    dispatch(setLightingType(t));
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const renderDetailsSection = () => {
    if (!lightingType) return null;
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        {lightingType === "Interior Lighting" && <InteriorSection />}
        {lightingType === "Flood Lights" && <FloodLightsSection />}
        {lightingType === "Wall / Coach Lights" && <WallCoachSection />}
        {lightingType === "Driveway Lighting" && <DrivewaySection />}
        {lightingType === "Pole / Area Lighting" && <PoleAreaSection />}
        {lightingType === "Landscape" && <LandscapeSection />}
      </Animated.View>
    );
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-[#EFF6FF] px-2 py-1.5 justify-center items-center rounded-full w-32 mb-2">
          <Text className="text-sm font-Inter_Medium text-[#60A5FA]">
            Lighting
          </Text>
        </View>

        <SectionCard>
          <Text className="text-2xl font-Inter_Bold text-[#1F2937] mb-1">
            Lighting Type
          </Text>
          <Text className="text-lg font-Inter_SemiBold text-[#1F2937] mb-4">
            What type of lighting do you need?
          </Text>
          <TwoColGrid
            items={lightingTypes as string[]}
            selected={lightingType}
            onSelect={(v) => handleTypeSelect(v as LightingType)}
          />
        </SectionCard>

        {renderDetailsSection()}
      </ScrollView>
    </View>
  );
};

export default LightingSt1;
