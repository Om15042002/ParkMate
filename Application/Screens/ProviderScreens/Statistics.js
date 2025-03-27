import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import RevenueStatistics from "./RevenueStatistics";
import CarStatistics from "./CarStatistics";

const Tab = createMaterialTopTabNavigator();

export default function Statistics() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        tabBarScrollEnabled: false,
        tabBarActiveTintColor: "#0096FF",
        tabBarInactiveTintColor: "rgba(1,0,87,0.78)",
        tabBarLabelStyle: { fontSize: 15, fontWeight: "500" },
        tabBarStyle: { backgroundColor: "#E8F4F8" },
        tabBarIndicatorStyle: { backgroundColor: "#0096FF" },
      }}
    >
      <Tab.Screen
        name="RevenueStatistics"
        component={RevenueStatistics}
        options={{ title: "Revenue" }}
      />
      <Tab.Screen
        name="CarStatistics"
        component={CarStatistics}
        options={{ title: "Car" }}
      />
    </Tab.Navigator>
  );
}
