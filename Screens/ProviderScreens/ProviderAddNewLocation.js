import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import * as React from 'react';
import MapView, { Callout, Marker } from 'react-native-maps';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    ScrollView,
    Image, TextInput, Pressable, Alert, Modal, Animated
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { CheckBox } from 'react-native-elements'
import Success from '../../assets/Images/success.png'
import { registerNewParking } from '../../Backend/ParkingAreas/AllAboutAreas';
import { userContext } from '../../App';
import LoadingOverlay from '../CommonScreens/LoadingOverlay';
import { AntDesign } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const RatesInputscreen = ({ rateinput, newareainformation, children }) => {
    const [showModal, setShowModal] = useState(rateinput);
    const scalevalue = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        toggleModal();
    }, [rateinput])
    const toggleModal = () => {
        if (rateinput) {
            setShowModal(true);
            Animated.spring(scalevalue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
        else {
            setShowModal(false);
            Animated.timing(scalevalue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }

    return (
        <Modal transparent visible={showModal}>
            <View style={[styles.modalbackground2]}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <Animated.View style={[styles.modalcontainer2]}>
                        {children}
                    </Animated.View>
                </ScrollView>
            </View>
        </Modal>
    )
};

const PickNewAreaLocation = ({ picklocation, children }) => {
    const [showModal, setShowModal] = useState(picklocation);
    const scalevalue = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        toggleModal();
    }, [picklocation])
    const toggleModal = () => {
        if (picklocation) {
            setShowModal(true);
            Animated.spring(scalevalue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
        else {
            setShowModal(false);
            Animated.timing(scalevalue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }

    return (
        <Modal transparent visible={showModal}>
            <View style={[styles.modelBackGroundArea]}>
                <View style={[styles.modelContainerArea]}>
                    {children}
                </View>
            </View>
        </Modal>
    )
};


const SuccessfullMessage = ({ visible, children }) => {
    const [showModal, setShowModal] = useState(visible);

    const scalevalue = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
        toggleModal();
    }, [visible])
    const toggleModal = () => {
        if (visible) {
            setShowModal(true);
            Animated.spring(scalevalue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
        else {
            setShowModal(false);
            Animated.timing(scalevalue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }

    return (
        <Modal transparent visible={showModal}>
            <View style={styles.modelBackGround}>
                <View style={[styles.modelContainer]}>
                    {children}
                </View>
            </View>
        </Modal>
    )
};




function ProviderAddNewLocation() {

    const currentUser = React.useContext(userContext)
    const [visible, setVisible] = useState(false)
    const [rateinput, setRateInput] = useState(false);
    const [picklocation, setPickLocation] = useState(false);
    const [pin, setPin] = useState({
        latitude: 22.555782,
        longitude: 72.954144,
    });
    const [erate, setErate] = useState(false)
    const [eloc, setELoc] = useState(false)
    const [clocation, setCLocation] = useState(pin);
    const [submiting, setSubmiting] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            // mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.cancelled) {
            setNewAreaInformation({ ...newareainformation, "areaimage": result.assets[0].base64 })
        }
    };
    const [newareainformation, setNewAreaInformation] = useState({
        "servicename": "",
        "address": "",
        "city": "",
        "location": null,
        "areaimage": null,
        "Hatchback": false,
        "Sedan": false,
        "SUV": false,
        "Hatchbackrate": 0,
        "Sedanrate": 0,
        "SUVrate": 0,
        "Hatchbackcapacity": 0,
        "Sedancapacity": 0,
        "SUVcapacity": 0
    });
    useLayoutEffect(() => {
        if (!newareainformation.Hatchback && !newareainformation.Sedan && !newareainformation.SUV) {
            setErate(false)
        }
    }, [newareainformation.Hatchback, newareainformation.Sedan, newareainformation.SUV])
    const showratesscreen = () => {
        if (newareainformation.Hatchback == false && newareainformation.Sedan == false && newareainformation.SUV == false) {
            Alert.alert(
                "Problem",
                "You have to first select atleast one car type!!"
            )
            return;
        }
        setRateInput(true);
    }
    const showpicknewareascreen = () => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                Alert.alert("Sorry", "Permission to access location was denied")
                return;
            }
            try {
                let location = await Location.getCurrentPositionAsync({});
                setPin({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                setCLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                })
                setPickLocation(true);
            } catch (error) {
                Alert.alert("Sorry", "Permission to access location was denied")
                return;
            }
        })();
    }
    const areainfoverification = async () => {
        const area = newareainformation;
        if (area.servicename === "") {
            Alert.alert(
                "Problem",
                "Enter your service name!!"
            )
            return false;
        }
        else if (area.address === "") {
            Alert.alert(
                "Problem",
                "Enter your address!!"
            )
            return false;
        }

        else if (area.city === "") {
            Alert.alert(
                "Problem",
                "Enter your parking area city!!"
            )
            return false;
        }
        else if (area.areaimage === null) {
            Alert.alert(
                "Problem",
                "upload your parking area image!!"
            )
            return false;
        }

        else if (area.Hatchback == false && area.Sedan == false && area.SUV == false) {
            Alert.alert(
                "Problem",
                "You should provide service for at least 1 type of vehicle!!"
            )
            return false;
        }


        else if (area.Hatchback && (area.Hatchbackrate == 0 || area.Hatchbackcapacity == 0)) {
            Alert.alert(
                "Problem",
                "Rate or Capacity for hatchback is not entered!!"
            )
            return false;
        }

        else if (area.Sedan && (area.Sedanrate == 0 || area.Sedancapacity == 0)) {
            Alert.alert(
                "Problem",
                "Rate or Capacity for sedan is not entered!!"
            )
            return false;
        }
        else if (area.SUV && (area.SUVrate == 0 || area.SUVcapacity == 0)) {
            Alert.alert(
                "Problem",
                "Rate or Capacity for suv is not entered!!"
            )
            return false;
        }
        else if (!area.location) {
            Alert.alert(
                "Problem",
                "Enter your parking area location in map!!"
            )
            return false;
        }
        try {
            setSubmiting(true)
            var cars = []
            var rates = []
            var capacities = []
            var carservices = {}
            var cartraffic = {}
            var carrevenue = {}
            if (newareainformation.Hatchback) {
                cars.push("Hatchback")
                rates.push(newareainformation.Hatchbackrate)
                capacities.push(newareainformation.Hatchbackcapacity)
                cartraffic.Hatchback = 0
                carrevenue.Hatchback = 0
                carservices.Hatchback = "Working"
            }
            if (newareainformation.Sedan) {
                cars.push("Sedan")
                rates.push(newareainformation.Sedanrate)
                capacities.push(newareainformation.Sedancapacity)
                cartraffic.Sedan = 0
                carrevenue.Sedan = 0
                carservices.Sedan = "Working"
            }
            if (newareainformation.SUV) {
                cars.push("SUV")
                rates.push(newareainformation.SUVrate)
                capacities.push(newareainformation.SUVcapacity)
                cartraffic.SUV = 0
                carrevenue.SUV = 0
                carservices.SUV = "Working"
            }
            let parkingData = { providerid: currentUser.user.id, servicename: newareainformation.servicename, address: newareainformation.address, city: newareainformation.city, cartypes: cars, rates: rates, capacities: capacities, carservices: carservices, location: newareainformation.location, areaimage: newareainformation.areaimage, registereddate: (new Date()).toString(), ratings: 0, cartraffic: cartraffic, carrevenue: carrevenue, status: "Pending" }
            let res = await registerNewParking(parkingData)
            if (res) {
                reset()
                setVisible(true);
            }
            else {
                Alert.alert("Oops", "Something went wrong !!")
            }
        } catch (error) {
            Alert.alert("Oops", "Something went wrong !!")
        }
        finally {
            setSubmiting(false)
        }
    }
    const setlocation = () => {
        setNewAreaInformation({ ...newareainformation, "location": pin })
        Alert.alert(
            "Success",
            "Location set successfully!!"
        )
        setPickLocation(false)
        setELoc(true)
    }
    const reset = () => {
        setNewAreaInformation({
            "servicename": "",
            "address": "",
            "city": "",
            "location": "",
            "areaimage": null,
            "Hatchback": false,
            "Sedan": false,
            "SUV": false,
            "Hatchbackrate": 0,
            "Sedanrate": 0,
            "SUVrate": 0,
            "Hatchcapacity": 0,
            "Sedancapacity": 0,
            "SUVcapacity": 0,
        })
        setPin(clocation);
        setELoc(false)
        setErate(false)

    }
    if (submiting) {
        return <LoadingOverlay />
    }
    return (
        <ScrollView style={styles.screen}>
            <View>
                <View style={styles.loginContainer}>

                    <View style={styles.inputContainter}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <Entypo name="edit" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 18, marginRight: 10, }} />
                            <TextInput placeholder='Enter Parking Name' value={newareainformation.servicename} onChangeText={value => setNewAreaInformation({ ...newareainformation, "servicename": value })} style={styles.entry} />
                        </View>
                    </View>
                    <View style={styles.inputContainter}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <MaterialCommunityIcons name="city-variant-outline" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 15, marginRight: 13, }} />
                            <TextInput placeholder='Enter Parking Area City' value={newareainformation.city} onChangeText={value => setNewAreaInformation({ ...newareainformation, "city": value })} style={styles.entry} />
                        </View>
                    </View>
                    <View style={styles.inputContainter}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <Entypo name="address" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 17, marginLeft: 17, marginRight: 10, }} />
                            <TextInput placeholder='Enter Parking Area Address' value={newareainformation.address} onChangeText={value => setNewAreaInformation({ ...newareainformation, "address": value })} style={[styles.entry]} />
                        </View>
                    </View>
                    <View style={[styles.inputContainter]}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <Pressable style={[{ flexDirection: 'row' }]} android_ripple={{ color: 'white' }} onPress={pickImage}>
                                {newareainformation.areaimage == null ? <FontAwesome name="picture-o" size={22} color="rgba(1,0,87,0.78)" style={{ marginTop: 17, marginLeft: 15, marginRight: 12, }} /> : <Image source={Success} style={{ height: 30, width: 30, marginTop: 15, marginRight: 10, marginLeft: 15 }} />}

                                {newareainformation.areaimage == null ? <TextInput placeholder='Upload Parking Area Picture' style={[styles.entry]} editable={false} /> : <TextInput placeholder='Parking Area Picture Uploaded' placeholderTextColor={'black'} style={[styles.entry]} editable={false} />}
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.inputContainter}>
                        <View style={[styles.input, { flexDirection: 'row', height: 153 }]}>
                            <Ionicons name="car-sport" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 65, marginLeft: 16, marginRight: 3, }} />
                            <View>
                                <Text style={[{ color: 'grey', fontSize: 17, marginTop: 10, marginLeft: 7, }]}>Select Your Vehicle Services</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginLeft: 0 }}>
                                    <View style={{ marginLeft: 0, flexDirection: 'row' }}>
                                        <CheckBox
                                            checkedColor='rgba(1,0,87,0.78)'
                                            style={{ padding: -10, margin: -10 }}
                                            checked={newareainformation.Hatchback}
                                            onPress={() => {
                                                setNewAreaInformation({ ...newareainformation, "Hatchback": !newareainformation.Hatchback });
                                            }}
                                        />
                                        <Text style={{ marginTop: 16, marginLeft: 0, marginRight: 0, fontWeight: '500', color: newareainformation.Hatchback ? 'black' : 'grey' }}>Hatchback</Text>
                                    </View>

                                    <View style={{ marginLeft: 0, flexDirection: 'row', width: 105 }}>
                                        <CheckBox
                                            checkedColor='rgba(1,0,87,0.78)'
                                            checked={newareainformation.Sedan}
                                            onPress={() => { setNewAreaInformation({ ...newareainformation, "Sedan": !newareainformation.Sedan }) }}
                                        />
                                        <Text style={{ marginTop: 16, marginLeft: 0, marginRight: 0, fontWeight: '500', color: newareainformation.Sedan ? 'black' : 'grey' }}>Sedan</Text>
                                    </View>

                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', marginTop: 1, marginBottom: 0, marginLeft: 0, }}>
                                    <CheckBox
                                        checkedColor='rgba(1,0,87,0.78)'
                                        checked={newareainformation.SUV}
                                        onPress={() => { setNewAreaInformation({ ...newareainformation, "SUV": !newareainformation.SUV }); }}
                                    />
                                    <Text style={{ marginTop: 16, marginLeft: 0, marginRight: 0, fontWeight: '500', color: newareainformation.SUV ? 'black' : 'grey' }}>SUV</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <RatesInputscreen rateinput={rateinput} newareainformation={newareainformation}>
                        <View style={styles.modalheader}>
                            <AntDesign name="close" size={24} color="rgba(1,0,87,0.78)" onPress={() => setRateInput(false)} />
                        </View>
                        <View style={{ marginLeft: '8%' }}>
                            <View style={{ flexDirection: 'column', marginTop: 25, marginLeft: 0, }}>
                                <Text style={[styles.text, { marginTop: 8, fontSize: 18, color: "rgba(1,0,87,0.78)" }]}>Hatchback</Text>
                                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center', marginRight: 5 }}>
                                    <TextInput placeholder={newareainformation.Hatchback ? "Rate (Rs.)" : "-"} keyboardType='numeric' value={newareainformation.Hatchbackrate} onChangeText={value => setNewAreaInformation({ ...newareainformation, "Hatchbackrate": value })} style={[styles.input3]} editable={newareainformation.Hatchback} />
                                    <TextInput placeholder={newareainformation.Hatchback ? "Slots" : "-"} keyboardType='numeric' value={newareainformation.Hatchbackcapacity} onChangeText={value => setNewAreaInformation({ ...newareainformation, "Hatchbackcapacity": value })} style={[styles.input3]} editable={newareainformation.Hatchback} />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'column', marginTop: 20, marginLeft: 0 }}>
                                <Text style={[styles.text, { marginTop: 8, fontSize: 18, color: "rgba(1,0,87,0.78)" }]}>Sedan</Text>
                                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center' }}>
                                    <TextInput keyboardType='numeric' placeholder={newareainformation.Sedan ? "Rate (Rs.)" : "-"} value={newareainformation.Sedanrate} onChangeText={value => setNewAreaInformation({ ...newareainformation, "Sedanrate": value })} style={[styles.input3]} editable={newareainformation.Sedan} />
                                    <TextInput placeholder={newareainformation.Sedan ? "Slots" : "-"} keyboardType='numeric' value={newareainformation.Sedancapacity} onChangeText={value => setNewAreaInformation({ ...newareainformation, "Sedancapacity": value })} style={[styles.input3]} editable={newareainformation.Sedan} />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'column', marginTop: 20, marginLeft: 0 }}>
                                <Text style={[styles.text, { marginTop: 8, fontSize: 18, color: "rgba(1,0,87,0.78)" }]}>SUV</Text>
                                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center' }}>
                                    <TextInput keyboardType='numeric' placeholder={newareainformation.SUV ? "Rate (Rs.)" : "-"} value={newareainformation.SUVrate} onChangeText={value => setNewAreaInformation({ ...newareainformation, "SUVrate": value })} style={[styles.input3]} editable={newareainformation.SUV} />
                                    <TextInput placeholder={newareainformation.SUV ? "Slots" : "-"} keyboardType='numeric' value={newareainformation.SUVcapacity} onChangeText={value => setNewAreaInformation({ ...newareainformation, "SUVcapacity": value })} style={[styles.input3]} editable={newareainformation.SUV} />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 15, alignItems: 'flex-end' }}>
                                <Text style={[{ fontSize: 15, color: 'rgba(1,0,87,0.78)', marginLeft: 140 }]}>* Rates Are Per Hour </Text>
                            </View>

                            <View style={{ marginTop: '2%', marginBottom: 20, }}>
                                <Pressable style={[styles.editcontainer, { width: (75 / 100) * (Dimensions.get('window').width) }]} android_ripple={{ color: 'white' }} onPress={() => {
                                    var empty = false;
                                    if (newareainformation.Hatchback && (newareainformation.Hatchbackrate == 0 || newareainformation.Hatchbackcapacity == 0)) {
                                        empty = true;
                                    }
                                    if (newareainformation.Sedan && (newareainformation.Sedanrate == 0 || newareainformation.Sedancapacity == 0)) {
                                        empty = true;
                                    }
                                    if (newareainformation.SUV && (newareainformation.SUVrate == 0 || newareainformation.SUVcapacity == 0)) {
                                        empty = true;
                                    }
                                    if (empty) {
                                        Alert.alert(
                                            "Caution",
                                            "Rates and capacity can't be empty!!"
                                        )
                                        return;
                                    }
                                    Alert.alert(
                                        "Success",
                                        "Rates and capacity has been set!!"
                                    )
                                    setRateInput(false)
                                    setErate(true)
                                }
                                }>
                                    <Text style={styles.edittext}>Set</Text>
                                </Pressable>
                            </View>
                        </View>
                    </RatesInputscreen>

                    <View style={[styles.inputContainter]}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <Pressable style={[{ flexDirection: 'row' }]} android_ripple={{ color: 'white' }} onPress={showratesscreen}>
                                {erate == false ? <FontAwesome name="rupee" size={26} color="rgba(1,0,87,0.78)" style={{ marginTop: 18, marginLeft: 20, marginRight: 16, }} /> : <Image source={Success} style={{ height: 30, width: 30, marginTop: 15, marginRight: 10, marginLeft: 15 }} />}

                                {erate == false ? <TextInput placeholder='Set Vehicles Rates' style={[styles.entry]} editable={false} /> : <TextInput placeholder='Vehicles Rates Set Successfully' placeholderTextColor={'black'} style={[styles.entry]} editable={false} />}
                            </Pressable>
                        </View>
                    </View>

                    <PickNewAreaLocation picklocation={picklocation}>
                        <View style={[styles.modalheader, { marginRight: 0, }]}>
                            <AntDesign name="close" size={24} color="rgba(1,0,87,0.78)" onPress={() => setPickLocation(false)} />
                        </View>
                        <View style={[styles.mapcontainer]}>
                            <MapView
                                style={styles.map}
                                initialRegion={{ latitudeDelta: 0.1922, longitudeDelta: 0.1421, latitude: pin.latitude, longitude: pin.longitude }}
                                provider="google"
                                showsUserLocation={true}
                                onPress={(e) => {
                                    setPin({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude });
                                }}
                            >

                                <Marker
                                    key={-1}
                                    coordinate={pin}
                                    pinColor='red'
                                    draggable={true}

                                >
                                    <Callout style={{ flex: 1 }}>
                                        <Text>Your Location</Text>
                                    </Callout>
                                </Marker>
                            </MapView>
                            <View style={{ marginTop: 20, marginBottom: 15, }}>
                                <Pressable style={[styles.editcontainer2]} android_ripple={{ color: 'white' }} onPress={setlocation}>
                                    <Text style={styles.edittext2}>Set</Text>
                                </Pressable>
                            </View>
                        </View>
                    </PickNewAreaLocation>


                    <View style={[styles.inputContainter]}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <Pressable style={[{ flexDirection: 'row' }]} android_ripple={{ color: 'white' }} onPress={showpicknewareascreen}>
                                {eloc == false ? <Octicons name="location" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 17, marginLeft: 17, marginRight: 12, }} /> : <Image source={Success} style={{ height: 30, width: 30, marginTop: 15, marginRight: 10, marginLeft: 15 }} />}

                                {eloc == false ? <TextInput placeholder='Set Parking Area Location' style={[styles.entry]} editable={false} /> : <TextInput placeholder='Location Set Successfully' placeholderTextColor={'black'} style={[styles.entry]} editable={false} />}
                            </Pressable>
                        </View>
                    </View>
                </View>

                <SuccessfullMessage visible={visible}>
                    <View style={[styles.modalheader, { marginRight: 0, }]}>
                        <AntDesign name="close" size={24} color="rgba(1,0,87,0.78)" onPress={() => setVisible(false)} />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={Success} style={{ height: 150, width: 150, marginVertical: 10 }} />
                    </View>

                    <Text style={{ marginVertical: 30, fontSize: 20, textAlign: 'center', color: 'rgba(1,0,87,0.78)' }}>
                        New Area Registered Successfully
                    </Text>
                </SuccessfullMessage>


                <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 20, justifyContent: 'center' }}>
                    <View style={{ marginRight: 50, height: 68 }} >
                        <Pressable style={styles.editcontainer3} android_ripple={{ color: 'white' }} onPress={reset}>
                            <Text style={styles.edittext3}>Reset</Text>
                        </Pressable>
                    </View>
                    <View style={{ height: 68 }}>
                        <Pressable style={styles.editcontainer3} android_ripple={{ color: 'white' }} onPress={areainfoverification}>
                            <Text style={styles.edittext3}>Submit</Text>
                        </Pressable>
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
    container: {
        flex: 1,
    },

    loginContainer: {
        marginTop: '2.5%',
    },
    heading: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 40,
    },
    header: {
        color: '#EE4B2B',
        fontSize: 30,
        fontWeight: '500',
    },
    inputContainter: {
        padding: 5,
        marginTop: 20,
        flexDirection: 'row',
        marginLeft: (3 / 100) * (Dimensions.get('window').width),
    },
    input: {
        width: Dimensions.get('window').width - 42,
        height: 50,
        borderRadius: 5,
        fontSize: 16,
        padding: 7,
    },
    shadow: {
        paddingLeft: 5,
        paddingTop: 5,
        borderRadius: 15,
        borderRadius: 5,
        width: Dimensions.get('window').width - 30,
        height: 58,
        elevation: 2,
        shadowColor: 'red',
    },
    pass: {
        marginLeft: 0
    },
    text: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttontext: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'lightblue',
        margin: 40,
    },
    utilityContainter: {
        marginTop: 20,
        flexDirection: 'row',
    },
    modelBackGround: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modelContainer: {
        width: '80%',
        backgroundColor: '#E8F4F8',
        paddingVertical: 30,
        borderRadius: 20,
        elevation: 20,
    },
    modalbackground2: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingTop: (15 / 100) * (Dimensions.get('window').height),
    },
    modalcontainer2: {
        marginLeft: '5.5%',
        width: '80%',
        height: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 20,
        elevation: 20,
    },
    header: {
        width: '100%',
        height: 40,
        alignItems: "flex-end",
        justifyContent: 'center',
    },
    mapcontainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: '2%',
    },
    map: {
        width: '100%',
        height: '90%',
    },
    editcontainer: {
        marginTop: 10,
        width: 100,
        height: 50,
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
    bookcontainer: {
        width: (88 / 100) * (Dimensions.get('window').width),
        height: 50,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#EE4B2B',
    },
    booktext: {
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 21,
        // color:'red',
        // color:'#EE4B2B',
        color: 'white',
    },
    heading: {
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        color: 'rgba(1,0,87,0.78)',
        fontSize: 40,
        fontWeight: '500',
    },
    inputContainter: {
        padding: 5,
        marginTop: 10,
        flexDirection: 'row',
        marginLeft: (4 / 100) * (Dimensions.get('window').width),
    },
    input: {
        width: Dimensions.get('window').width - 40,
        height: 58,
        borderRadius: 20,
        backgroundColor: 'white',
    },
    input3: {
        width: Dimensions.get('window').width - 250,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        marginRight: 5,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginLeft: 10,
    },
    entry: {
        width: Dimensions.get('window').width - 110,
        fontSize: 16,
    },
    editcontainer3: {
        width: 145,
        height: 58,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: 'rgba(1,0,87,0.78)',
    },
    edittext3: {
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 21,
        color: 'white',
    },
    editcontainer2: {
        width: (85 / 100) * (Dimensions.get('window').width),
        marginTop: 0,
        marginBottom: 0,
        height: 50,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: 'rgba(1,0,87,0.78)',
    },
    edittext2: {
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 21,
        color: 'white',
    },
    modelBackGroundArea: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapcontainer: {
        marginHorizontal: 20,
        flex: 1,
        backgroundColor: '#E8F4F8',
        alignItems: 'center',
        marginTop: '2%',
    },
    modelContainerArea: {
        width: '95%',
        height: '90%',
        backgroundColor: '#E8F4F8',
        paddingVertical: 30,
        borderRadius: 20,
        elevation: 20,
    },
    map: {
        width: '110%',
        height: '90%',
    },
    modalheader: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 20,
    },
    modalbackground2: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingTop: (13.5 / 100) * (Dimensions.get('window').height),
    },
    modalcontainer2: {
        marginLeft: '5%',
        width: '90%',
        height: '100%',
        backgroundColor: '#E8F4F8',
        paddingTop: 30,
        borderRadius: 20,
        elevation: 20,
    },
})




export default ProviderAddNewLocation;