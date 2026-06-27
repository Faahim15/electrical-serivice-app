import { getApps, initializeApp } from "@react-native-firebase/app";

export function initFirebase() {
  if (getApps().length === 0) {
    initializeApp({
      apiKey: "AIzaSyBkTf4pqOozwqj_x2s_v90nDx5CebuVcaE",
      authDomain: "ashley-5441e.firebaseapp.com",
      projectId: "ashley-5441e",
      storageBucket: "ashley-5441e.firebasestorage.app",
      messagingSenderId: "1909475438",
      appId: "1:1909475438:android:4b4e929146292bdbe2be7f",
      databaseURL: "https://ashley-5441e-default-rtdb.firebaseio.com",
    });
    console.log("✅ Firebase initialized manually");
  } else {
    console.log("✅ Firebase already initialized");
  }
}
