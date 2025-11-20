import NavigationString from "./NavigationStrings";
import * as Screen from "../screen"
// import BottomTabs from "./BottomTabs";
export default function(Stack){
    return (
        <>
     
        <Stack.Screen   
        name={NavigationString.Signup}
        component={Screen.Signup}
        options={{headerShown:false}}
        />
       
       
        
        
        </>
    )
}