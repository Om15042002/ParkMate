import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CurrentBookingsList from './CurrentBookingsList'
import CurrentBookingItem from './CurrentBookingItem'
import DirectingRoute from './DirectingRoute'

function UserCurrentBookings() {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CurrentBookingsList" component={CurrentBookingsList}></Stack.Screen>
      <Stack.Screen name="CurrentBookingItem" component={CurrentBookingItem}></Stack.Screen>
      <Stack.Screen name="DirectingRoute" component={DirectingRoute}></Stack.Screen>
    </Stack.Navigator>
  )
}

export default UserCurrentBookings