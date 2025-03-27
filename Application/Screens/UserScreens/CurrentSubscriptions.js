import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CurrentSubscriptionsList from './CurrentSubscriptionsList'
import CurrentSubscriptionItem from './CurrentSubscriptionItem'
import DirectingRoute from './DirectingRoute'

function CurrentSubscriptions() {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CurrentSubscriptionsList" component={CurrentSubscriptionsList}></Stack.Screen>
      <Stack.Screen name="CurrentSubscriptionItem" component={CurrentSubscriptionItem}></Stack.Screen>
      <Stack.Screen name="DirectingRoute" component={DirectingRoute}></Stack.Screen>
    </Stack.Navigator>
  )
}

export default CurrentSubscriptions