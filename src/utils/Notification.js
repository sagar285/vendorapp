import React, { useEffect } from 'react';
import { StyleSheet, Platform, PermissionsAndroid } from 'react-native';

import Route from './src/Navigations/Route';
import { AppProvider } from './src/Context/AppContext';

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

/* 🔔 REQUEST PERMISSION + GET FCM TOKEN */
const getNotificationToken = async () => {
  try {
    // Android 13+ permission
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('❌ Notification permission denied');
        return null;
      }
    }

    await messaging().requestPermission();
    const token = await messaging().getToken();

    console.log('🔥 FCM TOKEN:', token);
    return token;
  } catch (error) {
    console.log('❌ Token error:', error);
    return null;
  }
};

const App = () => {

  /* 🔔 CREATE NOTIFICATION CHANNEL */
  const createChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Notifications',
      importance: AndroidImportance.HIGH,
    });
  };

  useEffect(() => {

    const init = async () => {
      await createChannel();
      // 🔑 Get token
      const token = await getNotificationToken();
      if (token) {
        // 👉 Send token to backend
        console.log('✅ Token ready to send backend');
      }
    };

    init();

    /* 🟢 FOREGROUND NOTIFICATION */
    const unsubscribeOnMessage = messaging().onMessage(
      async remoteMessage => {
        console.log('📩 Foreground:', remoteMessage);

        await notifee.displayNotification({
          title: remoteMessage.notification?.title || 'Notification',
          body: remoteMessage.notification?.body || '',
          android: {
            channelId: 'default',
            pressAction: { id: 'default' },
          },
        });
      }
    );

    /* ⚫ KILL MODE */
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('⚫ Opened from kill state:', remoteMessage);
        }
      });

    /* 🔁 TOKEN REFRESH */
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(
      newToken => {
        console.log('🔁 Token refreshed:', newToken);
        // 👉 Update backend
      }
    );

    return () => {
      unsubscribeOnMessage();
      unsubscribeTokenRefresh();
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
