import { useNavigationContainerRef } from '@react-navigation/native';

const RootNavigator = () => {
  const navigationRef = useNavigationContainerRef();
  const { user, onLogout } = useAppContext();
  const isLoggedIn = !!user;
  const hasShop = user?.role === "vendor";

  const getuserProfile = useCallback(async () => {
    if (!isLoggedIn) return;

    // Current route nikalo
    const currentRoute = navigationRef.getCurrentRoute();
    
    // Agar Support Request screen par hai toh return karo
    if (currentRoute?.name === NavigationString.DNT_Support_Request) {
      console.log('Support screen hai, API call nahi karunga');
      return;
    }

    try {
      const result = await apiGet('/user/profile');
      console.log(result, "waah result");
    } catch (error) {
      console.log(error.message);
      if (error?.message === "Session expired. Logged in from another device.") {
        Alert.alert(
          "Session Expired",
          "Your account was logged in from another device. Please login again.",
          [{ text: "OK", onPress: () => onLogout() }],
          { cancelable: false }
        );
      }
    }
  }, [isLoggedIn, onLogout, navigationRef]);

  // Navigation Changes Track Karo
  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      if (isLoggedIn) {
        getuserProfile();
      }
    });

    return unsubscribe;
  }, [isLoggedIn, getuserProfile]);

  return (
    <NavigationContainer ref={navigationRef}>
      {!isLoggedIn ? (
        <AuthStack />
      ) : !hasShop ? (
        <OnboardingStack />
      ) : (
        <AppTabs />
      )}
    </NavigationContainer>
  );
};