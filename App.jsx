import React, { useEffect, useRef } from "react";
import { Alert, Platform, StyleSheet, Text, TextInput } from "react-native";
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";

import Route from "./src/Navigations/RootNavigator";
import { AppProvider } from "./src/Context/AppContext";
import { apiGet } from "./src/Api/Api";
import {
  savePendingNavigation,
  getPendingNavigation,
  clearPendingNavigation,
} from "./src/screen/PendingNavigation";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

/* Android notification channel */
async function createOrderChannel() {
  if (Platform.OS === "android") {
    await notifee.createChannel({
      id: "order_channel",
      name: "Order Notifications",
      importance: AndroidImportance.HIGH,
      sound: "ringtone",
      vibration: true,
    });
  }
}

/* Deduplication store */
const shownMessageIds = new Set();

/* Single notification display */
async function showNotificationOnce(remoteMessage) {
  if (!remoteMessage?.messageId) return;
  if (shownMessageIds.has(remoteMessage.messageId)) return;

  shownMessageIds.add(remoteMessage.messageId);

  const title =
    remoteMessage?.data?.title ||
    remoteMessage?.notification?.title ||
    "New Order";

  const body =
    remoteMessage?.data?.body ||
    remoteMessage?.notification?.body ||
    "You have a new order";

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: "order_channel",
      importance: AndroidImportance.HIGH,
      sound: "ringtone",
      pressAction: { id: "default" },
    },
  });
}

/* Background and killed state handler */
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  await createOrderChannel();

  // Only show notification for data-only payload
  if (!remoteMessage.notification) {
    await showNotificationOnce(remoteMessage);
  }
});

const App = () => {
  const navigationRef = useRef(null);

  /* Profile check */
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        await apiGet("/user/profile");
      } catch (error) {
        if (
          error?.message ===
          "Session expired. Logged in from another device."
        ) {
          Alert.alert(
            "Session Expired",
            "Your account was logged in from another device. Please login again.",
            [{ text: "OK" }],
            { cancelable: false }
          );
        }
      }
    };

    getUserProfile();
  }, []);

  /* Init */
  useEffect(() => {
    let unsubscribe;

    const init = async () => {
      await notifee.requestPermission();
      await messaging().requestPermission();
      await createOrderChannel();      

      const token = await messaging().getToken();
      console.log(token,"fcm tokenn")
    
      await AsyncStorage.setItem("fcm_token", token);

      // Foreground messages
      unsubscribe = messaging().onMessage(async (remoteMessage) => {
        await showNotificationOnce(remoteMessage);
      });

      // Killed state tap handling
      const initialNotification =
        await messaging().getInitialNotification();

      if (initialNotification?.data?.screen) {
        await savePendingNavigation({
          name: initialNotification.data.screen,
          params: initialNotification.data,
        });
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <AppProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={async () => {
          const nav = await getPendingNavigation();
          if (nav) {
            navigationRef.current?.navigate(nav.name, nav.params);
            await clearPendingNavigation();
          }
        }}
      >
        <Route />
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
