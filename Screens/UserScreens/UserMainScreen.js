import React, { useContext, useState, useLayoutEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native'
import { Dimensions } from 'react-native'
import * as Location from 'expo-location'
import bparking from '../../assets/Images/bparking.png'
import bookings from '../../assets/Images/booking.png'
import subscriptions from '../../assets/Images/subscription.png'
import LoadingOverlay from '../CommonScreens/LoadingOverlay'
import { getData } from '../../Backend/HomePages/Public'
import { userContext } from '../../App';
import NoDataFound2 from '../CommonScreens/NoDataFound2'
import PermissionDenied from './PermissionDenied'
import starImageFilled from '../../assets/Images/fillstar.png'
import starImageCorner from '../../assets/Images/emptystar.png'
import { useIsFocused } from '@react-navigation/native'

function UserMainScreen() {
  const currentUser = useContext(userContext)
  const [loading, setLoading] = useState(true)
  const [permission, setPermission] = useState(true)
  const [data, setData] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const isFocused = useIsFocused()
  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {

        }
        let location = await Location.getCurrentPositionAsync({});
        setPermission(true)
        let res = await getData(currentUser.user.id, { latitude: location.coords.latitude, longitude: location.coords.longitude })
        setData(res)
      }
      catch (error) {
        try {
          setPermission(false)
          let res = await getData(currentUser.user.id, null)
          setData(res)
        }
        catch (error) {
          Alert.alert("Oops", "Something went wrong !!")
        }
      }
      finally {
        setLoading(false)
      }
    }
    if (isFocused) {
      fetchData();
    }
  }, [refresh, isFocused])

  if (loading) {
    return <LoadingOverlay />
  }
  const maxRating = [1, 2, 3, 4, 5]
  const CustomRatingBar = ({ rating }) => {
    return (
      <View style={styles.customRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => { }}>
              <Image
                style={styles.starImageStyle}
                source={
                  item <= rating
                    ? starImageFilled
                    : starImageCorner
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  return (
    <ImageBackground source={bparking} resizeMode="stretch" style={{ flex: 1, justifyContent: 'center' }} imageStyle={{ opacity: 0.8, }}>
      {data ?
        <ScrollView style={styles.screen}>
          <View style={styles.container}>
            <View style={styles.public}>
              <View style={styles.quote}>
                <Text style={styles.primequote}>Your Statistics</Text>
              </View>
              <View style={styles.servicestyle}>
                <View style={[styles.serviceimagestyle, { marginTop: 0, }]}>
                  <Image
                    style={{ height: 70, width: 70 }}
                    source={bookings}
                  ></Image>
                </View>
                <View style={styles.servicecontentstyle}>
                  <Text style={styles.servicetitle}>{`${data[0]}  Bookings`}</Text>
                </View>
              </View>
              <View style={styles.servicestyle}>
                <View style={styles.serviceimagestyle}>
                  <Image
                    style={{ height: 70, width: 70 }}
                    source={subscriptions}
                  ></Image>
                </View>
                <View style={styles.servicecontentstyle}>
                  <Text style={styles.servicetitle}>{`${data[1]}  Subscriptions`}</Text>
                </View>
              </View>
            </View>
            <View style={styles.parking}>
              <View style={[styles.quote, { marginTop: 35, }]}>
                <Text style={styles.primequote}>Top Parkings Near You</Text>
              </View>
              <View>
                {
                  data[2] ?
                    data[2].map(
                      (location, index) => (
                        <View style={styles.locationitem} key={index}>
                          <View style={styles.parkingnameandcars}>
                            <Text style={styles.parkingname}>{location.servicename}</Text>
                            <CustomRatingBar rating={location.ratings} />
                            <View style={[{ marginTop: 10 }]}>
                              <View style={styles.carcontainer}>
                                {
                                  location.cartype.map(
                                    (car, index) => (
                                      <View key={index} style={styles.car}>
                                        <Text style={styles.cartext}>{car}</Text>
                                      </View>
                                    )
                                  )
                                }
                              </View>
                            </View>
                          </View>
                        </View>
                      )
                    ) : (permission ? <NoDataFound2 /> : <PermissionDenied refresh={refresh} setRefresh={setRefresh} />)
                }
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
    flexBasis: '62%',
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
  locationitem: {
    flex: 1,
    marginTop: 10,
    marginLeft: (7 / 100) * (Dimensions.get('window').width),
    borderRadius: 5,
    width: '88%',
    padding: 10,
    borderColor: 'black',
    elevation: 2,
    shadowColor: '#52006A',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingLeft: 15,
    paddingVertical: 10,
  },
  parkingname: {
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 5,
  },
  customRatingBarStyle: {
    flexDirection: 'row',
    marginTop: 0,
  },
  starImageStyle: {
    width: 21,
    height: 21,
    resizeMode: 'cover',
    marginRight: 5,
  },
  rating: {
    marginTop: 10,
    marginLeft: 5,
    marginBottom: 20,
    fontSize: 20,
    color: 'grey'
  },
  carcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  car: {
    alignItems: 'center',
    marginTop: 7,
    marginBottom: 5,
    marginRight: 15,
  },
  cartext: {
    fontSize: 15,
  },
})


export default UserMainScreen