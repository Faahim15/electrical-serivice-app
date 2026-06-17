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

  // ─── TODO: add per-serviceType branches for ───────────────────────────────────
  // Accessory Building Power, Hot Tub, Dock Power,
  // Electric System, Generator, New Construction, Home Surge Protection,
  // Starlink Installation, Dedicated Circuit Installation
  // once their step routes are confirmed.

  return "/(tabs)/quotes/quote/common/project-basics";
};
