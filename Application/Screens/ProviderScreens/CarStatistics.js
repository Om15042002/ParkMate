import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OverallCar from "./OverallCar";
import ParkingCars from "./ParkingCars";

function CarStatistics() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OverallCar" component={OverallCar}></Stack.Screen>
      <Stack.Screen name="ParkingCars" component={ParkingCars}></Stack.Screen>
    </Stack.Navigator>
  );
}

export default CarStatistics;
