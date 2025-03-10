import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserCurrentBookings from './UserCurrentBookings';
import UserPreviousBookings from './UserPreviousBookings';

const Tab = createMaterialTopTabNavigator();

export default function Bookings() {

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
      <Tab.Screen name="CurrentBookings" component={UserCurrentBookings} options={{ title: "Current" }} />
      <Tab.Screen name="PreviousBookings" component={UserPreviousBookings} options={{ title: "Previous" }} />
    </Tab.Navigator>
  );
}
