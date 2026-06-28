import { Ionicons } from "@expo/vector-icons";
import { Href } from "expo-router";
export type QuickAction = {
  id: string;
  route: Href;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
};
export type ActivityItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  route: string;
  type: string;
  iconColor: string;
  iconBg: string;
};

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}
