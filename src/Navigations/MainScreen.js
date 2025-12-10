import NavigationString from './NavigationStrings';
import * as Screen from '../screen';
// import BottomTabs from "./BottomTabs";
export default function (Stack) {
  return (
    <>
      <Stack.Screen
        name={NavigationString.Signup}
        component={Screen.Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NavigationString.Login}
        component={Screen.Login}
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
        name={NavigationString.OTP}
        component={Screen.OTP}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={NavigationString.SetPassword}
        component={Screen.SetPassword}
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
