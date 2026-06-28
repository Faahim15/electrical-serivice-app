// ─── Icon map per quote title keyword ───────────────────────────────────────
export const TITLE_ICON_MAP: {
  keyword: string;
  icon: string;
  iconColor: string;
  iconBg: string;
}[] = [
  {
    keyword: "ev charger",
    icon: "flash-outline",
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
  },
  {
    keyword: "panel",
    icon: "hardware-chip-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "service call",
    icon: "construct-outline",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    keyword: "circuit",
    icon: "git-branch-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "smoke",
    icon: "alert-circle-outline",
    iconColor: "#EF4444",
    iconBg: "#FEE2E2",
  },
  {
    keyword: "lighting",
    icon: "bulb-outline",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    keyword: "outlet",
    icon: "power-outline",
    iconColor: "#10B981",
    iconBg: "#D1FAE5",
  },
  {
    keyword: "ceiling fan",
    icon: "sync-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "switches",
    icon: "toggle-outline",
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
  },
  {
    keyword: "dedicated circuit",
    icon: "git-branch-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "electric system",
    icon: "hardware-chip-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "dock power",
    icon: "boat-outline",
    iconColor: "#0EA5E9",
    iconBg: "#E0F2FE",
  },
  {
    keyword: "hot tub",
    icon: "water-outline",
    iconColor: "#0EA5E9",
    iconBg: "#E0F2FE",
  },
  {
    keyword: "accessory building",
    icon: "business-outline",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    keyword: "remodeling",
    icon: "hammer-outline",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    keyword: "panel upgrade",
    icon: "hardware-chip-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "generator",
    icon: "flash-outline",
    iconColor: "#EF4444",
    iconBg: "#FEE2E2",
  },
  {
    keyword: "new construction",
    icon: "build-outline",
    iconColor: "#10B981",
    iconBg: "#D1FAE5",
  },
  {
    keyword: "starlink",
    icon: "wifi-outline",
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
  },
  {
    keyword: "surge protection",
    icon: "shield-outline",
    iconColor: "#8B5CF6",
    iconBg: "#F3F0FF",
  },
  {
    keyword: "exhaust fan",
    icon: "repeat-outline",
    iconColor: "#0EA5E9",
    iconBg: "#E0F2FE",
  },
];

export const DEFAULT_ICON_META = {
  icon: "document-text-outline",
  iconColor: "#3B82F6",
  iconBg: "#EFF6FF",
};

export function getIconMeta(serviceType: string) {
  const lower = serviceType.toLowerCase();
  return (
    TITLE_ICON_MAP.find((m) => lower.includes(m.keyword)) ?? DEFAULT_ICON_META
  );
}
