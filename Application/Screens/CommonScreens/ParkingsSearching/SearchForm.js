import React, { useState, useLayoutEffect } from 'react'
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Pressable } from 'react-native'
import { Ionicons, MaterialIcons, } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import LoadingOverlay from '../LoadingOverlay';
import { Keyboard } from 'react-native'
import { Dimensions } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


function SearchForm({ navigation }) {

    const cars = ["Hatchback", "Sedan", "SUV"]
    const [car, setCar] = useState(cars[0])
    const [duration, setDuration] = useState(1)
    const [date, setDate] = useState(new Date())
    const [isDisplayDate, setShow] = useState(false);
    const [displaymode, setMode] = useState('date');
    const [clocation, setCLocation] = useState(null)
    const [city, setCity] = useState(null)
    const [keyboard, setKeyboard] = useState(false)
    const [status, setStatus] = useState("")
    const [tracking, setTracking] = useState(false)
    const [nsearch, setNSearch] = useState(false)

    const handleDate = () => {
        setShow(true);
        setMode('date');
    }
    const changeSelectedDate = (e, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false)
        setDate(currentDate);
    }
    const handleTime = () => {
        setShow(true);
        setMode('time');
    }
    const handleCitySearch = () => {

        if (parseFloat(duration) === 0) {
            Alert.alert(
                "Error",
                "Duartion is required !!"
            )
            return
        }
        else if (parseFloat(duration) % 1 !== 0 && parseFloat(duration) % 1 !== 0.5) {
            Alert.alert(
                "Error",
                "Duartion must be in multiple of 0.5 !!"
            )
            return
        }
        if (!city) {
            Alert.alert(
                "Error",
                "City is required to search by city"
                , [{ text: 'Okay', style: 'destructive' }]);
        }
        else {
            navigation.navigate("FindLocation", { car: car, city: city, duration: parseFloat(duration), date: date, nearby: false })
        }
    }
    const handleNearSearch = async () => {

        setNSearch(true)
        if (parseFloat(duration) === 0) {
            Alert.alert(
                "Error",
                "Duartion is required !!"
            )
            return
        }
        else if (parseFloat(duration) % 1 !== 0 && parseFloat(duration) % 1 !== 0.5) {
            Alert.alert(
                "Error",
                "Duartion must be in multiple of 0.5 !!"
            )
            return
        }
        if (status !== 'granted') {
            Alert.alert(
                "Sorry",
                "GPS is not working !!"
            )
        }
        else {
            if (clocation !== null) {
                navigation.navigate("FindLocation", { car: car, city: city, duration: parseFloat(duration), date: date, nearby: true, clocation: clocation, setTracking: setTracking })
            }
            else {
                try {
                    setTracking(true)
                    let location = await Location.getCurrentPositionAsync({});
                    setCLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
                    navigation.navigate("FindLocation", { car: car, city: city, duration: parseFloat(duration), date: date, nearby: true, clocation: { latitude: location.coords.latitude, longitude: location.coords.longitude }, setTracking: setTracking })
                }
                catch (error) {
                    Alert.alert("Oops", "Permission is denied !!")
                    setTracking(false)
                }
            }
        }
    }
    const isFocused = useIsFocused();
    useLayoutEffect(() => {
        var keyboardDidShowListener = null
        var keyboardDidHideListener = null
        if (isFocused) {
            (
                async () => {
                    setTracking(false)
                    keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => { setKeyboard(true) })
                    keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => { setKeyboard(false) })
                    let { status } = await Location.requestForegroundPermissionsAsync();
                    if (status !== 'granted') {

                    }
                    setStatus(status)
                    try {
                        let location = await Location.getCurrentPositionAsync({});
                        setCLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
                    }
                    catch (error) {
                        if (clocation == null) {
                            Alert.alert(
                                "Error",
                                "Search Nearby won't work without GPS"
                            )
                        }
                    }
                }
            )()
        };
    }, [isFocused]);


    if (tracking) {
        return <LoadingOverlay />
    }
    return (
        <ScrollView style={styles.screen}>
            <View style={styles.searchContainer}>
                <View style={styles.heading}>
                    <Text style={styles.header}>Search</Text>
                </View>


                <View style={[styles.inputContainter]}>
                    <View style={[styles.pickerContainter, { flexDirection: 'row' }]}>
                        <Ionicons name="car-sport-outline" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginHorizontal: 5, }} />
                        <Picker style={styles.picker} selectedValue={car} onValueChange={car => setCar(car)} dropdownIconColor="rgba(1,0,87,0.78)" mode="dialog">
                            {
                                cars.map(
                                    car => (
                                        <Picker.Item key={car} label={car} value={car} />
                                    )
                                )
                            }
                        </Picker>
                    </View>
                </View>
                {isDisplayDate && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={displaymode}
                        is24Hour={false}
                        display='default'
                        minimumDate={new Date()}
                        onChange={changeSelectedDate}
                    />
                )}
                <View style={styles.inputContainter}>
                    <View style={[styles.input, { flexDirection: 'row' }]}>
                        <MaterialIcons size={25} name="date-range" color="rgba(1,0,87,0.78)" style={{ marginTop: 16, marginHorizontal: 15, }} />
                        <TextInput style={[styles.entry, { width: Dimensions.get('window').width - 150, color: 'black' }]} editable={false} value={(date.getDate().toString().length < 2 ? ("0" + date.getDate().toString()) : date.getDate().toString()) + "-" + ((date.getMonth() + 1).toString().length < 2 ? ("0" + (date.getMonth() + 1).toString()) : (date.getMonth() + 1).toString()) + "-" + date.getFullYear()} />
                        <Feather name="edit-2" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginRight: 10, }} onPress={handleDate} />
                    </View>
                </View>
                <View style={styles.inputContainter}>
                    <View style={[styles.input, { flexDirection: 'row' }]}>
                        <Ionicons name="time" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 17, marginLeft: 18, marginRight: 10, }} />
                        <TextInput style={[styles.entry, { width: Dimensions.get('window').width - 150, color: 'black' }]} editable={false} value={date.getHours() + ":" + (date.getMinutes().toString().length < 2 ? ("0" + date.getMinutes().toString()) : date.getMinutes().toString()) + ((date.getHours() < 13) ? " AM" : " PM")} />
                        <Feather name="edit-2" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginRight: 10, }} onPress={handleTime} />
                    </View>
                </View>
                <View style={styles.inputContainter}>
                    <View style={[styles.input, { flexDirection: 'row' }]}>
                        <Octicons name="hourglass" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 17, marginLeft: 19, marginRight: 15, }} />
                        <TextInput style={styles.entry} keyboardType="numeric" value={keyboard ? String(duration) : String(duration) + " Hour"} onChangeText={duration => setDuration(duration)} />
                    </View>
                </View>
                <View style={styles.inputContainter}>
                    <View style={[styles.input, { flexDirection: 'row' }]}>
                        <MaterialCommunityIcons name="city-variant-outline" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 15, marginRight: 15, }} />
                        <TextInput style={styles.entry} value={city} onChangeText={city => { setCity(city) }} placeholder="Enter City (Optional)" />
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={[styles.bookcontainer, { marginBottom: 5, }]} android_ripple={{ color: 'white' }} onPress={e => handleCitySearch()}>
                        <Text style={styles.booktext}>Search By City</Text>
                    </Pressable>
                    <Pressable style={[styles.bookcontainer]} android_ripple={{ color: 'white' }} onPress={e => handleNearSearch()}>
                        <Text style={styles.booktext}>Search Nearby Me</Text>
                    </Pressable>
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
    searchContainer: {
        marginTop: 20,
    },
    pickerContainter: {
        height: 58,
        width: Dimensions.get('window').width - 55,
        backgroundColor: 'white',
        borderRadius: 50,
        paddingLeft: 10,
    },
    picker: {
        width: Dimensions.get('window').width - 100,
        borderRadius: 5,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopWidth: 1,
        height: 1,
        fontSize: 18,
    },
    heading: {
        alignItems: 'center',
        marginBottom: 10,
    },
    header: {
        color: 'rgba(1,0,87,0.78)',
        fontSize: 40,
        fontWeight: '500',
    },
    inputContainter: {
        padding: 5,
        marginTop: 20,
        flexDirection: 'row',
        marginLeft: (6 / 100) * (Dimensions.get('window').width),
    },
    input: {
        width: Dimensions.get('window').width - 55,
        height: 58,
        borderRadius: 50,
        backgroundColor: 'white',
    },
    entry: {
        width: Dimensions.get('window').width - 125,
        fontSize: 16,
    },
    shadow: {
        paddingLeft: 5,
        paddingTop: 5,
        borderRadius: 15,
        borderRadius: 5,
        width: Dimensions.get('window').width - 45,
        height: 58,
        elevation: 2,
        shadowColor: 'red',
    },
    date: {
        marginLeft: (10 / 100) * (Dimensions.get('window').width),
    },
    time: {
        marginLeft: (10 / 100) * (Dimensions.get('window').width),
    },
    city: {
        marginLeft: (10 / 100) * (Dimensions.get('window').width),
    },
    duration: {
        marginLeft: (10 / 100) * (Dimensions.get('window').width),
    },
    text: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    utilityContainter: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 30,
    },
    bookcontainer: {
        marginTop: 10,
        width: (88 / 100) * (Dimensions.get('window').width),
        height: 50,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: 'rgba(1,0,87,0.78)',
    },
    booktext: {
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 21,
        color: 'white',
    },
})



export default SearchForm