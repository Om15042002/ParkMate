import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Image, StyleSheet, Text, TextInput, View, ScrollView, Pressable, Modal, Animated, Alert } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { changeCarNumber } from '../../Backend/Bookings/CurrentBookings';
import { cancelBooking } from '../../Backend/Bookings/CurrentBookings';
import { checkAvailibilityForEdit } from '../../Backend/Searching/SearchParkings'
import { Keyboard } from 'react-native'
import { Dimensions } from 'react-native';
import LoadingOverlay from '../CommonScreens/LoadingOverlay';
import { Ionicons, FontAwesome, FontAwesome5, MaterialIcons, Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const ModalPopup = ({ visible, children }) => {

  const [show, setShow] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const toggleModal = () => {
    if (visible) {
      setShow(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    else {
      setTimeout(() => setShow(false), 200)
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }
  useEffect(() => {
    toggleModal();
  }, [visible])
  return (
    <Modal transparent visible={show}>
      <View style={styles.modalbackground}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.modalcontainer, { transform: [{ scale: scaleValue }] }]}>
            {children}
          </Animated.View>
        </ScrollView>
      </View>
    </Modal>
  )

}

function CurrentBookingItem({ route, navigation }) {

  const [change, setChanging] = useState(false)
  const [visible, setVisible] = useState(false)
  const [carnumber, setCarNumber] = useState(route.params.item.carnumber)
  const [tempcarnumber, setTempCarNumber] = useState(route.params.item.carnumber)
  const [duration, setDuration] = useState(route.params.item.duration)
  const [time, setTime] = useState(route.params.item.date)
  const [isDisplayDate, setShow] = useState(false);
  const [displaymode, setMode] = useState('date');
  const [keyboard, setKeyboard] = useState(false)
  useLayoutEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => { setKeyboard(true) })
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => { setKeyboard(false) })
    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  const handleTime = () => {
    setShow(true);
    setMode('time');
  }
  const changeSelectedDate = (e, selectedTime) => {
    const currentTime = selectedTime || time;
    setShow(false)
    setTime(currentTime);
  }

  const handleCancel = async () => {
    try {
      setChanging(true)
      let res = await cancelBooking({ bookingid: route.params.item.id, date: route.params.item.date, datetime: (new Date()).setSeconds(0) })
      if (res) {
        Alert.alert("Sucees", "Your booking has been cancelled", [
          {
            text: 'Okay', onPress: () => {
              navigation.navigate("CurrentBookingsList")
            }
          }
        ],
          { cancelable: false })
      }
      else {
        Alert.alert('Oops', "Something went wrong !!")
      }
    } catch (error) {
      Alert.alert('Oops', "Something went wrong !!")
    }
    finally {
      setChanging(false)
    }
  }
  const handleEdit = async () => {
    setVisible(false);
    if (!duration || duration == 0) {
      Alert.alert("Sorry", "Duration cant't be 0")
      return
    }
    if ((time !== route.params.item.date) && (route.params.item.date <= (new Date()).setSeconds(0))) {
      Alert.alert('Sorry', "You can't edit your time of booking now !!")
      return
    }
    if (duration == route.params.item.duration && tempcarnumber == carnumber && (time == route.params.item.date)) {
    }
    else if (duration == route.params.item.duration && (time == route.params.item.date)) {
      try {
        setChanging(true)
        let res = await changeCarNumber({ bookingid: route.params.item.id, carnumber: tempcarnumber });
        if (res) {
          Alert.alert('Okay', "Your car number is updated !!")
          setCarNumber(tempcarnumber)
        }
      } catch (error) {
        Alert.alert('Oops', "Something went wrong !!")
      }
      finally {
        setChanging(false)
      }
    }
    else {
      try {
        setChanging(true)
        let checkingData = { bookingid: route.params.item.id, parkingid: route.params.item.parkingid, datetime: time, duration: duration, car: route.params.item.car, carnumber: tempcarnumber }
        let available = await checkAvailibilityForEdit(checkingData)
        if (available) {
          Alert.alert("Sucees", "Your booking is updated", [
            {
              text: 'Okay', onPress: () => {
                navigation.navigate("CurrentBookingsList")
              }
            }
          ],
            { cancelable: false })
        }
        else {
          Alert.alert("Sorry", "Parking is full !!")
        }

      } catch (error) {
        Alert.alert("Oops", "Something went wrong !!")
      }
      finally {
        setChanging(false)
      }
    }
  }


  const handleReset = () => {
    setTempCarNumber(carnumber)
    setDuration(route.params.item.duration)
    setTime(route.params.item.date)
  }

  if (change) {
    return <LoadingOverlay />
  }
  return (
    <ScrollView style={styles.screen}>
      <ModalPopup visible={visible}>
        <View style={styles.modalheader}>
          <AntDesign name="close" size={24} color="rgba(1,0,87,0.78)" onPress={() => setVisible(false)} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.searchcontainer}>
            <View style={styles.inputContainter}>
              <View style={[styles.input, { flexDirection: 'row' }]}>
                <Octicons name="hourglass" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 17, marginLeft: 15, marginRight: 15, }} />
                <TextInput style={styles.entry} value={keyboard ? String(duration) : String(duration) + " Hour"} onChangeText={duration => setDuration(duration)} placeholder='Enter Duration In Hour'></TextInput>
              </View>
            </View>
            <View style={styles.inputContainter}>
              <View style={[styles.input, { flexDirection: 'row' }]}>
                <MaterialCommunityIcons name="car-info" size={26} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 10, marginRight: 11, }} />
                <TextInput style={styles.entry} value={tempcarnumber} onChangeText={carnumber => setTempCarNumber(carnumber)} placeholder='Enter New Car Number'></TextInput>
              </View>
            </View>
            {isDisplayDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={route.params.item.date}
                mode={displaymode}
                is24Hour={false}
                display='default'
                minimumDate={route.params.item.date}
                onChange={changeSelectedDate}
              />
            )}
            <View style={styles.inputContainter}>
              <Pressable style={[styles.input, { flexDirection: 'row' }]} onPress={handleTime}>
                <Ionicons name="time" size={26} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 12, marginRight: 8, }} />
                <TextInput style={[styles.entry, { color: 'black' }]} editable={false} value={time.getHours() + ":" + (time.getMinutes().toString().length < 2 ? ("0" + time.getMinutes().toString()) : time.getMinutes().toString()) + ((time.getHours() < 13) ? " AM" : " PM")} />
              </Pressable>
            </View>
            <View style={{ marginTop: 20, marginBottom: 10, }}>
              <Pressable style={styles.applycontainer} android_ripple={{ color: 'white' }} onPress={e => handleReset()}>
                <Text style={styles.applytext}>Reset</Text>
              </Pressable>
              <Pressable style={styles.applycontainer} android_ripple={{ color: 'white' }} onPress={e => handleEdit()}>
                <Text style={styles.applytext}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ModalPopup>
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
            <MaterialCommunityIcons name="car-info" size={30} color="rgba(1,0,87,0.78)" style={{ marginLeft: 20, marginRight: 20, }} />
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.rowTextInfo1}>Car Number</Text>
              <Text style={styles.rowTextInfo2}>{carnumber}</Text>
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
          <View style={{ marginTop: 40, marginBottom: 0, }}>
            <View style={styles.btnconcontainer}>
              <Pressable android_ripple={{ color: 'white' }} style={styles.editcontainer} onPress={e => setVisible(true)}>
                <Text style={styles.edittext}>Edit</Text>
              </Pressable>
            </View>
            <View style={styles.btnconcontainer}>
              <Pressable android_ripple={{ color: 'white' }} style={styles.cancelcontainer} onPress={e => handleCancel()}>
                <Text style={styles.canceltext}>Cancel</Text>
              </Pressable>
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
  modalbackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingTop: (20 / 100) * (Dimensions.get('window').height),
  },
  modalcontainer: {
    marginLeft: '10.5%',
    width: '80%',
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  modalheader: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  searchcontainer: {
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  parkingContainter: {
    flex: 1,
    marginTop: 50,
    marginBottom: 50,
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
    borderColor: 'rgba(1,0,87,0.78)',
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
    marginLeft: (10 / 100) * (Dimensions.get('window').width),
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
    marginLeft: '2.5%',
  },
  cancelcontainer: {
    marginTop: 15,
    width: (80 / 100) * (Dimensions.get('window').width),
    height: 40,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'red',
  },
  canceltext: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 21,
    color: 'white',
  },
  editcontainer: {
    marginTop: 20,
    width: (80 / 100) * (Dimensions.get('window').width),
    height: 40,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'red',
  },
  edittext: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 21,
    color: 'white',
  },
  input: {
    paddingLeft: 5,
    minWidth: 200,
    maxWidth: 500,
    minHeight: 37,
    maxHeight: 40,
    borderColor: 'black',
    borderRadius: 10,
    borderBottomWidth: 2,
    color: 'black',
  },
  sctfield: {
    marginTop: 10,
  },
  scrfield: {
    marginVertical: 10,
  },
  sdfield: {
    marginBottom: 10,
  },
  text: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  applycontainer: {
    marginTop: 20,
    minWidth: 200,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'red',
  },
  applytext: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
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
  editcontainer: {
    marginTop: 10,
    width: (90 / 100) * (Dimensions.get('window').width),
    height: 50,
    marginLeft: (0 / 100) * (Dimensions.get('window').width),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: 'rgba(1,0,87,0.78)',
  },
  edittext: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 21,
    color: 'white',
  },
  cancelcontainer: {
    marginTop: 10,
    width: (90 / 100) * (Dimensions.get('window').width),
    height: 50,
    marginLeft: (0 / 100) * (Dimensions.get('window').width),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: 'rgba(1,0,87,0.78)',
  },
  canceltext: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 21,
    color: 'white',
  },
  applycontainer: {
    marginTop: 10,
    width: (71 / 100) * (Dimensions.get('window').width),
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: 'rgba(1,0,87,0.78)',
    marginLeft: 18,
    marginLeft: (2 / 100) * (Dimensions.get('window').width),
  },
  applytext: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 21,
    color: 'white',
  },
  inputContainter: {
    padding: 5,
    marginTop: 10,
    flexDirection: 'row',
    marginLeft: (2 / 100) * (Dimensions.get('window').width),
  },
  input: {
    width: Dimensions.get('window').width - 123,
    height: 58,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  entry: {
    width: Dimensions.get('window').width - 185,
    fontSize: 16,
  },
  modalbackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingTop: (20 / 100) * (Dimensions.get('window').height),
  },
  modalcontainer: {
    marginLeft: '10.5%',
    width: '80%',
    height: '100%',
    backgroundColor: '#E8F4F8',
    paddingTop: 30,
    borderRadius: 20,
    elevation: 20,
  },
  modalheader: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
})

export default CurrentBookingItem