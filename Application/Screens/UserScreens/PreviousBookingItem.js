import React, { useEffect, useRef, useState } from 'react'
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { changeRatings } from '../../Backend/Bookings/ChangeRating';
import { Dimensions } from 'react-native';
import LoadingOverlay from '../CommonScreens/LoadingOverlay';
import { Ionicons, FontAwesome, FontAwesome5, MaterialIcons, Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import starImageFilled from '../../assets/Images/fillstar.png'
import starImageCorner from '../../assets/Images/emptystar.png'

function PreviousBookingItem({ route }) {

  const [defaultRating, setDefaultRating] = useState(route.params.item.rating);
  const [currentRating, setCurrentRating] = useState(route.params.item.rating);
  const [change, setChanging] = useState(false)
  const ratingRef = useRef()
  ratingRef.current = defaultRating
  const maxRating = [1, 2, 3, 4, 5];
  const annotaions = ["No Ratings !!", "Terrible", "Bad", "Average", "Good", "Great"]

  useEffect(() => {
    if (ratingRef.current !== currentRating) {
      const ratingChange = async () => {
        try {
          setChanging(true)
          setCurrentRating(ratingRef.current)
          let res = await changeRatings({ oldrating: route.params.item.rating, newrating: ratingRef.current, parkingid: route.params.item.parkingid, bookingid: route.params.item.id })
          if (res) {
            Alert.alert("Success", "Rating has been changed")
          }
          else {
            Alert.alert("Oops", "Rating cant' be changed")
          }
        } catch (error) {
          Alert.alert("Oops", "Rating cant' be changed")
        }
        finally {
          setChanging(false)
        }
      }
      ratingChange()
    }

  }, [defaultRating])

  const CustomRatingBar = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setDefaultRating(item)}>
              <Image
                style={styles.starImageStyle}
                source={
                  item <= defaultRating
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
  if (change) {
    return <LoadingOverlay />
  }
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.parkingContainter}>
        <View style={styles.parking}>
          <View style={styles.imgContainter}>
            <Image source={{ uri: `data:image/gif;base64,${route.params.item.areaimage}` }} style={styles.image}></Image>
          </View>
          <Text style={styles.name}>{route.params.item.parkingname}</Text>
        </View>
        <View style={styles.parkingInfo}>
          <View style={styles.row}>
            <FontAwesome5 name="user" size={27} color="rgba(1,0,87,0.78)" style={{ marginLeft: 24, marginRight: 22, }} />
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.rowTextInfo1}>Provider Name</Text>
              <Text style={styles.rowTextInfo2}>{route.params.item.providername}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Ionicons name="car-sport" size={30} color="rgba(1,0,87,0.78)" style={{ marginHorizontal: 20, }} />
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.rowTextInfo1}>Car Type</Text>
              <Text style={styles.rowTextInfo2}>{route.params.item.car}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <MaterialIcons size={30} name="date-range" color="rgba(1,0,87,0.78)" style={{ marginHorizontal: 20, }} />
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.rowTextInfo1}>Date</Text>
              <Text style={styles.rowTextInfo2}>{(route.params.item.date.getDate().toString().length < 2 ? ("0" + route.params.item.date.getDate().toString()) : route.params.item.date.getDate().toString()) + "-" + ((route.params.item.date.getMonth() + 1).toString().length < 2 ? ("0" + (route.params.item.date.getMonth() + 1).toString()) : (route.params.item.date.getMonth() + 1).toString()) + "-" + route.params.item.date.getFullYear()}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Ionicons name="time" size={30} color="rgba(1,0,87,0.78)" style={{ marginLeft: 20, marginRight: 20, }} />
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.rowTextInfo1}>Time</Text>
              <Text style={styles.rowTextInfo2}>{route.params.item.date.getHours() + ":" + (route.params.item.date.getMinutes().toString().length < 2 ? ("0" + route.params.item.date.getMinutes().toString()) : route.params.item.date.getMinutes().toString()) + ((route.params.item.date.getHours() < 13) ? " AM" : " PM")}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Octicons name="hourglass" size={30} color="rgba(1,0,87,0.78)" style={{ marginLeft: 22, marginRight: 25, }} />
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.rowTextInfo1}>Duration</Text>
              <Text style={styles.rowTextInfo2}>{route.params.item.duration} Hour</Text>
            </View>
          </View>
          <View style={styles.row}>
            <FontAwesome name="rupee" size={30} color="rgba(1,0,87,0.78)" style={{ marginLeft: 25, marginRight: 27, }} />
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.rowTextInfo1}>Payment</Text>
              <Text style={styles.rowTextInfo2}>{route.params.item.payment} Rs</Text>
            </View>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="city-variant-outline" size={30} color="rgba(1,0,87,0.78)" style={{ marginLeft: 17, marginRight: 20, }} />
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.rowTextInfo1}>City</Text>
              <Text style={styles.rowTextInfo2}>{route.params.item.city}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Octicons name="location" size={32} color="rgba(1,0,87,0.78)" style={{ marginLeft: 20, marginRight: 22, }} />
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.rowTextInfo1}>Address</Text>
              <Text style={styles.rowTextInfo2}>{route.params.item.address}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Feather name="star" size={30} color="rgba(1,0,87,0.78)" style={{ marginLeft: 19, marginRight: 15, }} />
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.rowTextInfo1}>Your Ratings</Text>
              <View>
                <CustomRatingBar />
                <Text style={styles.rating}>{annotaions[defaultRating]}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  parkingContainter: {
    flex: 1,
    marginTop: 50,
    marginBottom: 30,
  },
  parking: {
    alignItems: 'center',
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'rgba(1,0,87,0.78)'
  },
  imgContainter: {
    width: 250,
    height: 250,
    overflow: 'hidden',
    borderRadius: 125,
    borderWidth: 3,
    borderColor: 'rgba(1,0,87,0.78)'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  parkingInfo: {
    marginTop: 40,
    paddingLeft: (2.5 / 100) * (Dimensions.get('window').width)
  },
  row: {
    flexDirection: 'row',
    marginBottom: 7,
    marginLeft: (9 / 100) * (Dimensions.get('window').width),
  },
  rowhead: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
  },
  rowinfo: {
    fontSize: 18,
    marginBottom: 20,
    width: Dimensions.get('window').width - 200,
  },
  listitem: {
    fontSize: 18,
  },
  btnconcontainer: {
    flex: 1,
    marginVertical: 25,
    alignItems: 'center'
  },
  bookcontainer: {
    minWidth: 150,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'red',
  },
  booktext: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 21,
    color: 'white',
  },
  customRatingBarStyle: {
    flexDirection: 'row',
    marginTop: 10,
  },
  starImageStyle: {
    width: 35,
    height: 35,
    resizeMode: 'cover',
    marginRight: 5,
  },
  rating: {
    marginTop: 10,
    marginLeft: 5,
    fontSize: 20,
    color: 'grey'
  },
  row: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 38,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 20,
  },
  rowTextInfo1: {
    fontSize: 17,
    fontWeight: 'bold',
    width: Dimensions.get('window').width - 120,
    alignSelf: 'center',
    marginBottom: 5,
  },
  rowTextInfo2: {
    fontSize: 17,
    width: Dimensions.get('window').width - 120,
    alignSelf: 'center',
  },
})

export default PreviousBookingItem