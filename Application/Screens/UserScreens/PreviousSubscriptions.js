import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PreviousSubscriptionsList from './PreviousSubscriptionsList'
import PreviousSubscriptionItem from './PreviousSubscriptionItem'

function PreviousSubscriptions() {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PreviousSubscriptionsList" component={PreviousSubscriptionsList}></Stack.Screen>
      <Stack.Screen name="PreviousSubscriptionItem" component={PreviousSubscriptionItem}></Stack.Screen>
    </Stack.Navigator>
  )
}

export default PreviousSubscriptions