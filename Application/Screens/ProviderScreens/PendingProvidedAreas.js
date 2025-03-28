import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PendingProvidedAreaList from "./PendingProvidedAreaList";
import PendingProvidedAreaItem from "./PendingProvidedAreaItem";

function ApprovedProvidedAreas() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="PendingProvidedAreaList"
        component={PendingProvidedAreaList}
      ></Stack.Screen>
      <Stack.Screen
        name="PendingProvidedAreaItem"
        component={PendingProvidedAreaItem}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

export default ApprovedProvidedAreas;
