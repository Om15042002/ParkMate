import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TextInput, ScrollView, Pressable } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { CheckBox } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import Success from '../../assets/Images/success.png';
import Profile from '../../assets/Images/profile.png';
import { Dimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

function RegistrationPart2({ registrationdata, changegender, changeemailId, changecontactno, changeprofilepicture, onacceptconditions }) {

    const [selectedValue, setSelectedValue] = useState("Public")
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            // mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        // console.log(result.assets[0].base64)
        if (!result.cancelled) {
            changeprofilepicture(result.assets[0].base64);
        }
    };

    return (
        <ScrollView style={styles.screen}>
            <View style={styles.viewBox}>
                <View style={styles.loginContainer}>
                    <View style={[styles.inputContainter]}>
                        <View style={[styles.pickerContainter, { flexDirection: 'row' }]}>
                            <MaterialCommunityIcons name="gender-male-female-variant" size={25} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 8, marginRight: 2, }} />
                            <Picker style={styles.picker} selectedValue={selectedValue} onValueChange={value => { setSelectedValue(value); changegender(value); }} dropdownIconColor="rgba(1,0,87,0.78)" mode="dialog">
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputContainter}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <MaterialCommunityIcons name="email-outline" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 18, marginRight: 10, }} />
                            <TextInput placeholder='Enter Your Email' style={styles.entry} value={registrationdata.emailid} onChangeText={value => changeemailId(value)} />
                        </View>
                    </View>
                    <View style={styles.inputContainter}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <Feather name="phone" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 18, marginRight: 10, }} />
                            <TextInput placeholder='Enter Your Contact Number' style={styles.entry} value={registrationdata.contactno} onChangeText={value => changecontactno(value)} />
                        </View>
                    </View>

                    <View style={[styles.inputContainter]}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <Pressable style={[{ flexDirection: 'row' }]} android_ripple={{ color: 'white' }} onPress={pickImage}>
                                {registrationdata.profilepicture == null ? <Image source={Profile} style={{ height: 30, width: 30, marginTop: 15, marginRight: 10, marginLeft: 15 }} /> : <Image source={Success} style={{ height: 30, width: 30, marginTop: 15, marginRight: 10, marginLeft: 15 }} />}

                                {registrationdata.profilepicture == null ? <TextInput placeholder='Upload Your Profile Picture' style={[styles.entry]} editable={false} /> : <TextInput placeholder='Profile Picture Uploaded' placeholderTextColor={'black'} style={[styles.entry]} editable={false} />}
                            </Pressable>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 25, justifyContent: 'center' }}>
                        <View style={{ marginLeft: 80 }}>
                            <CheckBox
                                checked={registrationdata.state}
                                checkedColor={'rgba(1,0,87,0.78)'}
                                onPress={() => { onacceptconditions(!registrationdata.state) }}
                            />
                        </View>

                        <Text style={{ marginTop: 14, marginLeft: 0, marginRight: 100, fontWeight: '500', color: 'rgba(1,0,87,0.78)' }}>I here by confirm that the above all details given by me is correct</Text>
                    </View>


                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    viewBox: {
        justifyContent: 'center',
    },
    loginContainer: {
        flex: 1,
        marginTop: '7%',
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
        marginTop: 25,

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
    pass: {
        marginLeft: 0
    },
    text: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    utilityContainter: {
        marginTop: 20,
        flexDirection: 'row',
    },
})


export default RegistrationPart2