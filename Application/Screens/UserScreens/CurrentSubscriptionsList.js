import React, { useState, useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { View, Text, StyleSheet, FlatList, Pressable, Image, Modal, Animated } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import imgSource from '../../assets/Images/direction.png'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { userContext } from '../../App';
import { currentSubscriptions } from '../../Backend/Bookings/CurrentBookings';
import { useIsFocused } from '@react-navigation/native';
import LoadingOverlay from '../CommonScreens/LoadingOverlay';
import * as Location from 'expo-location';
import { Dimensions } from 'react-native';
import NoDataFound from '../CommonScreens/NoDataFound';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto, AntDesign } from '@expo/vector-icons';

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


function CurrentSubscriptionsList({ navigation, route }) {

    const currentUser = useContext(userContext)
    const [fetching, setFetching] = useState(true)

    const [tempBookings, setTempBookings] = useState(null)
    const [Bookings, setBookings] = useState(tempBookings)

    const isFocused = useIsFocused()
    useLayoutEffect(() => {
        const getCurrentSubscriptions = async () => {
            try {
                setFetching(true)
                let searchData = { userid: currentUser.user.id, datetime: new Date() }
                var bookings = await currentSubscriptions(searchData)
                setBookings(bookings)
                setTempBookings(bookings)
            }
            catch (error) {
                Alert.alert("Oops", "Something went wrong !!")
            }
            finally {
                setFetching(false)
            }
        }
        if (isFocused) {
            getCurrentSubscriptions()
        }
    }, [isFocused])

    const [visible, setVisible] = useState(false);

    const handleRoute = (id, item) => {
        (
            async () => {
                setFetching(true)
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert("Sorry", "Permission is denied !!")
                    return
                }
                try {
                    let location = await Location.getCurrentPositionAsync({});
                    navigation.navigate("DirectingRoute", { id: id, item: item, source: { latitude: location.coords.latitude, longitude: location.coords.longitude } })
                }
                catch (error) {
                    Alert.alert("Sorry", "Permission is denied !!")
                }
                finally {
                    setFetching(false)
                }
            }
        )()
    }

    const handleItem = (id, item) => {
        navigation.navigate("CurrentSubscriptionItem", { id: id, item: item })
    }

    const filterByFields = (booking) => {
        if (city) {
            if (!booking.city.match(city)) {
                // console.log("hello");
                return false;
            }
        }
        if (car) {
            if (!booking.car.match(car)) {
                return false;
            }
        }
        if (sdate) {
            if (booking.upcomingdate.toLocaleDateString() !== sdate.toLocaleDateString()) {
                return false;
            }
        }
        return true;
    }

    const handleFilter = () => {
        setVisible(false);
        setBookings(tempBookings.filter(filterByFields))
    }

    const handleClear = () => {
        setCity("")
        setCar("")
        setDate("")
    }

    const [car, setCar] = useState()
    const [city, setCity] = useState()
    const [sdate, setDate] = useState()
    const [isDisplayDate, setShow] = useState(false);
    const [displaymode, setMode] = useState('date');
    const handleDate = () => {
        setShow(true);
        setMode('date');
    }
    const changeSelectedDate = (e, selectedDate) => {
        const currentDate = selectedDate || sdate;
        setShow(false)
        setDate(currentDate);
    }

    const render = (itemData) => {
        return (
            <View>
                <Pressable android_ripple={{ color: 'rgb(168, 167, 163)' }} style={styles.locationitem}>
                    <View style={styles.parkingnameandcars}>
                        <View style={styles.header}>
                            <Text style={styles.parkingname}>{itemData.item.parkingname}</Text>
                            <Pressable android_ripple={{ color: 'rgb(168, 167, 163)', radius: 5 }} onPress={e => handleRoute(itemData.item.id, itemData.item)}>
                                <View style={styles.imgContainter}>
                                    <Image source={imgSource} style={styles.image}></Image>
                                </View>
                            </Pressable>
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.citytext}>City : </Text>
                                <Text style={styles.citytext}>{itemData.item.city}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.citytext}>Car : </Text>
                                <Text style={styles.citytext}>{itemData.item.car}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.citytext}>Upcoming Date : </Text>
                                <Text style={styles.citytext}>{(itemData.item.upcomingdate.getDate().toString().length < 2 ? ("0" + itemData.item.upcomingdate.getDate().toString()) : itemData.item.upcomingdate.getDate().toString()) + "-" + ((itemData.item.upcomingdate.getMonth() + 1).toString().length < 2 ? ("0" + (itemData.item.upcomingdate.getMonth() + 1).toString()) : (itemData.item.upcomingdate.getMonth() + 1).toString()) + "-" + itemData.item.upcomingdate.getFullYear()}</Text>
                            </View>
                            <View style={styles.lastrow}>
                                <View style={{ flexDirection: 'row' }}>
                                    {
                                        itemData.item.days.map((day, index) =>
                                            <Text key={index} style={[{ color: 'black' }, styles.daytext]}>{day}</Text>)
                                    }
                                </View>
                                <Pressable android_ripple={{ color: 'rgb(168, 167, 163)', radius: 5 }} onPress={e => handleItem(itemData.item.id, itemData.item)}>
                                    <Text style={styles.knowmore}>{"Know More >>"}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </View>
        )
    }

    if (fetching) {
        return <LoadingOverlay />
    }
    return (
        Bookings ?
            <View style={styles.screen}>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 15, marginRight: 20 }}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'rgba(1,0,87,0.78)' }}>Filter </Text>
                        <Fontisto style={{ marginTop: 5, }} name="filter" size={24} color='rgba(1,0,87,0.78)' onPress={() => { setVisible(true) }} />
                    </View>
                    <ModalPopup visible={visible}>
                        <View style={styles.modalheader}>
                            <AntDesign name="close" size={24} color="rgba(1,0,87,0.78)" onPress={() => setVisible(false)} />
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.searchcontainer}>
                                <View style={styles.inputContainter}>
                                    <View style={[styles.input, { flexDirection: 'row' }]}>
                                        <MaterialCommunityIcons name="city-variant-outline" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 15, marginRight: 15, }} />
                                        <TextInput style={styles.entry} value={city} onChangeText={city => setCity(city)} placeholder='Enter City (Optional)'></TextInput>
                                    </View>
                                </View>
                                <View style={styles.inputContainter}>
                                    <View style={[styles.input, { flexDirection: 'row' }]}>
                                        <Ionicons name="car-sport-outline" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginHorizontal: 15, }} />
                                        <TextInput style={styles.entry} value={car} onChangeText={car => setCar(car)} placeholder='Enter Car (Optional)'></TextInput>
                                    </View>
                                </View>
                                {isDisplayDate && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={sdate ? sdate : new Date()}
                                        mode={displaymode}
                                        is24Hour={false}
                                        display='default'
                                        minimumDate={new Date()}
                                        onChange={changeSelectedDate}
                                    />
                                )}
                                <View style={styles.inputContainter}>
                                    <Pressable style={[styles.input, { flexDirection: 'row' }]} onPress={handleDate}>
                                        <MaterialIcons name="date-range" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 15, marginRight: 15, }} />
                                        <TextInput style={[styles.entry, { color: 'black' }]} editable={false} value={sdate ? (sdate.getDate().toString().length < 2 ? ("0" + sdate.getDate().toString()) : sdate.getDate().toString()) + "-" + ((sdate.getMonth() + 1).toString().length < 2 ? ("0" + (sdate.getMonth() + 1).toString()) : (sdate.getMonth() + 1).toString()) + "-" + sdate.getFullYear() : ""} placeholder="Enter Date (Optional)" />
                                    </Pressable>
                                </View>
                                <View style={{ marginTop: 20, marginBottom: 10, }}>
                                    <Pressable style={styles.applycontainer} android_ripple={{ color: 'white' }} onPress={e => handleClear()}>
                                        <Text style={styles.applytext}>Clear</Text>
                                    </Pressable>
                                    <Pressable style={styles.applycontainer} android_ripple={{ color: 'white' }} onPress={e => handleFilter()}>
                                        <Text style={styles.applytext}>Apply</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </ScrollView>
                    </ModalPopup>
                    {Bookings.length !== 0 ?
                        <View style={styles.locationcontainer}>
                            <FlatList showsVerticalScrollIndicator={false} data={Bookings} renderItem={(itemData) => render(itemData)} keyExtractor={(item) => item.id} />
                        </View> : <NoDataFound />}
                </View></View> : <NoDataFound />
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#E8F4F8',
    },
    container: {
        flex: 1,
        marginHorizontal: 2,
        marginBottom: 20,
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
    searchcontainer: {
        justifyContent: 'center',
        marginHorizontal: 10,
        marginVertical: 20,
    },
    locationcontainer: {
        borderColor: 'black',
        flex: 1,
        marginTop: 10,
        margin: 5,
    },
    locationitem: {
        marginTop: 10,
        borderRadius: 10,
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(1,0,87,0.78)',
        margin: 5,
        padding: 10,
        backgroundColor: 'white',
        elevation: 2,
    },
    parkingname: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
    },
    parkingnameandcars: {
        flexBasis: '100%',
    },
    carcontainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imgContainter: {
        width: 25,
        height: 25,
        marginTop: 7,
        marginRight: 7,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    citytext: {
        fontSize: 15,
    },
    cartext: {
        fontSize: 15,
        marginHorizontal: 10,
    },
    daytext: {
        fontSize: 15,
        marginRight: 5,
    },
    datetext: {
        fontSize: 15,
    },
    lastrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    knowmore: {
        marginRight: 2,
        color: 'rgba(1,0,87,0.78)',
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
        width: Dimensions.get('window').width - 187,
        fontSize: 16,
    },
})


export default CurrentSubscriptionsList