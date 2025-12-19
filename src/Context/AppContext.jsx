import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

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

  // ✅ Jo bhi globally share karna ho yahin return karo
  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    ActiveLoader,setActiveLoader
  };

  const checkUser = async () =>{
    const getuserfromasyncstorage = await AsyncStorage.getItem("userdata")
    console.log(getuserfromasyncstorage,"kkkkkkk")
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
