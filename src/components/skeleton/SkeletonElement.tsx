import React from "react";
import { Animated, Easing, useColorScheme } from "react-native";

const SkeletonElement = ({ width, height, style }: any) => {
  const colorScheme = useColorScheme();
  const fadeAnim = React.useRef(new Animated.Value(0.3)).current;

  const backgroundColor = colorScheme === "dark" ? "#E1E9EE" : "#E1E9EE";

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          backgroundColor,
          opacity: fadeAnim,
          borderRadius: 4,
          width,
          height,
        },
        style,
      ]}
    />
  );
};
export default SkeletonElement;
