import ServiceDetailPage from "@/src/components/shared/ServiceDetailPage";
import { RootState } from "@/src/redux/store";
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

const SERVICE_DETAIL_DATA: Record<
  string,
  {
    subtitle: string;
    bestForItems: { id: string; text: string }[];
    provideItems: { id: string; text: string }[];
    estimatedTime: string;
    estimatedTimeSubtitle: string;
    steps: { id: string; step: number; label: string }[];
  }
> = {
  "1": {
    subtitle:
      "Fast response for electrical repairs, troubleshooting, and emergency fixes.",
    bestForItems: [
      { id: "1", text: "Electrical issues or outages" },
      { id: "2", text: "Circuit breaker problems" },
      { id: "3", text: "Outlet or switch repairs" },
      { id: "4", text: "Safety inspections" },
    ],
    provideItems: [
      { id: "1", text: "Description of the issue" },
      { id: "2", text: "Photos of the problem area" },
      { id: "3", text: "Property access details" },
    ],
    estimatedTime: "Takes about 2–3 minutes",
    estimatedTimeSubtitle: "Quick and easy process",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Project information" },
      { id: "3", step: 3, label: "Photo upload" },
      { id: "4", step: 4, label: "Review & submit" },
    ],
  },
  "2": {
    subtitle:
      "Professional EV charger installation with safe wiring and code compliance. We are a Certified Tesla Installer and are partnered with Qmerit! We install all Electric Vehicle charging configurations, including bi-directional chargers for GM and Tesla",
    bestForItems: [
      { id: "1", text: "New EV charger setup" },
      { id: "2", text: "Hardwired charger installation" },
      { id: "3", text: "Plug-in charger installation" },
      { id: "4", text: "Help choosing the right charger setup" },
    ],
    provideItems: [
      { id: "1", text: "Charger type preference" },
      { id: "2", text: "Panel location details" },
      { id: "3", text: "Installation location photos" },
    ],
    estimatedTime: "Takes about 3–5 minutes",
    estimatedTimeSubtitle: "Best for complete installation quotes",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Charger & location info" },
      { id: "3", step: 3, label: "Photo upload" },
      { id: "4", step: 4, label: "Review & submit" },
    ],
  },
  "3": {
    subtitle:
      "Request a quote for replacing or upgrading your electrical panel safely.",
    bestForItems: [
      { id: "1", text: "Outdated electrical panels" },
      { id: "2", text: "Increasing service capacity" },
      { id: "3", text: "Replacing damaged panels" },
      { id: "4", text: "Preparing for home electrical upgrades" },
    ],
    provideItems: [
      { id: "1", text: "Current panel amperage" },
      { id: "2", text: "Upgrade goal if applicable" },
      { id: "3", text: "Meter photos" },
      { id: "4", text: "Panel photos" },
    ],
    estimatedTime: "Takes about 3–4 minutes",
    estimatedTimeSubtitle: "Helpful for upgrade planning",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Service type" },
      { id: "3", step: 3, label: "Panel details" },
      { id: "4", step: 4, label: "Property electrical information" },
      { id: "5", step: 5, label: "Review & submit" },
    ],
  },
  "4": {
    subtitle:
      "Share your remodeling project and electrical needs for a customized quote.",
    bestForItems: [
      { id: "1", text: "Kitchen remodels" },
      { id: "2", text: "Bathroom remodels" },
      { id: "3", text: "Room renovations" },
      { id: "4", text: "Electrical updates during remodeling" },
    ],
    provideItems: [
      { id: "1", text: "Remodel area details" },
      { id: "2", text: "Electrical needs list" },
      { id: "3", text: "Plans or drawings if available" },
      { id: "4", text: "Existing space photo" },
    ],
    estimatedTime: "Takes about 3–5 minutes",
    estimatedTimeSubtitle: "Great for planned renovation projects",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Remodel basics" },
      { id: "3", step: 3, label: "Electrical needs" },
      { id: "4", step: 4, label: "Plans & permit details" },
      { id: "5", step: 5, label: "Review & submit" },
    ],
  },
  "5": {
    subtitle:
      "Get a quote for adding electrical power to a shed, workshop, barn, or similar structure.",
    bestForItems: [
      { id: "1", text: "Sheds and outbuildings" },
      { id: "2", text: "Workshops and garages" },
      { id: "3", text: "Pole barns" },
      { id: "4", text: "New circuits, sub-panels, or service installs" },
    ],
    provideItems: [
      { id: "1", text: "Building size and use" },
      { id: "2", text: "Construction details" },
      { id: "3", text: "Route from house to building" },
      { id: "4", text: "Meter and panel photos" },
    ],
    estimatedTime: "Takes about 4–6 minutes",
    estimatedTimeSubtitle: "Best for detached structure power planning",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Building basics" },
      { id: "3", step: 3, label: "Electrical needs" },
      { id: "4", step: 4, label: "Power type selection" },
      { id: "5", step: 5, label: "Route & utility information" },
      { id: "6", step: 6, label: "Review & submit" },
    ],
  },
  "6": {
    subtitle:
      "Request a quote for safe and code-compliant hot tub electrical installation.",
    bestForItems: [
      { id: "1", text: "New hot tub hookups" },
      { id: "2", text: "Disconnect or receptacle setup" },
      { id: "3", text: "Outdoor spa power planning" },
      { id: "4", text: "Dedicated hot tub circuits" },
    ],
    provideItems: [
      { id: "1", text: "Hot tub model details" },
      { id: "2", text: "Manual if available" },
      { id: "3", text: "Install location photo" },
      { id: "4", text: "Panel photo and distance estimate" },
    ],
    estimatedTime: "Takes about 3–4 minutes",
    estimatedTimeSubtitle: "Helpful for fast installation planning",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Hot tub details" },
      { id: "3", step: 3, label: "Electrical needs" },
      { id: "4", step: 4, label: "Location & panel information" },
      { id: "5", step: 5, label: "Review & submit" },
    ],
  },
  "7": {
    subtitle:
      "Get a quote for electrical service to your dock, including lifts, receptacles, and lighting.",
    bestForItems: [
      { id: "1", text: "Boat lift power" },
      { id: "2", text: "Jet ski lift power" },
      { id: "3", text: "Dock lighting" },
      { id: "4", text: "Dock receptacles and circuits" },
    ],
    provideItems: [
      { id: "1", text: "Dock electrical needs" },
      { id: "2", text: "Receptacle count" },
      { id: "3", text: "Route from house to dock" },
      { id: "4", text: "Meter and panel photos" },
    ],
    estimatedTime: "Takes about 4–6 minutes",
    estimatedTimeSubtitle: "Best for detailed dock power requests",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Dock details" },
      { id: "3", step: 3, label: "Power requirements" },
      { id: "4", step: 4, label: "Panel & route information" },
      { id: "5", step: 5, label: "Permit details" },
      { id: "6", step: 6, label: "Review & submit" },
    ],
  },
  "8": {
    subtitle:
      "Request an inspection quote for your home, building, or electrical service.",
    bestForItems: [
      { id: "1", text: "Whole house inspections" },
      { id: "2", text: "Partial home inspections" },
      { id: "3", text: "Accessory building inspections" },
      { id: "4", text: "Electrical service-only inspections" },
    ],
    provideItems: [
      { id: "1", text: "Inspection type" },
      { id: "2", text: "Building size or panel count" },
      { id: "3", text: "Panel photos if needed" },
      { id: "4", text: "Additional concerns" },
    ],
    estimatedTime: "Takes about 2–3 minutes",
    estimatedTimeSubtitle: "Simple inspection request process",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Inspection type" },
      { id: "3", step: 3, label: "Property details" },
      { id: "4", step: 4, label: "Review & submit" },
    ],
  },
  "9": {
    subtitle:
      "Get a quote for portable or whole-home backup generator installation.",
    bestForItems: [
      { id: "1", text: "Portable generator hookups" },
      { id: "2", text: "Generator inlet setup" },
      { id: "3", text: "Backup panel solutions" },
      { id: "4", text: "Whole-home standby planning" },
    ],
    provideItems: [
      { id: "1", text: "Generator type" },
      { id: "2", text: "Backup preference" },
      { id: "3", text: "Inlet or install location photo" },
      { id: "4", text: "Panel and meter photos" },
    ],
    estimatedTime: "Takes about 4–5 minutes",
    estimatedTimeSubtitle: "Choose portable or standby options",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Generator type" },
      { id: "3", step: 3, label: "Equipment details" },
      { id: "4", step: 4, label: "Backup setup" },
      { id: "5", step: 5, label: "Upload photos" },
      { id: "6", step: 6, label: "Review & submit" },
    ],
  },
  "10": {
    subtitle:
      "Start a quote for electrical work on a new construction project.",
    bestForItems: [
      { id: "1", text: "New homes" },
      { id: "2", text: "New additions" },
      { id: "3", text: "New building electrical planning" },
      { id: "4", text: "Early-stage project estimates" },
    ],
    provideItems: [
      { id: "1", text: "Project stage" },
      { id: "2", text: "Building plans if available" },
      { id: "3", text: "Basic construction status" },
    ],
    estimatedTime: "Takes about 2–3 minutes",
    estimatedTimeSubtitle: "Quick start for new build projects",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Project status" },
      { id: "3", step: 3, label: "Upload plans" },
      { id: "4", step: 4, label: "Review & submit" },
    ],
  },

  // ─── Whole Home Surge Protection (id: 12) ──────────────────────────────────
  "11": {
    subtitle:
      "Protect your home from damaging power surges with whole-home surge protection.",
    bestForItems: [
      { id: "1", text: "Whole-home surge devices" },
      { id: "2", text: "Panel-based surge protection" },
      { id: "3", text: "Extra protection for electronics and appliances" },
    ],
    provideItems: [
      { id: "1", text: "Panel photos" },
      { id: "2", text: "Basic project notes" },
    ],
    estimatedTime: "Takes about 1–2 minutes",
    estimatedTimeSubtitle: "Simple and quick protection request",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Upload panel photos" },
      { id: "3", step: 3, label: "Add notes" },
      { id: "4", step: 4, label: "Review & submit" },
    ],
  },

  // ─── Starlink Installation (id: 13) ────────────────────────────────────────
  "12": {
    subtitle:
      "Get help planning electrical setup and installation support for your Starlink equipment.",
    bestForItems: [
      { id: "1", text: "Starlink dish setup" },
      { id: "2", text: "Router placement planning" },
      { id: "3", text: "Mounting preparation" },
      { id: "4", text: "Room and route planning" },
    ],
    provideItems: [
      { id: "1", text: "Equipment availability" },
      { id: "2", text: "Dish install location" },
      { id: "3", text: "Router room details" },
      { id: "4", text: "Room and mounting photos" },
    ],
    estimatedTime: "Takes about 3–4 minutes",
    estimatedTimeSubtitle: "Helpful for install preparation",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Equipment details" },
      { id: "3", step: 3, label: "Dish location" },
      { id: "4", step: 4, label: "Router room info" },
      { id: "5", step: 5, label: "Review & submit" },
    ],
  },

  // ─── Dedicated Circuit (id: 14) ────────────────────────────────────────────
  "13": {
    subtitle:
      "Request a dedicated circuit quote for equipment, appliances, or specialty power needs.",
    bestForItems: [
      { id: "1", text: "Freezers" },
      { id: "2", text: "RV connections" },
      { id: "3", text: "Tools or equipment" },
      { id: "4", text: "Special dedicated outlets or loads" },
    ],
    provideItems: [
      { id: "1", text: "Intended use" },
      { id: "2", text: "Install location" },
      { id: "3", text: "Panel location" },
      { id: "4", text: "Path and panel photos" },
    ],
    estimatedTime: "Takes about 3–5 minutes",
    estimatedTimeSubtitle: "Best for custom dedicated circuit requests",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Circuit purpose" },
      { id: "3", step: 3, label: "Install location" },
      { id: "4", step: 4, label: "Electrical specs" },
      { id: "5", step: 5, label: "Review & submit" },
    ],
  },

  // ─── Exhaust Fan (id: 15) ──────────────────────────────────────────────────
  "14": {
    subtitle:
      "Request a quote for attic, kitchen, or bathroom exhaust fan installation or replacement.",
    bestForItems: [
      { id: "1", text: "Bathroom fan replacement" },
      { id: "2", text: "Kitchen exhaust upgrades" },
      { id: "3", text: "Attic ventilation fans" },
      { id: "4", text: "Specialty fan controls" },
    ],
    provideItems: [
      { id: "1", text: "Fan location" },
      { id: "2", text: "New or replacement info" },
      { id: "3", text: "Duct or vent details if known" },
      { id: "4", text: "Panel photo if required" },
    ],
    estimatedTime: "Takes about 3–5 minutes",
    estimatedTimeSubtitle: "Quick fan installation request",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Fan type & location" },
      { id: "3", step: 3, label: "Project details" },
      { id: "4", step: 4, label: "Panel info" },
      { id: "5", step: 5, label: "Review & submit" },
    ],
  },

  // ─── Outlets (id: 16) ──────────────────────────────────────────────────────
  "15": {
    subtitle: "Request a quote for installing or replacing electrical outlets.",
    bestForItems: [
      { id: "1", text: "New outlet installation" },
      { id: "2", text: "Replacing old outlets" },
      { id: "3", text: "Specialty outlet types" },
      { id: "4", text: "GFI or surge-protected outlets" },
    ],
    provideItems: [
      { id: "1", text: "Intended use" },
      { id: "2", text: "New or replacement details" },
      { id: "3", text: "Outlet type" },
      { id: "4", text: "Photos if applicable" },
    ],
    estimatedTime: "Takes about 2–4 minutes",
    estimatedTimeSubtitle: "Simple and flexible outlet request",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Outlet purpose" },
      { id: "3", step: 3, label: "Install type" },
      { id: "4", step: 4, label: "Electrical details" },
      { id: "5", step: 5, label: "Review & submit" },
    ],
  },

  // ─── Switches (id: 17) ─────────────────────────────────────────────────────
  "16": {
    subtitle:
      "Request a quote for installing or replacing switches in your home or project area.",
    bestForItems: [
      { id: "1", text: "New switch installs" },
      { id: "2", text: "Replacing old switches" },
      { id: "3", text: "Smart or dimmer switches" },
      { id: "4", text: "Motion and timer controls" },
    ],
    provideItems: [
      { id: "1", text: "Switch quantity" },
      { id: "2", text: "New or replacement details" },
      { id: "3", text: "Current switch photos if needed" },
      { id: "4", text: "Preferred switch type" },
    ],
    estimatedTime: "Takes about 2–3 minutes",
    estimatedTimeSubtitle: "Quick switch upgrade request",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Quantity & type" },
      { id: "3", step: 3, label: "Upload photos" },
      { id: "4", step: 4, label: "Project timing" },
      { id: "5", step: 5, label: "Review & submit" },
    ],
  },

  // ─── Lighting (id: 18) ─────────────────────────────────────────────────────
  "17": {
    subtitle:
      "Request a quote for interior or exterior lighting installation or replacement.",
    bestForItems: [
      { id: "1", text: "Interior fixtures" },
      { id: "2", text: "Exterior lights" },
      { id: "3", text: "Flood lights" },
      { id: "4", text: "Coach lights, driveway lights, and more" },
    ],
    provideItems: [
      { id: "1", text: "Lighting type" },
      { id: "2", text: "Fixture details" },
      { id: "3", text: "Photos of area or existing lights" },
      { id: "4", text: "Switch preferences" },
    ],
    estimatedTime: "Takes about 3–5 minutes",
    estimatedTimeSubtitle: "Covers both indoor and outdoor lighting",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Lighting category" },
      { id: "3", step: 3, label: "Fixture details" },
      { id: "4", step: 4, label: "Install type" },
      { id: "5", step: 5, label: "Switch setup" },
      { id: "6", step: 6, label: "Review & submit" },
    ],
  },

  // ─── Ceiling Fan (id: 19) ──────────────────────────────────────────────────
  "18": {
    subtitle: "Request a quote for ceiling fan installation or replacement.",
    bestForItems: [
      { id: "1", text: "Replacing old ceiling fans" },
      { id: "2", text: "New fan installation" },
      { id: "3", text: "Smart or upgraded controls" },
      { id: "4", text: "Rooms with existing or new switch setups" },
    ],
    provideItems: [
      { id: "1", text: "New or replacement details" },
      { id: "2", text: "Ceiling height" },
      { id: "3", text: "Fan model or preferences" },
      { id: "4", text: "Photos of current fan if applicable" },
    ],
    estimatedTime: "Takes about 3–4 minutes",
    estimatedTimeSubtitle: "Easy ceiling fan quote process",
    steps: [
      { id: "1", step: 1, label: "Contact details" },
      { id: "2", step: 2, label: "Install type" },
      { id: "3", step: 3, label: "Fan details" },
      { id: "4", step: 4, label: "Switch setup" },
      { id: "5", step: 5, label: "Review & submit" },
    ],
  },
};

export default function ServiceDetails() {
  const selectedCategory = useSelector(
    (state: RootState) => state.categoryRoute.selectedCategory,
  );

  // If Solar Installation (id: 11), redirect to its own screen
  if (selectedCategory?.id === "20") {
    // This should not happen as CategoryItem redirects directly
    // but just in case, redirect
    return null;
  }

  const detail = selectedCategory
    ? SERVICE_DETAIL_DATA[selectedCategory.id]
    : null;

  if (!selectedCategory || !detail) return null;

  return (
    <View style={{ flex: 1 }}>
      <ServiceDetailPage
        iconName={selectedCategory.iconName}
        iconColor={selectedCategory.iconColor}
        iconBg={selectedCategory.iconBg}
        title={selectedCategory.title}
        subtitle={detail.subtitle}
        bestForItems={detail.bestForItems}
        provideItems={detail.provideItems}
        estimatedTime={detail.estimatedTime}
        estimatedTimeSubtitle={detail.estimatedTimeSubtitle}
        steps={detail.steps}
      />
    </View>
  );
}
