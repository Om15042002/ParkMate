import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ApprovedProvidedAreaList from "./ApprovedProvidedAreaList";
import ApprovedProvidedAreaItem from "./ApprovedProvidedAreaItem";

function ApprovedProvidedAreas() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ApprovedProvidedAreaList"
        component={ApprovedProvidedAreaList}
      ></Stack.Screen>
      <Stack.Screen
        name="ApprovedProvidedAreaItem"
        component={ApprovedProvidedAreaItem}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

export default ApprovedProvidedAreas;
