import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabScreens from './TabScreens';
import LoginFlowScreen from '../LoginLogoutScreens/LoginFlowScreen';

export default function HomeAndLoggin({ skip, setSkip, loggedin, setLoginClicked, setLoggedIn, userType }) {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen initialParams={{ setSkip: setSkip, loggedin: loggedin, setLoginClicked: setLoginClicked, setLoggedIn: setLoggedIn, userType: userType }} name="TabScreens" component={TabScreens}></Stack.Screen>
      <Stack.Screen initialParams={{ skip: skip, setSkip: setSkip, loggedin: loggedin, setLoggedIn: setLoggedIn }} name="LoginFlow" component={LoginFlowScreen}></Stack.Screen>
    </Stack.Navigator>
  );
}