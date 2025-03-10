import React from 'react'
import { View, Text, Image } from 'react-native'
import nsorry from '../../assets/Images/nsorry.png'

function NoDataFound2() {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{
        width: 200,
        height: 200,
        overflow: 'hidden',
        borderRadius: 100,
        borderWidth: 0
      }}>
        <Image source={nsorry} style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover'
        }}>
        </Image>
      </View>

      <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'rgba(1,0,87,0.78)' }}>No Results Found</Text>
    </View>

  )
}

export default NoDataFound2