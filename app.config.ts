import "dotenv/config";
import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Electrical Service App",
  slug: "ashley-electrical-service-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "ashleyelectricalserviceapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.fourelements.electric",
    googleServicesFile: "./GoogleService-Info.plist",
  },

  android: {
    googleServicesFile: "./google-services.json",
    icon: "./assets/images/icon.png",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/icon.png",
      backgroundImage: "./assets/images/icon.png",
      monochromeImage: "./assets/images/icon.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: "com.fourelements.electric",
    permissions: [
      "android.permission.RECEIVE_BOOT_COMPLETED",
      "android.permission.VIBRATE",
      "android.permission.POST_NOTIFICATIONS",
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE",
    ],
  },

  web: {
    output: "static",
    bundler: "metro",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-router",
    "@react-native-firebase/app",
    "@react-native-firebase/messaging",
    [
      "expo-notifications",
      {
        icon: "./assets/images/icon.png",
        androidMode: "default",
        androidCollapsedTitle: "Ashley Electrical",
      },
    ],
    "./plugins/withFirebaseMessagingFix.js",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#ffffff",
        },
      },
    ],
    "expo-secure-store",
  ],

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },

  extra: {
    eas: {
      projectId: "93ec76c2-e0b1-4d8e-9981-46e0e8b1be01", // ✅
    },
  },
};

export default config;
