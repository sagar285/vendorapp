import NavigationString from './NavigationStrings';
import * as Screen from '../screen';
import BottomTabs from "./BottomTabs";
export default function (Stack) {
  return (
    <>
      <Stack.Screen
        name={NavigationString.DNT_SIGNUP}
        component={Screen.DNT_SIGNUP}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationString.FIRST_PAGE}
        component={Screen.FIRST_PAGE}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationString.DNT_LOGIN}
        component={Screen.DNT_LOGIN}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationString.Shops}
        component={Screen.Shops}
        options={{ headerShown: false }}
      /> 

      <Stack.Screen
        name={NavigationString.addYourshop}
        component={Screen.AddShop}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationString.addMenu}
        component={Screen.AddMenu}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name={NavigationString.viewShop}
        component={Screen.ViewShop}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationString.shopMenuManager}
        component={Screen.ShopMenuManager}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={NavigationString.ViewItems}
        component={Screen.ViewItems}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={NavigationString.DNT_OTP}
        component={Screen.DNT_OTP}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={NavigationString.DNT_PASSWORD}
        component={Screen.DNT_PASSWORD}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationString.DNT_VENDORREGISTER}
        component={Screen.VendorRegister}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationString.DNT_VerifyingDetails}
        component={Screen.DNT_VerifyingDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
      name={NavigationString.BottomTab} 
      component={BottomTabs} 
        options={{ headerShown: false }}

      />


      <Stack.Screen
        name={NavigationString.Testing}
        component={Screen.Testing}
        options={{ headerShown: false }}
      />
    </>
  );
}
