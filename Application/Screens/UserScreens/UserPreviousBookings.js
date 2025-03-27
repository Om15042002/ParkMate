import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PreviousBookingsList from './PreviousBookingsList'
import PreviousBookingItem from './PreviousBookingItem'

function UserPreviousBookings() {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PreviousBookingsList" component={PreviousBookingsList}></Stack.Screen>
      <Stack.Screen name="PreviousBookingItem" component={PreviousBookingItem}></Stack.Screen>
    </Stack.Navigator>
  )
}

export default UserPreviousBookings