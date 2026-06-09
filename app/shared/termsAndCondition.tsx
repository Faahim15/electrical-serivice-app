import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import Feather from "@expo/vector-icons/build/Feather";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const termsSections = [
  {
    id: 1,
    title: "1. Acceptance of Terms",
    body: "By accessing and using the Four Elements Electric mobile application, you accept and agree to be bound by the terms and provision of this agreement.",
  },
  {
    id: 2,
    title: "2. Use License",
    body: "Permission is granted to temporarily download one copy of the app for personal, non-commercial transitory viewing only.",
  },
  {
    id: 3,
    title: "3. User Account",
    body: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
  },
  {
    id: 4,
    title: "4. Service Modifications",
    body: "Four Elements Electric reserves the right to modify or discontinue the service at any time without notice.",
  },
  {
    id: 5,
    title: "5. Limitation of Liability",
    body: "In no event shall Four Elements Electric be liable for any damages arising out of the use or inability to use the materials on the app.",
  },
  {
    id: 6,
    title: "6. Governing Law",
    body: "These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Four Elements Electric operates.",
  },
];

const TermsSection = ({
  item,
  index,
}: {
  item: (typeof termsSections)[0];
  index: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: index * 80,
        useNativeDriver: true,
        tension: 60,
        friction: 9,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
      <Text className="text-[15px] font-Inter_Bold text-[#111827] mb-1 mt-4">
        {item.title}
      </Text>
      <Text className="text-[13px] text-[#6B7280] font-Inter_Regular leading-[21px]">
        {item.body}
      </Text>
    </Animated.View>
  );
};

const Terms = () => {
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScreenWrapper>
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* header */}
        <View className="flex-row justify-between items-center pb-2 ">
          <Pressable onPress={() => router.back()} className="">
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text className="text-2xl text-[#111827] font-Inter_Bold">
            Terms & Conditions
          </Text>
          <View />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 "
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
        >
          {/* content  */}
          <View
            className="bg-white rounded-2xl px-4 pt-4 pb-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            {/* Last updated */}
            <Animated.Text
              style={{ opacity: headerFade }}
              className="text-[12px] text-[#9CA3AF] font-Inter_Regular mb-1"
            >
              Last updated: April 8, 2026
            </Animated.Text>

            {/* Sections */}
            {termsSections.map((item, index) => (
              <TermsSection key={item.id} item={item} index={index} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Terms;
