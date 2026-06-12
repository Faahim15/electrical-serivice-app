export const getResumeRoute = (
  serviceType: string,
  completionPercentage: number = 0,
): string => {
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

  // TODO: add per-serviceType branches for EV Charger Installation,
  // Panel Upgrade/Replacement, Remodeling, Accessory Building Power
  // once their step routes are confirmed.

  return "/(tabs)/quotes/quote/service-call/additional-notes";
};
