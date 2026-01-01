import { BackHandler, Alert } from 'react-native';
import { useEffect } from 'react';

const useBackHandler = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Exit App",
        "Kya aap app band karna chahte ho?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => BackHandler.exitApp() },
        ]
      );
      return true; // 🔴 default back disable
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
};

export default useBackHandler;
