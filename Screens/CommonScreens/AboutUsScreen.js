import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
function AboutUsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.rowitem}>
        <Text style={{ marginBottom: 20, marginTop: 20, fontWeight: '450', fontSize: 16, color: 'rgba(1,0,87,0.78)' }}>{`--> We are providing this service in order to solve constraints in traditional parking system.This app tries to reduce manpower involvement and time, increases efficiency to manage parking areas.`}
        </Text>
        <Text style={{ marginBottom: 20, fontWeight: '450', fontSize: 16, color: 'rgba(1,0,87,0.78)' }}>{`--> Also this app is great for the parking area owner because they can easily add or remove parking areas,also they can analyse the vehicle traffic with carwise as well as revenue wise.`}
        </Text>
        <Text style={{ marginBottom: 10, fontWeight: '450', fontSize: 16, color: 'rgba(1,0,87,0.78)' }}>{`--> On the contrary the public user also can search the available parkings according to his/her constraints. He/She can find direction towards the parking area that he/she has booked.`}
        </Text>
        <Text style={{ marginBottom: 10, fontWeight: '450', fontSize: 16, color: 'rgba(1,0,87,0.78)' }}>{`--> This app is made under the subject of 7th sem which is Mini Project. And the entire work is done by following develpers...`}
        </Text>
      </View>
      <View style={[styles.rowitem, { flexDirection: 'column', marginTop: 0 }]}>
        <Text style={{ marginBottom: 10, fontWeight: '450', fontSize: 16, marginLeft: 10, marginTop: 10, color: 'rgba(1,0,87,0.78)' }}>
          1. Om Siddhapura     (19CP048)
        </Text>
        <Text style={{ marginBottom: 10, fontWeight: '450', fontSize: 16, marginLeft: 10, color: 'rgba(1,0,87,0.78)' }}>
          2. Kushay Vohra        (19CP053)
        </Text>
        <Text style={{ marginBottom: 10, fontWeight: '450', fontSize: 16, marginLeft: 10, color: 'rgba(1,0,87,0.78)' }}>
          3. Harshad Parghi     (19CP060)
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#E8F4F8',
  },
  imagecard: {
    flex: 3,
    Height: '50%',
    Width: '20%',
    borderWidth: 1,
    marginTop: 0,
  },
  rowitem: {
    margin: 20,
    marginTop: 36,
    marginBottom: 0,
  },
})


export default AboutUsScreen