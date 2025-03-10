import React, { useState, useLayoutEffect } from 'react'
import ViewSlider from 'react-native-view-slider'
import RegistrationPart1 from './RegistrationPart1'
import RegistrationPart2 from './RegistrationPart2'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Dimensions,
  Image, Pressable, Alert, Modal,
} from 'react-native';
// import Animated from 'react-native-reanimated';
import { Animated } from 'react-native';

import Success from '../../assets/Images/success.png'
import { userRegister, providerRegister } from '../../Backend/Authentication/Registration'
import * as Crypto from 'expo-crypto'
import LoadingOverlay from '../CommonScreens/LoadingOverlay'
import { AntDesign } from '@expo/vector-icons'
const { width, height } = Dimensions.get('window');

const SuccessfullMessage = ({ visible, children }) => {
  
  console.log(visible,children);

  const [showModal, setShowModal] = useState(visible);
  
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible])
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    else {
      setShowModal(false);
      Animated.timing(scaleValue, {
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


function RegistrationScreen({ navigation, route }) {

  const [visible, setVisible] = useState(false)
  const [submiting, setSubmiting] = useState(false)

  const [registration, setRegistration] = useState({
    "usertype": "Public",
    "name": "",
    "username": "",
    "password": "",
    "confirmpassword": "",
    "gender": "Male",
    "emailid": "",
    "contactno": "",
    "profilepicture": null,
    "state": false,

  });

  useLayoutEffect(() => {
    navigation?.setOptions({ headerStyle: { backgroundColor: '#E8F4F8' }, headerTintColor: 'rgba(1,0,87,0.78)' })
  }, [])

  const changeusertype = (value) => {
    setRegistration({ ...registration, "usertype": value })
  }
  const changename = (Name) => {
    setRegistration({ ...registration, "name": Name })
  }
  const changeusername = (UserName) => {
    setRegistration({ ...registration, "username": UserName })
  }
  const changepassword = (Password) => {
    setRegistration({ ...registration, "password": Password })
  }
  const changeconfirmpassword = (ConfirmPassword) => {
    setRegistration({ ...registration, "confirmpassword": ConfirmPassword })
  }


  const changegender = (Gender) => {
    setRegistration({ ...registration, "gender": Gender })
  }
  const changeemailId = (EmailId) => {
    setRegistration({ ...registration, "emailid": EmailId })
  }
  const changecontactno = (ContactNo) => {
    setRegistration({ ...registration, "contactno": ContactNo })
  }
  const changeprofilepicture = (ProfilePicture) => {
    // console.log("hello ",ProfilePicture)
    setRegistration({ ...registration, "profilepicture": ProfilePicture })
  }
  const onacceptconditions = (State) => {
    setRegistration({ ...registration, "state": State })
  }





  const reset = () => {
    setRegistration({
      "usertype": "Public",
      "name": "",
      "username": "",
      "password": "",
      "confirmpassword": "",
      "gender": "Male",
      "emailid": "",
      "contactno": "",
      "profilepicture": null,
      "state": false
    })
  }

  const verifyregistrationdata = async () => {

    if (!registration.name) {
      Alert.alert("Problem", "Name is required")
      return
    }
    if (!registration.username) {
      Alert.alert("Problem", "User Name is required")
      return
    }
    if (!registration.profilepicture) {
      Alert.alert("Problem", "Please upload the profile picture")
      return
    }
    console.log( verifycontactno());

    if (verifypassword() && verifyemailId() && verifycontactno()) {

      if (registration.state) {
        setSubmiting(true)
        const hashpass = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, registration.password)
        try {
          let data = {
            "name": registration.name,
            "username": registration.username,
            "password": hashpass,
            "gender": registration.gender,
            "emailid": registration.emailid,
            "contactno": registration.contactno,
            "profilepicture": registration.profilepicture,
            "registereddate": (new Date()).toString()
          }
          let success;
          
          if (registration.usertype === "Public") {
            success = await userRegister(data)
          }
          else {
            console.log(data);
            
            success = await providerRegister(data)
          }
          if (success) {
            setVisible(true);
            reset();
          }
          else {
            Alert.alert("Sorry", "Username Already Exists !!")
          }
        }
        catch (error) {
          Alert.alert("Oops", "Something went wrong !!")
        }
        finally {
          setSubmiting(false)
        }
      }
      else {
        Alert.alert(
          "Problem",
          "Kindly mark the checkbox!!"
        )
      }
    }

  }

  const verifypassword = () => {
    var newpassword = registration.password;
    var confirmpassword = registration.confirmpassword;
    if (newpassword == '') {
      Alert.alert(
        "Problem",
        "password field can'be empty!!"
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
        "password and confirm password must be same"
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
        "Enter your passwords properly!!"
      )
      return false;
    }
  }
  const verifyemailId = () => {
    var emailpattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (registration.emailid.match(emailpattern)) {
      return true;
    }
    else {
      Alert.alert(
        "Problem",
        "Enter proper email id!!"
      )
      return false;
    }
  }
  const verifycontactno = () => {
    // var contactpattern = /^[6-9]\d{9}$/;
    const contactPattern = /^\(?([2-9][0-8][0-9])\)?[-.●]?([2-9][0-9]{2})[-.●]?([0-9]{4})$/;

    if (registration.contactno.match(contactPattern)) {
      return true;
    }
    else {
      Alert.alert(
        "Problem",
        "Enter proper contact number!!"
      )
      return false;
    }
  }

  if (submiting) {
    return <LoadingOverlay />
  }


  return (
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.theader}>Registration</Text>
        </View>
        <ViewSlider
          renderSlides={
            <>
              <View style={styles.viewBox}>
                <RegistrationPart1 registrationdata={registration} changeusertype={changeusertype} changename={changename} changeusername={changeusername} changepassword={changepassword} changeconfirmpassword={changeconfirmpassword} />
              </View>
              <View style={styles.viewBox}>
                <RegistrationPart2 registrationdata={registration} changegender={changegender} changeemailId={changeemailId} changecontactno={changecontactno} changeprofilepicture={changeprofilepicture} onacceptconditions={onacceptconditions} />
              </View>
            </>
          }

          style={[{ marginTop: 0, }, styles.slider]}
          height={550}
          slideCount={2}
          dots={true}
          dotActiveColor='rgba(1,0,87,0.78)'
          dotInactiveColor='gray'
          dotsContainerStyle={styles.dotContainer}
          autoSlide={false}
          slideInterval={1000}
        />
        <SuccessfullMessage visible={visible}>
          <View style={[styles.modalheader, { marginRight: 0, }]}>
            <AntDesign name="close" size={24} color="rgba(1,0,87,0.78)" onPress={() => setVisible(false)} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Image source={Success} style={{ height: 150, width: 150, marginVertical: 10 }} />
          </View>

          <Text style={{ marginVertical: 30, fontSize: 20, textAlign: 'center', color: 'rgba(1,0,87,0.78)' }}>
            Registration Successful
          </Text>
        </SuccessfullMessage>
        <View style={{ flexDirection: 'row', marginTop: 20, bottom: 2 }}>
          <View style={{ marginRight: 50, height: 68 }} >
            <Pressable style={styles.editcontainer} android_ripple={{ color: 'white' }} onPress={reset}>
              <Text style={styles.edittext}>Reset</Text>
            </Pressable>
          </View>
          <View style={{ height: 68 }}>
            <Pressable style={styles.editcontainer} android_ripple={{ color: 'white' }} onPress={verifyregistrationdata}>
              <Text style={styles.edittext}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 0,
    padding: 0,
  },
  screen: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  heading: {
    alignItems: 'center',
    marginTop: 50,
  },
  theader: {
    color: 'rgba(1,0,87,0.78)',
    fontSize: 40,
    fontWeight: '500',
  },
  viewBox: {
    paddingLeft: 0,
    width: width,
  },
  slider: {
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  dotContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 15
  },


  text: {
    color: 'black',
    fontSize: 20,
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
    justifyContent: 'space-around'
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
  header: {
    width: '100%',
    height: 40,
    alignItems: "flex-end",
    justifyContent: 'center',
  },
  editcontainer: {
    width: 130,
    height: 58,
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
  modalheader: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
})


export default RegistrationScreen