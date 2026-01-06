import React, { useEffect } from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import Route from "./src/Navigations/RootNavigator";
import { AppProvider } from "./src/Context/AppContext";
import { Text, TextInput } from 'react-native';
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGet } from "./src/Api/Api";
import { useAppContext } from "./src/Context/AppContext";
Text.defaultProps  = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;



/* 🔔 CREATE SINGLE ORDER CHANNEL */
async function createOrderChannel() {
  if (Platform.OS === "android") {
    await notifee.createChannel({
      id: "order_channel",
      name: "Order Notifications",
      importance: AndroidImportance.HIGH,
      sound: "ringtone", // 🔊 android/app/src/main/res/raw/ringtone.mp3
      vibration: true,
    });
  }
}


     const getuserProfile = async () => {
      try {
         const result = await apiGet('/user/profile');
         console.log(result,"waah result") 
      } catch (error) {
        console.log(error.message)
         if (
        error?.message === "Session expired. Logged in from another device."
      ) {
        Alert.alert(
          "Session Expired",
          "Your account was logged in from another device. Please login again.",
          [
            {
              text: "OK",
              // onPress:()=>onLogout() 
            },
          ],
          { cancelable: false }  
        ); 
      }
  
      }
      };
      


/* 🔔 SHOW NOTIFICATION */
async function showOrderNotification(remoteMessage) {
  console.log(remoteMessage,"notfication")
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

/* 🟣 BACKGROUND / KILLED HANDLER (OUTSIDE COMPONENT) */
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log("📩 Background message:", remoteMessage);
  await createOrderChannel();
  await showOrderNotification(remoteMessage);
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  if (type === EventType.PRESS) {
    console.log('User pressed notification in killed state', notification);
    // Yahan agar koi specific screen pe bhejna hai toh logic likh sakte hain
    // note: navigation yahan direct kaam nahi karega, initialNotification ka wait karna hoga
    await notifee.cancelNotification(notification.id);
  }
});

const handleKilledState = async () => {
    // 1. Firebase check
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      console.log("📩 Opened from killed state (Firebase):", initialNotification);
      // Navigation logic yahan aayega
    }

    // 2. Notifee check (Best for Android)
    const initialNotifee = await notifee.getInitialNotification();
    if (initialNotifee) {
      console.log("📩 Opened from killed state (Notifee):", initialNotifee.notification);
      // Navigation logic yahan aayega
    }
  };

const App = () => {
      
  
  useEffect(() => {
    getuserProfile();
  },[]); 
  /* 🔐 PERMISSIONS */
  const requestPermissions = async () => {
    await notifee.requestPermission();
    await messaging().requestPermission(); 
  };

  /* 🔑 GET FCM TOKEN */
  const getFcmToken = async () => {
    const token = await messaging().getToken();
    console.log("🔥 FCM TOKEN:", token);
    await AsyncStorage.setItem("fcm_token", token);
  };

  /* 🟢 FOREGROUND HANDLER */
  const listenForeground = () => {
    return messaging().onMessage(async remoteMessage => {
      console.log("📩 Foreground message:", remoteMessage);
      await showOrderNotification(remoteMessage);
    });
  };

  /* ⚫ KILLED STATE TAP HANDLER */
  const handleKilledState = async () => {
    const initialNotification =
      await messaging().getInitialNotification();

    if (initialNotification) {
      console.log(
        "📩 Opened from killed state:",
        initialNotification
      );
      // yahan navigation laga sakte ho
    }
  };

  /* 🚀 INIT */
  useEffect(() => {
    let unsubscribe;

    const init = async () => {
      await createOrderChannel();
      await requestPermissions();
      await getFcmToken();
      unsubscribe = listenForeground();
      await handleKilledState();
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <AppProvider>
      <Route />
    </AppProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
