import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = '@PENDING_NAVIGATION';

export const savePendingNavigation = async (nav) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(nav));
  } catch (e) {
    console.log('savePendingNavigation error', e);
  }
};

export const getPendingNavigation = async () => {
  try {
    const value = await AsyncStorage.getItem(KEY);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    return null;
  }
};

export const clearPendingNavigation = async () => {
  await AsyncStorage.removeItem(KEY);
};
