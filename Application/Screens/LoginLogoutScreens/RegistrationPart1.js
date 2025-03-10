import React, { useState } from 'react'
import { View, StyleSheet, TextInput, ScrollView } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Dimensions } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


function RegistrationPart1({ registrationdata, changeusertype, changename, changeusername, changepassword, changeconfirmpassword }) {

    const [selectedValue, setSelectedValue] = useState("Public")
    const [pvisible, setPVisible] = useState(false)
    const [cpvisible, setCPVisible] = useState(false)

    return (
        <ScrollView style={styles.screen}>
            <View style={styles.viewBox}>
                <View style={styles.loginContainer}>

                    <View style={[styles.inputContainter]}>
                        <View style={[styles.pickerContainter, { flexDirection: 'row' }]}>
                            <Entypo name="select-arrows" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginHorizontal: 5, }} />
                            <Picker style={styles.picker}  selectedValue={selectedValue} onValueChange={value => {console.log(value); setSelectedValue(value); changeusertype(value); }} dropdownIconColor="rgba(1,0,87,0.78)" mode="dialog">
                                <Picker.Item label="Public" value="Public" />
                                <Picker.Item label="Provider" value="Provider" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputContainter}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <Entypo name="edit" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 18, marginRight: 10, }} />
                            <TextInput placeholder='Enter Your Name' style={styles.entry} value={registrationdata.name} onChangeText={value => changename(value)} />
                        </View>
                    </View>
                    <View style={styles.inputContainter}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <AntDesign name="user" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 18, marginRight: 10, }} />
                            <TextInput placeholder='Enter User Name' style={styles.entry} value={registrationdata.username} onChangeText={value => changeusername(value)} />
                        </View>
                    </View>

                    <View style={[styles.inputContainter]}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <EvilIcons name="lock" size={35} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 10, marginRight: 7, }} />
                            <TextInput placeholder='Enter Password' style={[styles.entry, { width: Dimensions.get('window').width - 160, marginRight: 10 }]} value={registrationdata.password} secureTextEntry={!pvisible} onChangeText={value => changepassword(value)} />
                            {
                                pvisible ?
                                    <MaterialCommunityIcons name="eye-off-outline" size={27} color="rgba(1,0,87,0.78)" style={{ marginTop: 17 }} onPress={() => setPVisible(!pvisible)} /> :
                                    <MaterialCommunityIcons name="eye-outline" size={27} color="rgba(1,0,87,0.78)" style={{ marginTop: 17 }} onPress={() => setPVisible(!pvisible)} />
                            }
                        </View>
                    </View>
                    <View style={[styles.inputContainter]}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <MaterialCommunityIcons name="lock-check-outline" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 15, marginRight: 12, }} />
                            <TextInput value={registrationdata.confirmpassword} placeholder="Confirm Your Password" secureTextEntry={!cpvisible} style={[styles.entry, { width: Dimensions.get('window').width - 160, marginRight: 10 }]} onChangeText={value => changeconfirmpassword(value)} />
                            {
                                cpvisible ?
                                    <MaterialCommunityIcons name="eye-off-outline" size={27} color="rgba(1,0,87,0.78)" style={{ marginTop: 17 }} onPress={() => setCPVisible(!cpvisible)} /> :
                                    <MaterialCommunityIcons name="eye-outline" size={27} color="rgba(1,0,87,0.78)" style={{ marginTop: 17 }} onPress={() => setCPVisible(!cpvisible)} />
                            }
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
        borderRadius: 20,
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
        color: 'rgba(0, 0, 0, 0.78)',
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


export default RegistrationPart1