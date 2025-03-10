import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { createContext, useState } from "react";
import { StyleSheet, View, LogBox } from "react-native";
import LoginFlowScreen from './Screens/LoginLogoutScreens/LoginFlowScreen';
import PublicUserScreen from "./Screens/UserScreens/PublicUserScreen";
import ProviderUserScreen from "./Screens/ProviderScreens/ProviderUserScreen";
import HomeScreen from "./Screens/CommonScreens/HomeScreen";
import { DefaultTheme } from "@react-navigation/native";
// import { userContext } from './UserContext';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

// console.log(MyTheme);

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "Possible Unhandled Promise Rejection",
  "Require cycle",
  "@firebase/database: FIREBASE WARNING",
]);

export const userContext = createContext({ usertype: "" });
// console.log(userContext);

export default function App() {
  // console.log(userContext);
  // console.log("App.js");

  const [skip, setSkip] = useState(false);
  const [user, setUser] = useState({
    usertype: "",
    id: "a",
    name: "a",
    username: "a",
    gender: "a",
    emailid: "a",
    contactno: "a",
    profilepicture: "a",
    profilepictureloc: "a",
    password: "a",
  });
  // console.log(skip);

  return (
    <userContext.Provider value={{ user: user, setUser: setUser }}>
      <View style={styles.container}>
        <StatusBar
          style="light"
          backgroundColor="rgba(1,0,87,0.78)"
          hidden={false}
          networkActivityIndicatorVisible={true}
          translucent={true}
        />
        <NavigationContainer theme={MyTheme}>
          
             {
            !skip ? <LoginFlowScreen skip={skip} setSkip={setSkip} /> :
              (user?.usertype === "" ? <HomeScreen skip={skip} setSkip={setSkip} /> :
                ((user?.usertype === "Public") ? <PublicUserScreen skip={skip} setSkip={setSkip} /> :
                  <ProviderUserScreen skip={skip} setSkip={setSkip} />))
          } 
          
  
        </NavigationContainer>
      </View>
    </userContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
