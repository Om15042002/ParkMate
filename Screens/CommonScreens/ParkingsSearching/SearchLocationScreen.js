import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ParkingItem from './ParkingItem'
import Booking from './Booking'
import SearchTabs from './SearchTabs'
import SearchForm from './SearchForm'

function SearchLocationScreen() {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchForm" component={SearchForm} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="FindLocation" component={SearchTabs} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="ParkingItem" component={ParkingItem} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="Book" component={Booking} options={{ headerShown: false }}></Stack.Screen>
    </Stack.Navigator>
  )
}

export default SearchLocationScreen