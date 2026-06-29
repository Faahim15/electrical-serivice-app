// ─── Helpers ────────────────────────────────────────────────────────────────
const resolve = (draftVal: any, detailVal: any, fallback: any = "") =>
  draftVal ?? detailVal ?? fallback;

const resolveArr = (draftArr: any[], detailArr: any[]) =>
  draftArr?.length ? draftArr : detailArr || [];

const resolveBool = (draftVal: any, detailCondition: boolean) =>
  draftVal !== undefined ? draftVal : detailCondition;

// ─── Common fields — সব 18 category তে same ─────────────────────────────────
export const buildCommonFields = (
  d: any,
  contactDetails: any,
  serviceAddress: any,
  projectBasics: any,
) => ({
  fullName: resolve(d?.fullName, contactDetails.fullName),
  phoneNumber: resolve(d?.phoneNumber, contactDetails.phone),
  emailAddress: resolve(d?.emailAddress, contactDetails.email),
  preferredContactMethod: resolve(
    d?.preferredContactMethod,
    contactDetails.preferredContact,
  ),
  streetAddress: resolve(d?.streetAddress, serviceAddress.streetAddress),
  apartmentUnit: resolve(d?.apartmentUnit, serviceAddress.apartment),
  city: resolve(d?.city, serviceAddress.city),
  state: resolve(d?.state, serviceAddress.state),
  zipCode: resolve(d?.zipCode, serviceAddress.zipCode),
  propertyType: resolve(d?.propertyType, projectBasics.propertyType),
  ownershipStatus: resolve(d?.ownershipStatus, projectBasics.ownershipStatus),
  timelineUrgency: resolve(d?.timelineUrgency, projectBasics.timeline),
  status: "pending" as const,
  completionPercentage: 100,
});

// ─── Main payload builder ────────────────────────────────────────────────────
export const buildPayload = (
  serviceType: string,
  draftData: any,
  categoryData: any,
  contactDetails: any,
  serviceAddress: any,
  projectBasics: any,
): Record<string, any> => {
  const d = draftData as any;
  const det = categoryData?.details as any;
  const common = buildCommonFields(
    d,
    contactDetails,
    serviceAddress,
    projectBasics,
  );

  switch (serviceType) {
    case "Service Call":
      return {
        ...common,
        serviceType: "Service Call",
        issueDescription: resolve(d?.issueDescription, det?.projectDetails),
        preferredTime: resolve(d?.preferredTime, det?.preferredTime),
        schedulingPreference: resolveArr(
          d?.schedulingPreference,
          det?.schedulingDays,
        ),
        panelPhotos: resolveArr(d?.panelPhotos, det?.panelPhotos),
        workAreaPhotos: resolveArr(d?.workAreaPhotos, det?.workAreaPhotos),
        extraReferencePhotos: resolveArr(
          d?.extraReferencePhotos,
          det?.referencePhotos,
        ),
        notes: resolve(d?.notes, det?.additionalNotes),
        quickTags: resolveArr(d?.quickTags, det?.quickTags),
      };

    case "EV Charger Installation":
      return {
        ...common,
        chargerConnectionType: resolve(
          d?.chargerConnectionType,
          det?.chargerType,
        ),
        nemaConfiguration: resolve(d?.nemaConfiguration, det?.nemaConfig),
        chargerProvidedByUser: resolveBool(
          d?.chargerProvidedByUser,
          det?.providingCharger === "Yes",
        ),
        chargerStatus: resolve(d?.chargerStatus, det?.chargerStatus),
        installationLocation: resolve(
          d?.installationLocation,
          det?.installationLocation,
        ),
        panelLocation: resolve(d?.panelLocation, det?.panelLocation),
        panelDistance: resolve(d?.panelDistance, det?.panelDistance),
        environment: resolve(d?.environment, det?.environment),
        budget: resolve(d?.budget, det?.budget),
        accessibility: resolve(d?.accessibility, det?.accessibility),
        schedule: resolve(d?.schedule, det?.schedule),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalInfo,
        ),
        areaPhoto: resolve(d?.areaPhoto, det?.chargerAreaPhotos?.[0]),
        panelPhotos: resolveArr(d?.panelPhotos, det?.panelPhotos),
      };

    case "Panel Upgrade / Replacement":
    case "Panel Upgrade/Replacement":
      return {
        ...common,
        panelServiceType: resolve(d?.panelServiceType, det?.serviceType),
        desiredPanelAmperage: resolve(
          d?.desiredPanelAmperage,
          det?.upgradeAmps,
        ),
        currentPanelAmperage:
          d?.currentPanelAmperage === "Other"
            ? resolve(det?.currentAmperageOther, d?.currentPanelAmperage)
            : resolve(d?.currentPanelAmperage, det?.currentAmperage),
        powerFeedType: resolve(d?.powerFeedType, det?.powerType),
        panelLocation:
          d?.panelLocation === "Other (please specify)"
            ? resolve(det?.panelLocationOther, d?.panelLocation)
            : resolve(d?.panelLocation, det?.panelLocation),
        meterPhotos: resolveArr(d?.meterPhotos, det?.meterPhotos),
        panelPhotos: resolveArr(d?.panelPhotos, det?.panelPhotos),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalInfo,
        ),
      };

    case "Remodeling":
      return {
        ...common,
        panelLocation:
          d?.panelLocation === "Other (please specify)"
            ? resolve(det?.panelLocationOther, d?.panelLocation)
            : resolve(d?.panelLocation, det?.panelLocation),
        remodelingAreas: resolve(d?.remodelingAreas, det?.remodlingArea),
        hasPlansDrawings: resolveBool(
          d?.hasPlansDrawings,
          det?.hasPlans === "Yes",
        ),
        plansDrawings: resolveArr(d?.plansDrawings, det?.planPhotos),
        electricalNeeds: resolve(d?.electricalNeeds, det?.electricalNeeds),
        permitApplied: resolveBool(d?.permitApplied, det?.hasPermit === "Yes"),
        permitNumber: resolve(d?.permitNumber, det?.permitNumber),
        existingSpacePhotos: resolveArr(
          d?.existingSpacePhotos,
          det?.existingSpacePhotos,
        ),
        panelPhotos: resolveArr(d?.panelPhotos, det?.panelPhotos),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalInfo,
        ),
      };

    case "Accessory Building / Shed Power":
      return {
        ...common,
        entireSquareFootage: resolve(
          d?.entireSquareFootage,
          Number(det?.squareFootage),
          0,
        ),
        intendedUse: resolve(d?.intendedUse, det?.intendedUse),
        buildingStatus: resolve(d?.buildingStatus, det?.buildingStatus),
        constructionType: resolve(d?.constructionType, det?.constructionType),
        floorType: resolve(d?.floorType, det?.floorType),
        electricalNeeds: resolve(d?.electricalNeeds, det?.electricalNeeds),
        hasHeatingOrCooling: resolveBool(
          d?.hasHeatingOrCooling,
          det?.hasHeatingCooling === "Yes",
        ),
        electricalServiceType: resolve(
          d?.electricalServiceType,
          det?.serviceType,
        ),
        serviceSize: resolve(d?.serviceSize, det?.serviceSize),
        panelLocation: resolve(
          d?.panelLocation,
          det?.panelLocation === "Other (please specify)"
            ? det?.panelLocationOther
            : det?.panelLocation,
        ),
        routeDetails: resolve(d?.routeDetails, det?.routeDetails),
        hasPlansDrawings: resolveBool(
          d?.hasPlansDrawings,
          det?.hasPlans === "Yes",
        ),
        plansDrawings: resolveArr(d?.plansDrawings, det?.planDrawingPhotos),
        permitApplied: resolveBool(d?.permitApplied, det?.hasPermit === "Yes"),
        permitNumber: resolve(d?.permitNumber, det?.permitNumber),
        existingSpacePhotos: resolveArr(
          d?.existingSpacePhotos,
          det?.existingSpacePhotos,
        ),
        panelPhotos: resolveArr(d?.panelPhotos, det?.panelPhotos),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalInfo,
        ),
      };

    case "Hot tub Installation":
    case "Hot tub installation":
      return {
        ...common,
        hasDigitalManual: resolveBool(
          d?.hasDigitalManual,
          det?.hasUserManual === "Yes",
        ),
        manualDocument:
          resolveArr(d?.manualDocument, det?.userManualPhotos)[0] ?? "",
        hotTubManufacturer: resolve(d?.hotTubManufacturer, det?.manufacturer),
        hotTubModelNumber: resolve(d?.hotTubModelNumber, det?.modelNumber),
        amperageNeeded: resolve(d?.amperageNeeded, det?.amperage),
        location: resolve(d?.location, det?.placement),
        panelLocation: resolve(d?.panelLocation, det?.panelLocation),
        panelDistance: resolve(d?.panelDistance, det?.panelDistance),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalInfo,
        ),
        panelPhotos: resolveArr(d?.panelPhotos, det?.panelPhotos),
        hotTubPhotos: resolveArr(d?.hotTubPhotos, det?.installLocationPhotos),
        receptaclePhotos: resolveArr(
          d?.receptaclePhotos,
          det?.receptaclePhotos,
        ),
      };

    case "Dock Power":
      return {
        ...common,
        isDockBuilt: resolveBool(d?.isDockBuilt, det?.dockBuilt === "Yes"),
        electricalNeedsDetails: resolve(
          d?.electricalNeedsDetails,
          det?.electricalNeeds,
        ),
        receptacleCount: resolve(
          d?.receptacleCount,
          parseInt(det?.receptacleCount),
          0,
        ),
        electricalServiceType: resolve(
          d?.electricalServiceType,
          det?.serviceType,
        ),
        subPanelSize: resolve(d?.subPanelSize, det?.subPanelSize),
        panelLocation: resolve(d?.panelLocation, det?.panelLocation),
        routeDistanceDetails: resolve(
          d?.routeDistanceDetails,
          det?.routeDistance,
        ),
        hasPlansDrawings: resolveBool(
          d?.hasPlansDrawings,
          det?.hasPlans === "Yes",
        ),
        plansDrawingsPhotos: resolveArr(
          d?.plansDrawingsPhotos,
          det?.planDrawingPhotos,
        ),
        permitApplied: resolveBool(d?.permitApplied, det?.hasPermit === "Yes"),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalInfo,
        ),
        panelPhotos: resolveArr(d?.panelPhotos, det?.panelPhotos),
        existingSpacePhotos: resolveArr(
          d?.existingSpacePhotos,
          det?.existingSpacePhotos,
        ),
      };

    case "Electric System":
    case "Electrical Systems Inspection":
      return {
        ...common,
        inspectionType: resolve(d?.inspectionType, det?.inspectionType),
        panelNeedForInspected: resolve(
          d?.panelNeedForInspected,
          det?.squareFootage || det?.panelCount,
        ),
        panelPhotos: resolveArr(d?.panelPhotos, det?.panelPhotos),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalInfo,
        ),
      };

    case "Generator Installation":
      return {
        ...common,
        generatorType: resolve(d?.generatorType, det?.generatorType),
        isAlreadyHaveGenerator: resolveBool(
          d?.isAlreadyHaveGenerator,
          det?.hasGenerator === "Yes",
        ),
        generatorOutputPower: resolve(d?.generatorOutputPower, det?.kwOutput),
        preferredBackupInstallation: resolve(
          d?.preferredBackupInstallation,
          det?.backupInstallation,
        ),
        generatorDistanceFromInletLocation: resolve(
          d?.generatorDistanceFromInletLocation,
          det?.panelDistance,
        ),
        electricPanelLocation: resolve(
          d?.electricPanelLocation,
          det?.panelLocation,
        ),
        sizeOfGeneratorWanted: resolve(
          d?.sizeOfGeneratorWanted,
          det?.purchaseSize,
        ),
        backupNeeds: resolve(d?.backupNeeds, det?.backedUpCircuits),
        isHavePropane: resolveBool(d?.isHavePropane, det?.hasPropane === "Yes"),
        electricPanelPhotos: resolveArr(
          d?.electricPanelPhotos,
          det?.panelPhotos,
        ),
        photosOfWhereGeneratorWillBeInlet: resolveArr(
          d?.photosOfWhereGeneratorWillBeInlet,
          det?.generatorPhotos,
        ),
        generatorInstallationLocationPhotos: resolveArr(
          d?.generatorInstallationLocationPhotos,
          det?.installLocationPhotos,
        ),
        photosOfElectricalMeter: resolveArr(
          d?.photosOfElectricalMeter,
          det?.meterPhotos,
        ),
      };

    case "New Construction":
      return {
        ...common,
        hasConstructionBegun: resolveBool(
          d?.hasConstructionBegun,
          det?.constructionBegun === "Yes",
        ),
        stageOfConstruction: resolve(
          d?.stageOfConstruction,
          det?.constructionStage,
        ),
        haveBuildingPlans: resolveBool(
          d?.haveBuildingPlans,
          det?.hasBuildingPlans === "Yes",
        ),
        photosOfBuildingPlans: resolveArr(
          d?.photosOfBuildingPlans,
          det?.buildingPlanPhotos || det?.buildingPlanPhotos2,
        ),
      };

    case "Home Surge Protection":
      return {
        ...common,
        photosOfElectricalPanel: resolveArr(
          d?.photosOfElectricalPanel,
          det?.panelPhotos,
        ),
        additionalNotes: resolve(d?.additionalNotes, det?.additionalNotes),
      };

    case "Starlink Installation":
      return {
        ...common,
        haveStarlinkEquipment: resolveBool(
          d?.haveStarlinkEquipment,
          det?.haveStarlinkEquipment === "Yes",
        ),
        whenHaveEquipment: resolve(
          d?.whenHaveEquipment,
          det?.whenHaveEquipment,
        ),
        dishLocation: resolve(d?.dishLocation, det?.dishLocation),
        haveMountingEquipment: resolveBool(
          d?.haveMountingEquipment,
          det?.haveMountingEquipment === "Yes",
        ),
        roomOfRouterIn: resolve(d?.roomOfRouterIn, det?.roomOfRouterIn),
        roomCondition: resolve(d?.roomCondition, det?.roomCondition),
        areaOfInstallationPhotos: resolveArr(
          d?.areaOfInstallationPhotos,
          det?.areaOfInstallationPhotos,
        ),
        photosOfRoomForRouter: resolveArr(
          d?.photosOfRoomForRouter,
          det?.photosOfRoomForRouter,
        ),
        additionalNotes: resolve(d?.additionalNotes, det?.additionalNotes),
      };

    case "Dedicated Circuit Installation":
      return {
        ...common,
        whyNeedDedicatedCircuit: resolve(
          d?.whyNeedDedicatedCircuit,
          det?.whyNeedDedicatedCircuit,
        ),
        electricalPanelLocation: resolve(
          d?.electricalPanelLocation,
          det?.electricalPanelLocation,
        ),
        whereWillDedicatedCircuitInstalled: resolve(
          d?.whereWillDedicatedCircuitInstalled,
          det?.whereWillDedicatedCircuitInstalled,
        ),
        aboveBelowArea: resolve(d?.aboveBelowArea, det?.aboveBelowArea),
        distanceElectricalPanelToInstallationArea: resolve(
          d?.distanceElectricalPanelToInstallationArea,
          det?.distanceElectricalPanelToInstallationArea,
        ),
        ampsNeeded: resolve(d?.ampsNeeded, det?.ampsNeeded),
        voltsNeeded: resolve(d?.voltsNeeded, det?.voltsNeeded),
        NEMAConfiguration: resolve(
          d?.NEMAConfiguration,
          det?.NEMAConfiguration,
        ),
        photosOfElectricalMeter: resolveArr(
          d?.photosOfElectricalMeter,
          det?.photosOfElectricalMeter,
        ),
        photosOfInstallationLocation: resolveArr(
          d?.photosOfInstallationLocation,
          det?.photosOfInstallationLocation,
        ),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalNotes,
        ),
      };

    case "Exhaust Fan":
    case "Exhaust Fan Installation":
      return {
        ...common,
        newOrReplacement: resolve(d?.newOrReplacement, det?.installationType),
        locationOfExhaustFan: resolve(
          d?.locationOfExhaustFan,
          det?.fanLocation || det?.fanType,
        ),
        isRoofOrGableFan: resolve(d?.isRoofOrGableFan, det?.atticFanType),
        willSupplyAtticFan: resolveBool(
          d?.willSupplyAtticFan,
          det?.existingFan === "Yes" || det?.supplyingAtticFan === "Yes",
        ),
        howManyStories: resolve(d?.howManyStories, parseInt(det?.stories), 0),
        whereElectricalPanelLocated: resolve(
          d?.whereElectricalPanelLocated,
          det?.panelLocation === "Other"
            ? det?.panelLocationOther
            : det?.panelLocation,
        ),
        existingDuctAndVentDiameterLocation: resolve(
          d?.existingDuctAndVentDiameterLocation,
          det?.kitchenDuctInfo || det?.bathroomDuctInfo,
        ),
        willProvideKitchenExhaustFan: resolveBool(
          d?.willProvideKitchenExhaustFan,
          det?.kitchenYesNo === "Yes",
        ),
        willProvideBathroomExhaustFan: resolveBool(
          d?.willProvideBathroomExhaustFan,
          det?.bathroomYesNo === "Yes",
        ),
        typeOfExhaustFanWanted: resolve(
          d?.typeOfExhaustFanWanted,
          det?.kitchenFanType || det?.bathroomFanType,
        ),
        specialityControlsWanted: resolve(
          d?.specialityControlsWanted,
          det?.specialtyControl,
        ),
        aboveBelowAreaOfExhaustFan: resolve(
          d?.aboveBelowAreaOfExhaustFan,
          det?.kitchenAreas?.[0] || det?.bathroomAreas?.[0],
        ),
        distanceOfElectricalPanelToExhaustFan: resolve(
          d?.distanceOfElectricalPanelToExhaustFan,
          det?.kitchenDist || det?.bathroomDist,
        ),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalNotes,
        ),
        photosOfInstallationArea: resolveArr(
          d?.photosOfInstallationArea,
          det?.photosKitchenLocation?.length > 0
            ? det.photosKitchenLocation
            : det?.photosBathromlocation?.length > 0
              ? det.photosBathromlocation
              : det?.photosAtticLocation,
        ),
        photoOfNewFan: resolveArr(
          d?.photoOfNewFan,
          det?.photosNewFan?.length > 0
            ? det.photosNewFan
            : det?.photosKitchenNewFan?.length > 0
              ? det.photosKitchenNewFan
              : det?.photosBathroomNewFan,
        ),
        photosOfPanelCloseUp: resolveArr(
          d?.photosOfPanelCloseUp,
          det?.panelClosePhotos,
        ),
        photosOfPanelWideShot: resolveArr(
          d?.photosOfPanelWideShot,
          det?.panelWidePhotos,
        ),
        photosOfCurrentKitchenExhaustFan: resolveArr(
          d?.photosOfCurrentKitchenExhaustFan,
          det?.photosKitchenCurrentFan,
        ),
        photosOfCurrentBathroomExhaustFan: resolveArr(
          d?.photosOfCurrentBathroomExhaustFan,
          det?.photosBathroomCurrentFan,
        ),
      };

    case "Outlets":
    case "Outlets Installation":
    case "Outlet Installation":
      return {
        ...common,
        intendedUseOfOutlets: resolve(
          d?.intendedUseOfOutlets,
          det?.intendedUse,
        ),
        howManyOutletsNeeds: resolve(
          d?.howManyOutletsNeeds,
          det?.numberOfOutlets,
        ),
        newInstallationOrReplacement: resolve(
          d?.newInstallationOrReplacement,
          det?.installationType,
        ),
        typeOfOutletsNeed: resolve(
          d?.typeOfOutletsNeed,
          (det?.outletTypes || []).join(", "),
        ),
        howManyAmps: resolve(d?.howManyAmps, det?.ampsNeeded),
        ampsOrVoltsNeeded: resolve(d?.ampsOrVoltsNeeded, det?.voltsNeeded),
        NEMAConfiguration: resolve(
          d?.NEMAConfiguration,
          det?.NEMAConfiguration,
        ),
        photosOfWhereOutletsInstall: resolveArr(
          d?.photosOfWhereOutletsInstall,
          det?.photosOfWhereOutletsInstall,
        ),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalNotes,
        ),
      };

    case "Switches":
    case "Switches Installation":
      return {
        ...common,
        howManySwitchesNeeded: resolve(
          d?.howManySwitchesNeeded,
          det?.howManySwitchesNeeded,
        ),
        isNewInstallationOrReplacement: resolve(
          d?.isNewInstallationOrReplacement,
          det?.isNewInstallationOrReplacement,
        ),
        typeOfSwitchesNeeded: resolveArr(
          d?.typeOfSwitchesNeeded,
          det?.typeOfSwitchesNeeded,
        ),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalInformation,
        ),
        photosOfWhereSwitchesInstallationNeeded: resolveArr(
          d?.photosOfWhereSwitchesInstallationNeeded,
          det?.photosOfWhereSwitchesInstallationNeeded,
        ),
      };

    case "Lighting":
    case "Lighting Installation":
      return {
        ...common,
        lightingType: resolve(d?.lightingType, det?.lightingType),
        typeOfInteriorLightingFixture: resolve(
          d?.typeOfInteriorLightingFixture,
          det?.fixtureKind,
        ),
        kindOfLightingFixture: resolve(
          d?.kindOfLightingFixture,
          det?.fixtureWeight,
        ),
        isFixtureHaveComplexAssembly: resolveBool(
          d?.isFixtureHaveComplexAssembly,
          det?.complexAssembly === "Yes",
        ),
        tallOfCeiling: resolve(d?.tallOfCeiling, det?.ceilingHeight),
        detailsOnTypeOfFixture: resolve(
          d?.detailsOnTypeOfFixture,
          det?.fixtureDetails,
        ),
        willProvideNewLight: resolveBool(
          d?.willProvideNewLight,
          det?.providingFixture === "Yes",
        ),
        kindOfSwitchWant: resolve(d?.kindOfSwitchWant, det?.switchKind),
        wantToUpgradeSwitch: resolveBool(
          d?.wantToUpgradeSwitch,
          det?.upgradeSwitch === "Yes",
        ),
        moreThanOneSwitchLocation: resolveBool(
          d?.moreThanOneSwitchLocation,
          det?.multiSwitch === "Yes",
        ),
        photosOfWhereWantToInstall: resolveArr(
          d?.photosOfWhereWantToInstall,
          det?.photosOfWhereWantToInstall,
        ),
        photosOfCurrentLightFixture: resolveArr(
          d?.photosOfCurrentLightFixture,
          det?.photosOfCurrentLightFixture,
        ),
        photosOfNewLightFixture: resolveArr(
          d?.photosOfNewLightFixture,
          det?.photosOfNewLightFixture,
        ),
        floodInstallHeight: resolve(
          d?.floodInstallHeight,
          det?.floodInstallHeight,
        ),
        floodProviding: resolve(d?.floodProviding, det?.floodProviding),
        floodDetails: resolve(d?.floodDetails, det?.floodDetails),
        floodPowerControl: resolve(
          d?.floodPowerControl,
          det?.floodPowerControl,
        ),
        floodUpgradeSwitch: resolve(
          d?.floodUpgradeSwitch,
          det?.floodUpgradeSwitch,
        ),
        floodSwitchKind: resolve(d?.floodSwitchKind, det?.floodSwitchKind),
        floodSwitchOtherText: resolve(
          d?.floodSwitchOtherText,
          det?.floodSwitchOtherText,
        ),
        floodMultiSwitch: resolve(d?.floodMultiSwitch, det?.floodMultiSwitch),
        photosOfInstallationAreaFloodLight: resolveArr(
          d?.photosOfInstallationAreaFloodLight,
          det?.photosOfInstallationAreaFloodLight,
        ),
        photosOfCurrentFloodLight: resolveArr(
          d?.photosOfCurrentFloodLight,
          det?.photosOfCurrentFloodLight,
        ),
        photosOfNewFloodLight: resolveArr(
          d?.photosOfNewFloodLight,
          det?.photosOfNewFloodLight,
        ),
        wallSurface: resolve(d?.wallSurface, det?.wallSurface),
        wallProviding: resolve(d?.wallProviding, det?.wallProviding),
        wallNewLightDetails: resolve(
          d?.wallNewLightDetails,
          det?.wallNewLightDetails,
        ),
        wallUpgradeSwitch: resolve(
          d?.wallUpgradeSwitch,
          det?.wallUpgradeSwitch,
        ),
        wallSwitchKind: resolve(d?.wallSwitchKind, det?.wallSwitchKind),
        wallMultiSwitch: resolve(d?.wallMultiSwitch, det?.wallMultiSwitch),
        drivewayProviding: resolve(
          d?.drivewayProviding,
          det?.drivewayProviding,
        ),
        drivewayNewLightDetails: resolve(
          d?.drivewayNewLightDetails,
          det?.drivewayNewLightDetails,
        ),
        drivewayDistance: resolve(d?.drivewayDistance, det?.drivewayDistance),
        drivewayPowerControl: resolve(
          d?.drivewayPowerControl,
          det?.drivewayPowerControl,
        ),
        drivewayUpgradeSwitch: resolve(
          d?.drivewayUpgradeSwitch,
          det?.drivewayUpgradeSwitch,
        ),
        drivewaySwitchKind: resolve(
          d?.drivewaySwitchKind,
          det?.drivewaySwitchKind,
        ),
        drivewaySwitchOtherText: resolve(
          d?.drivewaySwitchOtherText,
          det?.drivewaySwitchOtherText,
        ),
        drivewayMultiSwitch: resolve(
          d?.drivewayMultiSwitch,
          det?.drivewayMultiSwitch,
        ),
        poleProviding: resolve(d?.poleProviding, det?.poleProviding),
        poleLightDetails: resolve(d?.poleLightDetails, det?.poleLightDetails),
        poleDistance: resolve(d?.poleDistance, det?.poleDistance),
        polePowerControl: resolve(d?.polePowerControl, det?.polePowerControl),
        poleUpgradeSwitch: resolve(
          d?.poleUpgradeSwitch,
          det?.poleUpgradeSwitch,
        ),
        poleSwitchKind: resolve(d?.poleSwitchKind, det?.poleSwitchKind),
        poleSwitchOtherText: resolve(
          d?.poleSwitchOtherText,
          det?.poleSwitchOtherText,
        ),
        poleMultiSwitch: resolve(d?.poleMultiSwitch, det?.poleMultiSwitch),
        landscapeVoltage: resolve(d?.landscapeVoltage, det?.landscapeVoltage),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalInformation,
        ),
      };

    case "Ceiling Fan":
    case "Ceiling Fan Installation":
      return {
        ...common,
        installationType: resolve(d?.installationType, det?.installationType),
        photosOfCurrentCeilingFan: resolveArr(
          d?.photosOfCurrentCeilingFan,
          det?.photosOfCurrentCeilingFan,
        ),
        aboveBelowAreaOfCeilingFan: resolve(
          d?.aboveBelowAreaOfCeilingFan,
          det?.aboveBelowAreaOfCeilingFan,
        ),
        isThereCurrentLightFixture: resolveBool(
          d?.isThereCurrentLightFixture,
          det?.isThereCurrentLightFixture === "Yes",
        ),
        wasAreaPrewired: resolve(d?.wasAreaPrewired, det?.wasAreaPrewired),
        willProvideNewCeilingFan: resolveBool(
          d?.willProvideNewCeilingFan,
          det?.willProvideNewCeilingFan === "Yes",
        ),
        photosOfNewCeilingFan: resolveArr(
          d?.photosOfNewCeilingFan,
          det?.photosOfNewCeilingFan,
        ),
        describeFanWantInstalled: resolve(
          d?.describeFanWantInstalled,
          det?.describeFanWantInstalled,
        ),
        tallOfCeilingFanFromFloor: resolve(
          d?.tallOfCeilingFanFromFloor,
          det?.tallOfCeilingFanFromFloor,
        ),
        willConnectNewOrExistingSwitch: resolve(
          d?.willConnectNewOrExistingSwitch,
          det?.willConnectNewOrExistingSwitch,
        ),
        wantUpgradeSwitch: resolveBool(
          d?.wantUpgradeSwitch,
          det?.wantUpgradeSwitch === "Yes",
        ),
        kindOfSwitchWant: resolve(d?.kindOfSwitchWant, det?.kindOfSwitchWant),
        additionalInformation: resolve(
          d?.additionalInformation,
          det?.additionalInformation,
        ),
      };

    default:
      return { ...common };
  }
};
