import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import Feather from "@expo/vector-icons/build/Feather";
import { Href, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsItem {
  id: string;
  route: Href;
  icon: string;
  title: string;
  subtitle: string;
}

const settingsItems: SettingsItem[] = [
  {
    id: "1",
    route: "/(tabs)/profile/(setting)/notification-setting",
    icon: "bell",
    title: "Notification Settings",
    subtitle: "Manage app notifications",
  },
  {
    id: "2",
    route: "/(tabs)/profile/(setting)/permissions",
    icon: "lock",
    title: "Permissions",
    subtitle: "App access permissions",
  },
  {
    id: "3",
    route: "/(tabs)/profile/(setting)/language" as any,
    icon: "globe",
    title: "Language",
    subtitle: "English",
  },
  {
    id: "8",
    route: "/(tabs)/profile/(setting)/change-password",
    icon: "key",
    title: "Change Password",
    subtitle: "Update your password",
  },
  {
    id: "4",
    route: "/(tabs)/profile/(setting)/faqs",
    icon: "help-circle",
    title: "FAQS",
    subtitle: "App quires",
  },
  {
    id: "5",
    route: "/(tabs)/profile/(setting)/privacy-policy",
    icon: "shield",
    title: "Privacy Policy",
    subtitle: "View our privacy policy",
  },
  {
    id: "6",
    route: "/(tabs)/profile/(setting)/terms",
    icon: "file-text",
    title: "Terms & Conditions",
    subtitle: "App terms of service",
  },
  {
    id: "7",
    route: "/(tabs)/profile/(setting)/aboutus",
    icon: "info",
    title: "About Us",
    subtitle: "App information",
  },
];
const SettingsRow = ({
  item,
  index,
}: {
  item: (typeof settingsItems)[0];
  index: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 70,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        delay: index * 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
      className="mb-3"
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          if (item.title === "Language") return;
          if (item.title === "Privacy Policy") {
            Linking.openURL("https://www.fourelementselectric.com/privacy");
          } else {
            router.push(item.route);
          }
        }}
        className="bg-white rounded-2xl px-4 py-4 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-3 flex-1">
          {/* Icon bubble */}
          <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center">
            <Feather name={item.icon as any} size={18} color="#60A5FA" />
          </View>

          {/* Text */}
          <View className="flex-1">
            <Text className="text-base text-[#111827] font-Inter_SemiBold">
              {item.title}
            </Text>
            <Text className="text-sm text-gray-400 font-Inter_Regular mt-0.5">
              {item.subtitle}
            </Text>
          </View>
        </View>

        {item.title === "Language" ? (
          ""
        ) : (
          <Feather name="chevron-right" size={18} color="#9CA3AF" />
        )}
      </Pressable>
    </Animated.View>
  );
};

const LogoutModal = ({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 16,
          stiffness: 200,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/40 items-center justify-center px-8">
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
          className="bg-white rounded-3xl px-6 pt-6 pb-5 w-full items-center"
        >
          {/* Red X icon */}
          <View className="w-12 h-12 rounded-2xl bg-red-50 items-center justify-center mb-4">
            <Feather name="x" size={22} color="#EF4444" />
          </View>

          <Text className="text-xl text-[#111827] font-Inter_Bold mb-2">
            Log out?
          </Text>
          <Text className="text-sm text-gray-400 font-Inter_Regular text-center mb-6">
            Are you sure you want to log out of{"\n"}your account?
          </Text>

          {/* Log Out button */}
          <Pressable
            onPress={onConfirm}
            className="bg-red-500 rounded-2xl w-full py-4 items-center mb-3"
          >
            <Text className="text-white font-Inter_Bold text-base">
              Log Out
            </Text>
          </Pressable>

          {/* Cancel */}
          <Pressable onPress={onCancel}>
            <Text className="text-sm text-gray-500 font-Inter_SemiBold">
              Cancel
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const Settings = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-16)).current;
  const logoutFade = useRef(new Animated.Value(0)).current;
  const logoutSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(logoutFade, {
        toValue: 1,
        duration: 350,
        delay: settingsItems.length * 70 + 100,
        useNativeDriver: true,
      }),
      Animated.timing(logoutSlide, {
        toValue: 0,
        duration: 350,
        delay: settingsItems.length * 70 + 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* header */}
        <Animated.View
          style={{
            opacity: headerFade,
            transform: [{ translateY: headerSlide }],
          }}
          className="flex-row justify-between items-center pb-2"
        >
          <Pressable onPress={() => router.back()} className="">
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-2xl text-[#111827] font-Inter_Bold">
            Settings
          </Text>
          <View />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
        >
          {/* Settings Items */}
          {settingsItems.map((item, index) => (
            <SettingsRow key={item.id} item={item} index={index} />
          ))}

          {/* Logout Button */}
          <Animated.View
            style={{
              opacity: logoutFade,
              transform: [{ translateY: logoutSlide }],
            }}
            className="mt-2"
          >
            <Pressable
              onPress={() => setShowLogoutModal(true)}
              className="bg-white rounded-2xl py-4 flex-row items-center justify-center gap-2"
            >
              <Feather name="log-out" size={18} color="#EF4444" />
              <Text className="text-base text-red-500 font-Inter_SemiBold">
                Logout
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          router.replace("/auth/sign-in");
        }}
      />
    </ScreenWrapper>
  );
};

export default Settings;
