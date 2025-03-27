import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CurrentSubscriptions from './CurrentSubscriptions';
import PreviousSubscriptions from './PreviousSubscriptions'

const Tab = createMaterialTopTabNavigator();

export default function Subscriptions() {

  return (
    <Tab.Navigator screenOptions={{
      tabBarShowLabel: true,
      tabBarScrollEnabled: false,
      tabBarActiveTintColor: '#0096FF',
      tabBarInactiveTintColor: 'rgba(1,0,87,0.78)',
      tabBarLabelStyle: { fontSize: 15, fontWeight: '500' },
      tabBarStyle: { backgroundColor: '#E8F4F8' },
      tabBarIndicatorStyle: { backgroundColor: '#0096FF' },
    }}>
      <Tab.Screen name="CurrentSubscriptions" component={CurrentSubscriptions} options={{ title: "Current" }} />
      <Tab.Screen name="PreviousSubscriptions" component={PreviousSubscriptions} options={{ title: "Previous" }} />
    </Tab.Navigator>
  );
}
