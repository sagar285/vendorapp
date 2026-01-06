import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiGet } from "../Api/Api";
import { Alert } from "react-native";

const AppContext = createContext(null);

// ✅ Custom Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
};

// ✅ Provider
export const AppProvider = ({ children }) => {

  // 🔥 Tum yahin pe apni internal states banaoge
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ActiveLoader,setActiveLoader] =useState(0)
  const [addressLine1, setAddressLine1] = useState('');

  // ✅ Jo bhi globally share karna ho yahin return karo

  const onLogout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  //     const getuserProfile = async () => {
  //     try {
  //        const result = await apiGet('/user/profile');
  //        console.log(result,"waah result") 
  //     } catch (error) {
  //       console.log(error.message)
  //        if (
  //       error?.message === "Session expired. Logged in from another device."
  //     ) {
  //       Alert.alert(
  //         "Session Expired",
  //         "Your account was logged in from another device. Please login again.",
  //         [
  //           {
  //             text: "OK",
  //             onPress:()=>onLogout() 
  //           },
  //         ],
  //         { cancelable: false }  
  //       ); 
  //     }
  
  //     }
  //     };
  
      
  // useEffect(() => {
  //   getuserProfile();
  // });
 

   

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    ActiveLoader,setActiveLoader,
    addressLine1, setAddressLine1,
    onLogout
  };

  const checkUser = async () =>{
    const getuserfromasyncstorage = await AsyncStorage.getItem("userdata")
    console.log(getuserfromasyncstorage,"getuserfromasyncstorage")
    if(getuserfromasyncstorage){
      setUser(JSON.parse(getuserfromasyncstorage))
    }
  }

  useEffect(()=>{
    checkUser()
  },[]) 


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
