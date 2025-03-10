import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

function NoDataFound() {
  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#E8F4F8' }}>
      <View style={{ width: 200, height: 200, marginTop: '10%', marginLeft: -10, }}>
        <Ionicons name="search" size={200} color="rgba(1,0,87,0.78)" />
      </View>

      <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgba(1,0,87,0.78)' }}>No Results Found</Text>
      <Text style={{ fontSize: 12, fontWeight: '500', color: 'rgba(1,0,87,0.78)' }}>We Couldn't Find What You Looking For</Text>
      <Text style={{ fontSize: 12, fontWeight: '500', color: 'rgba(1,0,87,0.78)' }}>Try Again</Text>

    </View>


  )
}

export default NoDataFound