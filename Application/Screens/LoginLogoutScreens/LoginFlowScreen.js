import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';

function LoginFlowScreen({skip,setSkip,route}) {
    console.log(skip,setSkip,route);
    
    const Stack=createNativeStackNavigator();
    const mskip = route?.params?.skip ?? skip;
    const msetSkip = route?.params?.setSkip ?? setSkip;
    
    return (
        <Stack.Navigator>
            <Stack.Screen initialParams={{skip:mskip,setSkip:msetSkip}} name="Login" component={LoginScreen} options={{title:'Login'}}></Stack.Screen>
            <Stack.Screen name="Registration" component={RegistrationScreen} options={{title:'Registration'}}></Stack.Screen>
            <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} options={{title:'Forgot Password'}}></Stack.Screen>            
        </Stack.Navigator>
    )
}

export default LoginFlowScreen