export const getResumeRoute = (
  serviceType: string,
  completionPercentage: number = 0,
): string => {
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

  // Common steps — shared across all service types
  if (completionPercentage <= 13)
    return "/(tabs)/quotes/quote/common/contact-details";
  if (completionPercentage <= 25)
    return "/(tabs)/quotes/quote/common/service-address";
  if (completionPercentage <= 38)
    return "/(tabs)/quotes/quote/common/project-basics";

  // Service-Call specific steps
  if (serviceType === "Service Call") {
    if (completionPercentage <= 50)
      return "/(tabs)/quotes/quote/service-call/project-details";
    if (completionPercentage <= 63)
      return "/(tabs)/quotes/quote/service-call/final-projectQ";
    if (completionPercentage <= 75)
      return "/(tabs)/quotes/quote/service-call/upload-photos";
    if (completionPercentage <= 88)
      return "/(tabs)/quotes/quote/service-call/additional-notes";
  }

  // TODO: add per-serviceType branches for
  // Panel Upgrade/Replacement, Remodeling, Accessory Building Power
  // once their step routes are confirmed.

  return "/(tabs)/quotes/quote/service-call/additional-notes";
};
