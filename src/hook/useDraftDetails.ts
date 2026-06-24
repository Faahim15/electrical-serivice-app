import {
  useGetEvChargerInstallationByIdQuery,
  useGetServiceCallByIdQuery,
} from "@/src/redux/api-slices/quote/quote-api";
import { useGetAccessoryBuildingByIdQuery } from "../redux/api-slices/quote/accessory-building-api";
import { useGetDedicatedCircuitByIdQuery } from "../redux/api-slices/quote/dedicatedCircuitApi";
import { useGetDockPowerByIdQuery } from "../redux/api-slices/quote/dockPowerApi";
import { useGetElectricByIdQuery } from "../redux/api-slices/quote/electricApi";
import { useGetGeneratorByIdQuery } from "../redux/api-slices/quote/generatorApi";
import { useGetHomeSurgeProtectionByIdQuery } from "../redux/api-slices/quote/homeSurgeProtectionApi";
import { useGetHotTubByIdQuery } from "../redux/api-slices/quote/hotTubApi";
import { useGetNewConstructionByIdQuery } from "../redux/api-slices/quote/newConstructionApi";
import { useGetPanelUpgradeByIdQuery } from "../redux/api-slices/quote/quote-api-two";
import { useGetRemodelingByIdQuery } from "../redux/api-slices/quote/remodeling-api";
import { useGetStarlinkByIdQuery } from "../redux/api-slices/quote/starLinkApi";

import { useGetCeilingFanByIdQuery } from "../redux/api-slices/quote/ceiling-fan-api";
import { useGetExhaustFanByIdQuery } from "../redux/api-slices/quote/exhaust-fan-api";
import { useGetLightingByIdQuery } from "../redux/api-slices/quote/lighting-api";
import { useGetOutletByIdQuery } from "../redux/api-slices/quote/outlet-api";
import { useGetSwitchesByIdQuery } from "../redux/api-slices/quote/switches-api";

import { EvChargerInstallationResponse } from "@/src/types/evCharger.api.types";
import { ServiceCallResponse } from "@/src/types/quotes.api.types";
import { AccessoryBuildingRecord } from "@/src/types/quotes/accessory-building.api.types";
import { DedicatedCircuitRecord } from "@/src/types/quotes/dedicated-circuit.api.types";
import { DockPowerRecord } from "@/src/types/quotes/dock-power.api.types";
import { ElectricRecord } from "@/src/types/quotes/electric.api.types";
import { GeneratorRecord } from "@/src/types/quotes/generator.api.types";
import { HomeSurgeProtectionRecord } from "@/src/types/quotes/home-surge-protection.api.types";
import { HotTubRecord } from "@/src/types/quotes/hot-tub.api.types";
import { NewConstructionRecord } from "@/src/types/quotes/new-construction.api.types";
import { PanelUpgradeRecord } from "@/src/types/quotes/panel.upgrader.api.types";
import { RemodelingRecord } from "@/src/types/quotes/remodeling.api.types";
import { StarlinkRecord } from "@/src/types/quotes/starlink.api.types";

// ─── New Type Imports ─────────────────────────────────────────────────────────
import { CeilingFanRecord } from "@/src/types/quotes/ceiling-fan.api.types";
import { ExhaustFanRecord } from "@/src/types/quotes/exhaust-fan.api.types";
import { LightingRecord } from "@/src/types/quotes/lighting.api.types";
import { OutletRecord } from "@/src/types/quotes/outlet.api.types";
import { SwitchesRecord } from "@/src/types/quotes/switches.api.types";

export type DraftResponse =
  | ServiceCallResponse
  | EvChargerInstallationResponse
  | PanelUpgradeRecord
  | RemodelingRecord
  | AccessoryBuildingRecord
  | HotTubRecord
  | DockPowerRecord
  | ElectricRecord
  | GeneratorRecord
  | NewConstructionRecord
  | HomeSurgeProtectionRecord
  | StarlinkRecord
  | DedicatedCircuitRecord
  | ExhaustFanRecord
  | OutletRecord
  | SwitchesRecord
  | LightingRecord
  | CeilingFanRecord;

export const useDraftDetails = (id?: string, serviceType?: string) => {
  const isServiceCall = !id || serviceType === "Service Call" || !serviceType;
  const isEvCharger = !!id && serviceType === "EV Charger Installation";
  const isPanelUpgrade =
    !!id &&
    (serviceType === "Panel Upgrade / Replacement" ||
      serviceType === "Panel Upgrade/Replacement");
  const isRemodeling = !!id && serviceType === "Remodeling";
  const isAccessoryBuilding =
    !!id && serviceType === "Accessory Building / Shed Power";
  const isHotTub = !!id && serviceType === "Hot tub Installation";
  const isDockPower = !!id && serviceType === "Dock Power";
  const isElectric = !!id && serviceType === "Electric System";
  const isGenerator = !!id && serviceType === "Generator Installation";
  const isNewConstruction = !!id && serviceType === "New Construction";
  const isHomeSurgeProtection = !!id && serviceType === "Home Surge Protection";
  const isStarlink = !!id && serviceType === "Starlink Installation";
  const isDedicatedCircuit =
    !!id && serviceType === "Dedicated Circuit Installation";

  // ─── New Flags ──────────────────────────────────────────────────────────────
  const isExhaustFan =
    !!id &&
    (serviceType === "Exhaust Fan" ||
      serviceType === "Exhaust Fan Installation");
  const isOutlets =
    !!id &&
    (serviceType === "Outlets" ||
      serviceType === "Outlets Installation" ||
      serviceType === "Outlet Installation");
  const isSwitches =
    !!id &&
    (serviceType === "Switches" || serviceType === "Switches Installation");
  const isLighting =
    !!id &&
    (serviceType === "Lighting" || serviceType === "Lighting Installation");
  const isCeilingFan =
    !!id &&
    (serviceType === "Ceiling Fan" ||
      serviceType === "Ceiling Fan Installation");

  // ─── Queries ─────────────────────────────────────────────────────────────────
  const serviceCallResult = useGetServiceCallByIdQuery(id as string, {
    skip: !id || !isServiceCall,
  });
  const evChargerResult = useGetEvChargerInstallationByIdQuery(id as string, {
    skip: !id || !isEvCharger,
  });
  const panelUpgradeResult = useGetPanelUpgradeByIdQuery(id as string, {
    skip: !id || !isPanelUpgrade,
  });
  const remodelingResult = useGetRemodelingByIdQuery(id as string, {
    skip: !id || !isRemodeling,
  });
  const accessoryBuildingResult = useGetAccessoryBuildingByIdQuery(
    id as string,
    {
      skip: !id || !isAccessoryBuilding,
    },
  );
  const hotTubResult = useGetHotTubByIdQuery(id as string, {
    skip: !id || !isHotTub,
  });
  const dockPowerResult = useGetDockPowerByIdQuery(id as string, {
    skip: !id || !isDockPower,
  });
  const electricResult = useGetElectricByIdQuery(id as string, {
    skip: !id || !isElectric,
  });
  const generatorResult = useGetGeneratorByIdQuery(id as string, {
    skip: !id || !isGenerator,
  });
  const newConstructionResult = useGetNewConstructionByIdQuery(id as string, {
    skip: !id || !isNewConstruction,
  });
  const homeSurgeProtectionResult = useGetHomeSurgeProtectionByIdQuery(
    id as string,
    {
      skip: !id || !isHomeSurgeProtection,
    },
  );
  const starlinkResult = useGetStarlinkByIdQuery(id as string, {
    skip: !id || !isStarlink,
  });
  const dedicatedCircuitResult = useGetDedicatedCircuitByIdQuery(id as string, {
    skip: !id || !isDedicatedCircuit,
  });

  // ─── New Queries ─────────────────────────────────────────────────────────────
  const exhaustFanResult = useGetExhaustFanByIdQuery(id as string, {
    skip: !id || !isExhaustFan,
  });
  const outletsResult = useGetOutletByIdQuery(id as string, {
    skip: !id || !isOutlets,
  });
  const switchesResult = useGetSwitchesByIdQuery(id as string, {
    skip: !id || !isSwitches,
  });
  const lightingResult = useGetLightingByIdQuery(id as string, {
    skip: !id || !isLighting,
  });
  const ceilingFanResult = useGetCeilingFanByIdQuery(id as string, {
    skip: !id || !isCeilingFan,
  });

  // ─── Return matching result ───────────────────────────────────────────────────
  if (isEvCharger) {
    return {
      data: evChargerResult.data?.data as
        | EvChargerInstallationResponse
        | undefined,
      isLoading: evChargerResult.isLoading,
    };
  }
  if (isPanelUpgrade) {
    return {
      data: panelUpgradeResult.data?.data as PanelUpgradeRecord | undefined,
      isLoading: panelUpgradeResult.isLoading,
    };
  }
  if (isRemodeling) {
    return {
      data: remodelingResult.data?.data as RemodelingRecord | undefined,
      isLoading: remodelingResult.isLoading,
    };
  }
  if (isAccessoryBuilding) {
    return {
      data: accessoryBuildingResult.data?.data as
        | AccessoryBuildingRecord
        | undefined,
      isLoading: accessoryBuildingResult.isLoading,
    };
  }
  if (isHotTub) {
    return {
      data: hotTubResult.data?.data as HotTubRecord | undefined,
      isLoading: hotTubResult.isLoading,
    };
  }
  if (isDockPower) {
    return {
      data: dockPowerResult.data?.data as DockPowerRecord | undefined,
      isLoading: dockPowerResult.isLoading,
    };
  }
  if (isElectric) {
    return {
      data: electricResult.data?.data as ElectricRecord | undefined,
      isLoading: electricResult.isLoading,
    };
  }
  if (isGenerator) {
    return {
      data: generatorResult.data?.data as GeneratorRecord | undefined,
      isLoading: generatorResult.isLoading,
    };
  }
  if (isNewConstruction) {
    return {
      data: newConstructionResult.data?.data as
        | NewConstructionRecord
        | undefined,
      isLoading: newConstructionResult.isLoading,
    };
  }
  if (isHomeSurgeProtection) {
    return {
      data: homeSurgeProtectionResult.data?.data as
        | HomeSurgeProtectionRecord
        | undefined,
      isLoading: homeSurgeProtectionResult.isLoading,
    };
  }
  if (isStarlink) {
    return {
      data: starlinkResult.data?.data as StarlinkRecord | undefined,
      isLoading: starlinkResult.isLoading,
    };
  }
  if (isDedicatedCircuit) {
    return {
      data: dedicatedCircuitResult.data?.data as
        | DedicatedCircuitRecord
        | undefined,
      isLoading: dedicatedCircuitResult.isLoading,
    };
  }

  // ─── New Returns ─────────────────────────────────────────────────────────────
  if (isExhaustFan) {
    return {
      data: exhaustFanResult.data?.data as ExhaustFanRecord | undefined,
      isLoading: exhaustFanResult.isLoading,
    };
  }
  if (isOutlets) {
    return {
      data: outletsResult.data?.data as OutletRecord | undefined,
      isLoading: outletsResult.isLoading,
    };
  }
  if (isSwitches) {
    return {
      data: switchesResult.data?.data as SwitchesRecord | undefined,
      isLoading: switchesResult.isLoading,
    };
  }
  if (isLighting) {
    return {
      data: lightingResult.data?.data as LightingRecord | undefined,
      isLoading: lightingResult.isLoading,
    };
  }
  if (isCeilingFan) {
    return {
      data: ceilingFanResult.data?.data as CeilingFanRecord | undefined,
      isLoading: ceilingFanResult.isLoading,
    };
  }

  // ─── Default: Service Call ───────────────────────────────────────────────────
  return {
    data: serviceCallResult.data?.data as ServiceCallResponse | undefined,
    isLoading: serviceCallResult.isLoading,
  };
};
