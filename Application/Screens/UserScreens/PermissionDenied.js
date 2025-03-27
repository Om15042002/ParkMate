import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';

function PermissionDenied({ refresh, setRefresh }) {
  const wcolor = 'rgb(168, 167, 163)'
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '2%' }}>
      <Text style={{ fontSize: 15, color: 'rgba(1,0,87,0.78)', fontWeight: 'bold' }}>Refresh To Give Location Permission</Text>
      <Pressable android_ripple={{ color: wcolor, radius: 5 }} style={{ marginTop: "2%" }} onPress={() => setRefresh(!refresh)}>
        <MaterialIcons name="refresh" size={30} color="rgba(1,0,87,0.78)" />
      </Pressable>
    </View>

  )
}

export default PermissionDenied