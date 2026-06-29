import { requestsuccess } from "@/assets/iocns/icon";
import ScreenWrapper from "@/src/components/shared/ScreenWrapper";
import { SERVICE_CATEGORIES } from "@/src/constants/tabs.home.constant";
import { RootState } from "@/src/redux/store";
import { verticalScale } from "@/src/utils/Scaling";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";

const RequestReceived = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScaleAnim = useRef(new Animated.Value(0.5)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const refAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;

  const { serviceType } = useLocalSearchParams();
  // ── Slice data ──────────────────────────────────────────
  const selectedCategoryId = useSelector(
    (state: RootState) => state.serviceForm.selectedCategoryId,
  );
  const contactDetails = useSelector(
    (state: RootState) => state.serviceForm.contactDetails,
  );

  const selectedCategory = SERVICE_CATEGORIES.find(
    (c) => c.id === selectedCategoryId,
  );

  const preferredContactMap: Record<string, string> = {
    Call: "Phone Call",
    Text: "Text Message",
    Email: "Email",
  };

  const submittedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Random reference ID
  const referenceId = useRef(
    "#QT-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
  ).current;

  const infoRows = [
    {
      label: "Quote Type",
      value: selectedCategory?.title || serviceType,
    },
    {
      label: "Submitted",
      value: submittedDate,
    },
    {
      label: "Contact Method",
      value:
        preferredContactMap[contactDetails.preferredContact] ??
        contactDetails.preferredContact ??
        "—",
    },
  ];
  // ────────────────────────────────────────────────────────

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(iconScaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(refAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(btnAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScreenWrapper>
      {/* <BackButton /> */}

      <SafeAreaView className="flex-1">
        <View style={{ flex: 1, paddingBottom: verticalScale(120) }}>
          {/* Top Section */}
          <View className="items-center pt-10 pb-4">
            <Animated.View
              style={{
                opacity: iconOpacity,
                transform: [{ scale: iconScaleAnim }],
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "rgba(20,184,166,0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SvgXml xml={requestsuccess} width={88} height={88} />
              </View>
            </Animated.View>

            <Animated.Text
              className="text-[#0F172A] text-2xl text-center mb-2 font-Inter_Bold"
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              Request received
            </Animated.Text>
            <Animated.Text
              className="text-[#64748B] text-sm text-center px-6 leading-5 font-Inter_Regular"
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              Thanks! Our team will review your request and contact you soon.
            </Animated.Text>
          </View>

          {/* Info Card */}
          <Animated.View
            className="bg-white rounded-2xl px-5 py-4 mb-4"
            style={{
              opacity: cardAnim,
              transform: [
                {
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
              shadowColor: "#0EA5E9",
              shadowOpacity: 0.07,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            {infoRows.map((row, i) => (
              <View
                key={row.label}
                className={i < infoRows.length - 1 ? "mb-4" : "mb-4"}
              >
                <Text className="text-[#94A3B8] text-xs mb-[2px] font-Inter_Regular">
                  {row.label}
                </Text>
                <Text className="text-[#0F172A] text-[15px] font-Inter_SemiBold">
                  {row.value}
                </Text>
              </View>
            ))}

            {/* Reference ID Badge */}
            <Animated.View
              style={{
                opacity: refAnim,
                transform: [
                  {
                    scale: refAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.92, 1],
                    }),
                  },
                ],
              }}
            >
              {/* <View
                className="self-start rounded-full px-4 py-[6px] mt-1"
                style={{ backgroundColor: "#FEF9C3" }}
              >
                <Text className="text-[#92400E] text-sm font-Inter_Medium">
                  Reference ID: {referenceId}
                </Text>
              </View> */}
            </Animated.View>
          </Animated.View>

          {/* Bottom Buttons */}
          <Animated.View style={{ opacity: btnAnim }}>
            <Pressable
              onPress={() => router.replace("/(tabs)/quotes")}
              className="rounded-full py-4 items-center mb-3"
              style={{
                backgroundColor: "#06B6D4",
                shadowColor: "#06B6D4",
                shadowOpacity: 0.3,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              }}
            >
              <Text className="text-white text-base font-Inter_SemiBold">
                Return Home
              </Text>
            </Pressable>

            <View className="flex-row gap-x-3">
              <Pressable
                className="flex-1 rounded-full py-[14px] items-center bg-white"
                onPress={() =>
                  router.replace("/(tabs)/quotes/quote/choose-category")
                }
                style={{
                  shadowColor: "#0EA5E9",
                  shadowOpacity: 0.07,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 1,
                }}
              >
                <Text className="text-[#0F172A] text-sm font-Inter_Medium">
                  New Quote
                </Text>
              </Pressable>

              <Pressable
                className="flex-1 rounded-full py-[14px] items-center bg-white"
                onPress={() => {
                  router.push("/(tabs)/home/my-quotation");
                }}
                style={{
                  shadowColor: "#0EA5E9",
                  shadowOpacity: 0.07,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 1,
                }}
              >
                <Text className="text-[#0F172A] text-sm font-Inter_Medium">
                  My Quotes
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default RequestReceived;
