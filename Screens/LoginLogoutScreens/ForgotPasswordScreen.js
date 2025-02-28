import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, ScrollView, Pressable } from 'react-native'
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig, getUserContactNo, setUserPassword } from '../../Backend/Authentication/ChangePassword';
import firebase from 'firebase/compat/app';
import { Dimensions } from 'react-native'
import LoadingOverlay from '../CommonScreens/LoadingOverlay'
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function ForgotPasswordScreen({ navigation, route }) {
  const [userinfo, setUserInfo] = useState('')
  const [username, setUserName] = useState("")
  const [newpassword, setNewPassword] = useState("")
  const [confirmpassword, setConfirmPassword] = useState("")
  const [buttonstate, setButtonState] = useState('Send Key');
  const [verificationid, setVerificationId] = useState('')
  const [code, setCode] = useState('')
  const recaptchaVerifier = useRef(null)
  const [verificationastatus, setVerificationStatus] = useState()
  const [submiting, setSubmiting] = useState(false)
  const [pvisible, setPVisible] = useState(false)
  const [cpvisible, setCPVisible] = useState(false)

  useLayoutEffect(() => {
    console.log(firebaseConfig);
    
    navigation.setOptions({ headerStyle: { backgroundColor: '#E8F4F8' }, headerTintColor: 'rgba(1,0,87,0.78)' })
  }, [])


  const sendVerification = async () => {
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    await phoneProvider
      .verifyPhoneNumber(userinfo[1], recaptchaVerifier.current)
      .then(setVerificationId)
    Alert.alert(
      "Success",
      "Security Key Has Been Sent On Registered Contact Number !!"
    )
  };

  const confirmCode = () => {
    setSubmiting(true)
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationid,
      code
    );
    firebase.auth().signInWithCredential(credential)
      .then(() => {
        setVerificationStatus(true)
      })
      .catch((error) => {
        setVerificationStatus(false)
      })
    setSubmiting(false)
  };
  const setphno = async () => {
    try {
      setSubmiting(true)
      let result = await getUserContactNo(username);
      if (result) {
        setSubmiting(false)
        setUserInfo(result)
        return
      }
      else {
        setSubmiting(false)
        Alert.alert("Problem", "Username Doesn't Exists !!")
        setButtonState('Send Key')
        return
      }

    } catch (error) {
      Alert.alert("Oops", "Something went wrong !!")
    }
  }

  const changeuserpassword = async () => {
    let obj = {};
    obj.id = userinfo[3];
    obj.password = newpassword
    await setUserPassword(obj, userinfo[2]);
  }
  useEffect(() => {
    if (buttonstate === 'Reset')
      sendVerification();
  }, [userinfo]);
  useEffect(() => {
    if (buttonstate === 'Reset') {
      if (verificationastatus) {
        changeuserpassword();
        setButtonState('Send Key');
        setUserName('');
        setCode('');
        setConfirmPassword('');
        setNewPassword('');
        Alert.alert(
          "Success",
          "Password has been reset!!"
        )
      }
      else {
        Alert.alert(
          "Problem",
          "Failed to verify code!!"
        )
      }
    }
  }, [verificationastatus]);

  const buttonactionhandler = async () => {
    if (buttonstate == 'Send Key') {
      if (verifypasswords()) {
        setphno()
        setButtonState('Reset');
      }
    }
    else {
      if (code == "") {
        Alert.alert(
          "Problem",
          "Please Enter Security Code!!"
        )
      }
      else {
        verifyOTP();
      }
    }
  }

  const verifyOTP = () => {
    confirmCode()
  }

  const verifypasswords = () => {
    if (buttonstate == 'Send Key') {
      if (username == '') {
        Alert.alert(
          "Problem",
          "Username can't be empty!!"
        )
        return false;
      }
      if (newpassword == '') {
        Alert.alert(
          "Problem",
          "New password field can'be empty!!"
        )
        return false;
      }
      if (confirmpassword == '') {
        Alert.alert(
          "Problem",
          "Confirm password field can'be empty!!"
        )
        return false;
      }

      var passwordpatternstatus = false;
      var passwordmatchstatus = false;

      var passwordpattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

      if (newpassword == confirmpassword)
        passwordmatchstatus = true;
      else
        passwordmatchstatus = false;

      if (newpassword.match(passwordpattern))
        passwordpatternstatus = true;
      else
        passwordpatternstatus = false;

      if (passwordmatchstatus && passwordpatternstatus) {
        return true;
      }

      else if (!passwordmatchstatus) {
        Alert.alert(
          "Problem",
          "New password and confirm password must be same"
        )
        return false;
      }

      else if (!passwordpatternstatus) {
        Alert.alert(
          "Problem",
          "Password should be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
        )
        return false;
      }
      else {
        Alert.alert(
          "Problem",
          "Enter your password properly!!"
        )
        return false;
      }

    }
  }

  if (submiting) {
    return <LoadingOverlay />
  }

  return (
    <ScrollView style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior="padding">
        <View style={[styles.loginContainer, { marginTop: 110 }]}>
          <View style={styles.heading}>
            <Text style={styles.header}>Set Password</Text>
          </View>
          {/* <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
          /> */}
          <View style={styles.inputContainter}>
            <View style={[styles.input, { flexDirection: 'row' }]}>
              <AntDesign name="user" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 18, marginRight: 10, }} />
              <TextInput placeholder='Enter User Name' style={styles.entry} value={username} onChangeText={username => setUserName(username)} />
            </View>
          </View>
          <View style={styles.inputContainter}>
            <View style={[styles.input, { flexDirection: 'row' }]}>
              <EvilIcons name="lock" size={35} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 10, marginRight: 7, }} />
              <TextInput placeholder='Enter New Password' style={[styles.entry, { width: Dimensions.get('window').width - 150, }]} value={newpassword} secureTextEntry={!pvisible} onChangeText={newpassword => { setNewPassword(newpassword) }} />
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
              <TextInput value={confirmpassword} placeholder="Confirm Your Password" secureTextEntry={!cpvisible} style={[styles.entry, { width: Dimensions.get('window').width - 150, }]} onChangeText={confirmpassword => setConfirmPassword(confirmpassword)} />
              {
                cpvisible ?
                  <MaterialCommunityIcons name="eye-off-outline" size={27} color="rgba(1,0,87,0.78)" style={{ marginTop: 17 }} onPress={() => setCPVisible(!cpvisible)} /> :
                  <MaterialCommunityIcons name="eye-outline" size={27} color="rgba(1,0,87,0.78)" style={{ marginTop: 17 }} onPress={() => setCPVisible(!cpvisible)} />
              }
            </View>
          </View>
          <View style={[styles.inputContainter]} >
            <View style={[styles.input, { flexDirection: 'row' }]}>
              <Octicons name="key" size={22} color="rgba(1,0,87,0.78)" style={{ marginTop: 18, marginLeft: 15, marginRight: 15, }} />
              <TextInput style={styles.entry} placeholder="Enter Security Key" value={code} onChangeText={code => setCode(code)} editable={buttonstate == "Send Key" ? false : true} />
            </View>
          </View>
          <View style={{ flex: 1, marginTop: 50, }}>
            <Pressable style={styles.editcontainer} android_ripple={{ color: 'white' }} onPress={e => buttonactionhandler()}>
              <Text style={styles.edittext}>{buttonstate}</Text>
            </Pressable>
          </View>
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
    borderColor: 'black',
    borderRadius: 10,
    borderBottomWidth: 2,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    width: Dimensions.get('window').width - 190

  },
  heading: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    color: 'rgba(1,0,87,0.78)',
    fontSize: 35,
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
    backgroundColor: 'rgba(1,0,87,0.78)'
  },
  edittext: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 21,
    color: 'white',
  },
})


export default ForgotPasswordScreen