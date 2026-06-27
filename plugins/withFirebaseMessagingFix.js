const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withFirebaseMessagingFix(config) {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];

    if (!mainApplication["meta-data"]) {
      mainApplication["meta-data"] = [];
    }

    // Find and fix the notification color meta-data conflict
    const metaDataList = mainApplication["meta-data"];

    const colorIndex = metaDataList.findIndex(
      (item) =>
        item.$?.["android:name"] ===
        "com.google.firebase.messaging.default_notification_color",
    );

    if (colorIndex !== -1) {
      metaDataList[colorIndex] = {
        $: {
          "android:name":
            "com.google.firebase.messaging.default_notification_color",
          "android:resource": "@color/notification_icon_color",
          "tools:replace": "android:resource",
        },
      };
    }

    // Make sure tools namespace is declared
    if (!config.modResults.manifest.$["xmlns:tools"]) {
      config.modResults.manifest.$["xmlns:tools"] =
        "http://schemas.android.com/tools";
    }

    return config;
  });
};
