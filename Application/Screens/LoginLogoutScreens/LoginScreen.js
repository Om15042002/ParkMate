import React, { useContext, useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, ScrollView, Pressable } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { userLogin, providerLogin } from '../../Backend/Authentication/Login'
import { userContext } from '../../App'
import { Dimensions } from 'react-native'
import LoadingOverlay from '../CommonScreens/LoadingOverlay'
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { userContext } from '../../UserContext';

// const userContext = React.createContext(null);

function LoginScreen({ navigation, route }) {
    const currentUser = useContext(userContext)
    const [selectedValue, setSelectedValue] = useState("Public")
    const [uname, setUname] = useState("")
    const [pass, setPass] = useState("")
    const [submiting, setSubmiting] = useState(false)
    const [pvisible, setPVisible] = useState(false)
    const newHandler = () => {
        navigation?.navigate('Registration')
    }
    const passwordHandler = () => {
        navigation?.navigate('Forgot Password')
    }
    useLayoutEffect(() => {
        navigation?.setOptions({ headerStyle: { backgroundColor: '#E8F4F8' }, headerTintColor: 'rgba(1,0,87,0.78)' }) //black
    }, [])
    const handleLogin = async () => {
        if (!uname || !pass) {
            Alert.alert(
                "Problem",
                "Username and Password is required"
            )
        }
        else {
            try {
                setSubmiting(true)
                let data = {
                    uname: uname,
                    pass: pass
                }
                let key, res = null;
                if (selectedValue === "Public") {
                    [key, res] = await userLogin(data)
                }
                else {
                    [key, res] = await providerLogin(data)
                }
                if (res) {
                    currentUser?.setUser({ usertype: selectedValue, id: key, name: res.name, username: res.username, gender: res.gender, emailid: res.emailid, contactno: res.contactno, profilepicture: res.profilepicture, password: res.password, profilepictureloc: res.profilepictureloc })
                    route?.params?.setSkip(true)
                }
                else {
                    Alert.alert(
                        "Problem",
                        "Check Username or Password"
                    )
                }
            }
            catch (error) {
                Alert.alert("Oops", "Something went wrong !!")
            }
            finally {
                setSubmiting(false)
            }
        }
        setSelectedValue("Public")
        setUname("")
        setPass("")
    }

    if (submiting) {
        return <LoadingOverlay />
    }
    return (
        <ScrollView style={styles.screen}>
            <KeyboardAvoidingView style={styles.screen} behavior="padding">
                <View style={[styles.loginContainer, { marginTop: route.params.skip ? 100 : 80 }]}>
                    <View style={styles.heading}>
                        <Text style={styles.header}>Login</Text>
                    </View>

                    <View style={[styles.inputContainter]}>
                        <View style={[styles.pickerContainter, { flexDirection: 'row' }]}>
                            <Entypo name="select-arrows" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginHorizontal: 5, }} />
                            <Picker style={styles.picker} selectedValue={selectedValue} onValueChange={value => setSelectedValue(value)} dropdownIconColor="rgba(1,0,87,0.78)" mode="dialog">
                                <Picker.Item label="Public" value="Public" />
                                <Picker.Item label="Provider" value="Provider" />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputContainter}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <AntDesign name="user" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 18, marginRight: 10, }} />
                            <TextInput placeholder='Enter User Name' style={styles.entry} value={uname} onChangeText={uname => setUname(uname)} />
                        </View>
                    </View>
                    <View style={[styles.inputContainter]}>
                        <View style={[styles.input, { flexDirection: 'row' }]}>
                            <EvilIcons name="lock" size={35} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 10, marginRight: 7, }} />
                            <TextInput placeholder='Enter Password' style={[styles.entry, { width: Dimensions.get('window').width - 160, marginRight: 10, }]} value={pass} secureTextEntry={!pvisible} onChangeText={pass => setPass(pass)} />
                            {
                                pvisible ?
                                    <MaterialCommunityIcons name="eye-off-outline" size={27} color="rgba(1,0,87,0.78)" style={{ marginTop: 17 }} onPress={() => setPVisible(!pvisible)} /> :
                                    <MaterialCommunityIcons name="eye-outline" size={27} color="rgba(1,0,87,0.78)" style={{ marginTop: 17 }} onPress={() => setPVisible(!pvisible)} />
                            }
                        </View>
                    </View>
                    <View style={styles.utilityContainter}>
                        <Pressable android_ripple={{ color: 'rgb(168, 167, 163)', radius: 5 }} onPress={() => { newHandler() }}>
                            <Text style={[{ fontWeight: '500', fontSize: 17, }, { color: 'rgba(1,0,87,0.78)', marginLeft: 20, }]}>New User ?</Text>
                        </Pressable>
                        <Pressable android_ripple={{ color: 'rgb(168, 167, 163)', radius: 5 }} onPress={() => { passwordHandler() }}>
                            <Text style={[{ fontWeight: '500', fontSize: 17 }, { color: 'rgba(1,0,87,0.78)', marginRight: 10, }]}>Forgot Password ? </Text>
                        </Pressable>
                    </View>
                    <View style={{ flex: 1, marginTop: 50, }}>
                        <Pressable style={[styles.editcontainer, { backgroundColor: 'rgba(1,0,87,0.78)' }]} android_ripple={{ color: 'white' }} onPress={e => handleLogin()}>
                            <Text style={styles.edittext}>Login</Text>
                        </Pressable>
                    </View>
                    {!route.params.skip ? <View style={{ flex: 1, marginTop: 5 }}>
                        <Pressable style={[styles.editcontainer, { backgroundColor: 'rgba(1,0,87,0.78)' }]} android_ripple={{ color: 'white' }} onPress={e => route.params.setSkip(true)}>
                            <Text style={styles.edittext}>Skip</Text>
                        </Pressable>
                    </View> : null}
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#E8F4F8',
    },
    loginContainer: {
        flex: 1,
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
        elevation: 0,
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
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    editcontainer: {
        marginTop: 10,
        width: (88 / 100) * (Dimensions.get('window').width),
        height: 50,
        alignSelf: 'center',
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
})

export default LoginScreen