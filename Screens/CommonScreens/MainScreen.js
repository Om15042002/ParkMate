import React, { useState, useLayoutEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, Alert, ImageBackground } from 'react-native'
import { Dimensions } from 'react-native'
import users from '../../assets/Images/users.png'
import parking from '../../assets/Images/parking.png'
import bparking from '../../assets/Images/bparking.png'
import booking from '../../assets/Images/booking.png'
import providers from '../../assets/Images/providers.png'
import revenue from '../../assets/Images/revenue.png'
import { getData } from '../../Backend/HomePages/Visitor'
import LoadingOverlay from './LoadingOverlay'
import { useIsFocused } from '@react-navigation/native'

function MainScreen() {

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const isFocused = useIsFocused()
  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        let res = await getData()
        setData(res)
      }
      catch (error) {
        Alert.alert("Oops", "Something went wrong !!")
      }
      finally {
        setLoading(false)
      }
    }
    if (isFocused) {
      fetchData();
    }
  }, [isFocused])
  if (loading) {
    return <LoadingOverlay />
  }
  return (
    <ImageBackground source={bparking} resizeMode="stretch" style={{ flex: 1, justifyContent: 'center' }} imageStyle={{ opacity: 0.8, }}>
      {data ?
        <ScrollView style={styles.screen}>
          <View style={styles.container}>
            <View style={styles.public}>
              <View style={styles.quote}>
                <Text style={styles.primequote}>Looking For The Parking ?</Text>
                <Text style={styles.secondquote}>You are at the right place !!</Text>
              </View>
              <View style={styles.servicestyle}>
                <View style={[styles.serviceimagestyle, { marginTop: 3 }]}>
                  <Image
                    style={{ height: 65, width: 65 }}
                    source={users}
                  ></Image>
                </View>
                <View style={styles.servicecontentstyle}>
                  <Text style={styles.servicetitle}>{(data[0] - 1) > 0 ? `${data[0] - 1}+  Users` : `${data[0]}  Users`}</Text>
                </View>
              </View>
              <View style={styles.servicestyle}>
                <View style={styles.serviceimagestyle}>
                  <Image
                    style={{ height: 70, width: 70 }}
                    source={parking}
                  ></Image>
                </View>
                <View style={styles.servicecontentstyle}>
                  <Text style={styles.servicetitle}>{(data[1] - 1) > 0 ? `${data[1] - 1}+  Parkings` : `${data[1]}  Parkings`}</Text>
                </View>
              </View>
              <View style={styles.servicestyle}>
                <View style={styles.serviceimagestyle}>
                  <Image
                    style={{ height: 70, width: 70 }}
                    source={booking}
                  ></Image>
                </View>
                <View style={styles.servicecontentstyle}>
                  <Text style={styles.servicetitle}>{(data[2] - 1) > 0 ? `${data[2] - 1}+  Bookings` : `${data[2]}  Bookings`}</Text>
                </View>
              </View>
            </View>
            <View style={styles.provider}>
              <View style={[styles.quote, { marginTop: 30, }]}>
                <Text style={styles.primequote}>Want To Provide Parking ?</Text>
                <Text style={styles.secondquote}>You are at the right place !!</Text>
              </View>
              <View style={styles.servicestyle}>
                <View style={styles.serviceimagestyle}>
                  <Image
                    style={{ height: 70, width: 70 }}
                    source={providers}
                  ></Image>
                </View>
                <View style={styles.servicecontentstyle}>
                  <Text style={styles.servicetitle}>{(data[3] - 1) > 0 ? `${data[3] - 1}+  Providers` : `${data[3]}  Providers`}</Text>
                </View>
              </View>
              <View style={styles.servicestyle}>
                <View style={[styles.serviceimagestyle, { marginTop: 3 }]}>
                  <Image
                    style={{ height: 65, width: 65 }}
                    source={revenue}
                  ></Image>
                </View>
                <View style={styles.servicecontentstyle}>
                  <Text style={styles.servicetitle}>{(data[4] - 1) > 0 ? `Rs. ${data[4] - 1}+  Revenue` : `${data[4]}  Revenue`}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView> : null}
    </ImageBackground>


  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 30,
    marginBottom: 20,
  },
  quote: {
    marginLeft: (5 / 100) * (Dimensions.get('window').width),
    marginBottom: 16,
  },
  primequote: {
    fontWeight: '800',
    fontSize: 23,
    color: 'rgba(1,0,87,0.78)',
    color: 'white',
  },
  secondquote: {
    fontWeight: '500',
    fontSize: 16,
    color: 'rgba(1,0,87,0.78)',
    color: 'white',
  },
  servicestyle: {
    flex: 1,
    flexDirection: "row",
    alignContent: 'flex-start',
    minHeight: '14%',
    width: '88%',
    borderColor: 'black',
    elevation: 2,
    shadowColor: '#52006A',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 15,
    marginVertical: 5,
    marginLeft: (7 / 100) * (Dimensions.get('window').width),
  },
  serviceimagestyle: {
    flexBasis: '25%',
    marginLeft: 30
  },
  servicecontentstyle: {
    flexBasis: '57%',
    marginLeft: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  servicetitle: {
    fontSize: 20,
    alignSelf: 'center',
    fontWeight: '450',
    justifyContent: 'center',
  },
})


export default MainScreen