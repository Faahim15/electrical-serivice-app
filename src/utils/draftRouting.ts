export const getResumeRoute = (
  serviceType: string,
  completionPercentage: number = 0,
): string => {
  // ─── EV Charger Installation ─────────────────────────────────────────────────
  if (serviceType === "EV Charger Installation") {
    if (completionPercentage <= 11)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 22)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 38)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 44)
      return "/(tabs)/quotes/quote/ev-charger/ev-projectDetails";
    if (completionPercentage <= 56)
      return "/(tabs)/quotes/quote/ev-charger/installation-location";
    if (completionPercentage <= 67)
      return "/(tabs)/quotes/quote/ev-charger/panel-location";
    if (completionPercentage <= 78)
      return "/(tabs)/quotes/quote/ev-charger/photos-needed";
    if (completionPercentage <= 89)
      return "/(tabs)/quotes/quote/ev-charger/additional-info";

    return "/(tabs)/quotes/quote/ev-charger/additional-info";
  }

  // ─── Panel Upgrade / Replacement ─────────────────────────────────────────────
  if (
    serviceType === "Panel Upgrade / Replacement" ||
    serviceType === "Panel Upgrade/Replacement"
  ) {
    if (completionPercentage <= 11)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 22)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 33)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 44)
      return "/(tabs)/quotes/quote/panel-upgrade/service-type";
    if (completionPercentage <= 56)
      return "/(tabs)/quotes/quote/panel-upgrade/current-panel-details";
    if (completionPercentage <= 67)
      return "/(tabs)/quotes/quote/panel-upgrade/panel-location";
    if (completionPercentage <= 78)
      return "/(tabs)/quotes/quote/panel-upgrade/upload-photos";
    if (completionPercentage <= 89)
      return "/(tabs)/quotes/quote/panel-upgrade/additional-info";

    return "/(tabs)/quotes/quote/panel-upgrade/additional-info";
  }

  // ─── Remodeling ──────────────────────────────────────────────────────────────
  if (serviceType === "Remodeling" || serviceType === "Remodelling") {
    if (completionPercentage <= 11)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 22)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 33)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 44)
      return "/(tabs)/quotes/quote/remodeling/project-basics";
    if (completionPercentage <= 56)
      return "/(tabs)/quotes/quote/remodeling/plans-electrical";
    if (completionPercentage <= 67)
      return "/(tabs)/quotes/quote/remodeling/permit-info";
    if (completionPercentage <= 78)
      return "/(tabs)/quotes/quote/remodeling/upload-photos";
    if (completionPercentage <= 89)
      return "/(tabs)/quotes/quote/remodeling/additional-info";

    return "/(tabs)/quotes/quote/remodeling/additional-info";
  }

  // ─── Accessory Building / Shed Power ────────────────────────────────────────
  if (serviceType === "Accessory Building / Shed Power") {
    if (completionPercentage <= 11)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 22)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 33)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 44)
      return "/(tabs)/quotes/quote/accessory-building/building-basics";
    if (completionPercentage <= 56)
      return "/(tabs)/quotes/quote/accessory-building/construction-details";
    if (completionPercentage <= 67)
      return "/(tabs)/quotes/quote/accessory-building/electrical-needs";
    if (completionPercentage <= 78)
      return "/(tabs)/quotes/quote/accessory-building/service-type";
    if (completionPercentage <= 89)
      return "/(tabs)/quotes/quote/accessory-building/route-details";

    return "/(tabs)/quotes/quote/accessory-building/route-details";
  }

  // ─── Hot Tub Installation ────────────────────────────────────────────────────
  if (serviceType === "Hot tub installation") {
    if (completionPercentage <= 11)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 22)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 33)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 44)
      return "/(tabs)/quotes/quote/hot-tub/hot-tub-info";
    if (completionPercentage <= 56)
      return "/(tabs)/quotes/quote/hot-tub/electrical-requirements";
    if (completionPercentage <= 67)
      return "/(tabs)/quotes/quote/hot-tub/location-details";
    if (completionPercentage <= 78)
      return "/(tabs)/quotes/quote/hot-tub/photos-needed";
    if (completionPercentage <= 89)
      return "/(tabs)/quotes/quote/hot-tub/additional-info";

    return "/(tabs)/quotes/quote/hot-tub/additional-info";
  }

  // ─── Dock Power ──────────────────────────────────────────────────────────────
  if (serviceType === "Dock Power") {
    if (completionPercentage <= 10)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 20)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 30)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 40)
      return "/(tabs)/quotes/quote/dock-power/dock-basics";
    if (completionPercentage <= 50)
      return "/(tabs)/quotes/quote/dock-power/power-requirements";
    if (completionPercentage <= 60)
      return "/(tabs)/quotes/quote/dock-power/route-details";
    if (completionPercentage <= 70)
      return "/(tabs)/quotes/quote/dock-power/plans-permit";
    if (completionPercentage <= 80)
      return "/(tabs)/quotes/quote/dock-power/photos-needed";
    if (completionPercentage <= 90)
      return "/(tabs)/quotes/quote/dock-power/addtional-info";

    return "/(tabs)/quotes/quote/dock-power/addtional-info";
  }

  // ─── Electrical Systems Inspection ──────────────────────────────────────────
  if (
    serviceType === "Electrical Systems Inspection" ||
    serviceType === "Electrical Systems inspection" ||
    serviceType === "Electrical Inspection"
  ) {
    if (completionPercentage <= 17)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 33)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 50)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 67)
      return "/(tabs)/quotes/quote/electrical-inspection/inspection-type";
    if (completionPercentage <= 83)
      return "/(tabs)/quotes/quote/electrical-inspection/additional-info";

    return "/(tabs)/quotes/quote/electrical-inspection/additional-info";
  }

  // ─── Generator Installation ──────────────────────────────────────────────────
  if (serviceType === "Generator Installation") {
    if (completionPercentage <= 14)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 29)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 43)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 57)
      return "/(tabs)/quotes/quote/generator/generator-type";
    if (completionPercentage <= 71)
      return "/(tabs)/quotes/quote/generator/generator-ownership";
    if (completionPercentage <= 86)
      return "/(tabs)/quotes/quote/generator/backup-needs";
    if (completionPercentage <= 100)
      return "/(tabs)/quotes/quote/generator/photos-needed";

    return "/(tabs)/quotes/quote/generator/photos-needed";
  }

  // ─── New Construction ────────────────────────────────────────────────────────
  if (serviceType === "New Construction") {
    if (completionPercentage <= 20)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 40)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 60)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 80)
      return "/(tabs)/quotes/quote/new-construction/project-status";

    return "/(tabs)/quotes/quote/new-construction/project-status";
  }

  // ─── Home Surge Protection ───────────────────────────────────────────────────
  if (serviceType === "Home Surge Protection") {
    if (completionPercentage <= 20)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 40)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 60)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 80)
      return "/(tabs)/quotes/quote/surge-protection/surge-details";

    return "/(tabs)/quotes/quote/surge-protection/surge-details";
  }

  // ─── Starlink Installation ───────────────────────────────────────────────────
  if (serviceType === "Starlink Installation") {
    if (completionPercentage <= 20)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 40)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 60)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 80)
      return "/(tabs)/quotes/quote/starlink/starlink-details";

    return "/(tabs)/quotes/quote/starlink/starlink-details";
  }

  // ─── Dedicated Circuit Installation ──────────────────────────────────────────
  if (serviceType === "Dedicated Circuit Installation") {
    if (completionPercentage <= 20)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 40)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 60)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 80)
      return "/(tabs)/quotes/quote/dedicated-circuit/circuit-details";

    return "/(tabs)/quotes/quote/dedicated-circuit/circuit-details";
  }

  // ─── Electric System ─────────────────────────────────────────────────────────
  if (serviceType === "Electric System") {
    if (completionPercentage <= 20)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 40)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 60)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 80)
      return "/(tabs)/quotes/quote/electric-system/system-details";

    return "/(tabs)/quotes/quote/electric-system/system-details";
  }

  // ─── Common steps — shared across all service types ───────────────────────────
  if (completionPercentage <= 13)
    return "/(tabs)/quotes/quote/common/contact-details";
  if (completionPercentage <= 25)
    return "/(tabs)/quotes/quote/common/service-address";
  if (completionPercentage <= 38)
    return "/(tabs)/quotes/quote/common/project-basics";

  // ─── Service Call ─────────────────────────────────────────────────────────────
  if (serviceType === "Service Call") {
    if (completionPercentage <= 50)
      return "/(tabs)/quotes/quote/service-call/project-details";
    if (completionPercentage <= 63)
      return "/(tabs)/quotes/quote/service-call/final-projectQ";
    if (completionPercentage <= 75)
      return "/(tabs)/quotes/quote/service-call/upload-photos";
    if (completionPercentage <= 88)
      return "/(tabs)/quotes/quote/service-call/additional-notes";

    return "/(tabs)/quotes/quote/service-call/additional-notes";
  }

  // ─── Starlink Installation ───────────────────────────────────────────────────
  if (serviceType === "Starlink Installation") {
    if (completionPercentage <= 14)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 29)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 43)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 57)
      return "/(tabs)/quotes/quote/starlink/starlink-details";
    if (completionPercentage <= 71)
      return "/(tabs)/quotes/quote/starlink/starlink-location";
    if (completionPercentage <= 86)
      return "/(tabs)/quotes/quote/starlink/starlink-router";
    if (completionPercentage <= 100)
      return "/(tabs)/quotes/quote/starlink/starlink-additional";

    return "/(tabs)/quotes/quote/starlink/starlink-additional";
  }

  // ─── Dedicated Circuit ──────────────────────────────────────────────────────
  if (serviceType === "Dedicated Circuit") {
    if (completionPercentage <= 12)
      return "/(tabs)/quotes/quote/common/contact-details";
    if (completionPercentage <= 25)
      return "/(tabs)/quotes/quote/common/service-address";
    if (completionPercentage <= 37)
      return "/(tabs)/quotes/quote/common/project-basics";
    if (completionPercentage <= 50)
      return "/(tabs)/quotes/quote/dedicated-circuit/circuit-details";
    if (completionPercentage <= 62)
      return "/(tabs)/quotes/quote/dedicated-circuit/circuit-location";
    if (completionPercentage <= 75)
      return "/(tabs)/quotes/quote/dedicated-circuit/circuit-specs";
    if (completionPercentage <= 87)
      return "/(tabs)/quotes/quote/dedicated-circuit/circuit-photos";
    if (completionPercentage <= 100)
      return "/(tabs)/quotes/quote/dedicated-circuit/circuit-additional";

    return "/(tabs)/quotes/quote/dedicated-circuit/circuit-additional";
  }

  return "/(tabs)/quotes/quote/common/project-basics";
};
