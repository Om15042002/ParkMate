import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OverallRevenue from "./OverallRevenue";
import ParkingRevenue from "./ParkingRevenue";

function RevenueStatistics() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="OverallRevenue"
        component={OverallRevenue}
      ></Stack.Screen>
      <Stack.Screen
        name="ParkingRevenue"
        component={ParkingRevenue}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}

export default RevenueStatistics;
