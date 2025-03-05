import React, { useState, useEffect, useContext } from 'react'
import { Image, StyleSheet, Text, TextInput, View, ScrollView, Pressable, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { userContext } from '../../App';
import { changed } from '../LoginLogoutScreens/LogoutScreen';
import { Dimensions } from 'react-native';
import { FontAwesome5, Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { checkExistance } from '../../Backend/Authentication/Registration';


function UserProfileScreen() {
  const currentUser = useContext(userContext)
  const [edit, setEdit] = useState(false);
  const [picture, setPicture] = useState(currentUser.user.profilepicture)
  const [name, setName] = useState(currentUser.user.name)
  const [uname, setUName] = useState(currentUser.user.username)
  const [gender, setGender] = useState(currentUser.user.gender)
  const [email, setEmail] = useState(currentUser.user.emailid)
  const [contact, setContact] = useState(currentUser.user.contactno)
  const [ename, setEName] = useState(false)
  const [euname, setEUName] = useState(false)
  const [egender, setEGender] = useState(false)
  const [eemail, setEEmail] = useState(false)
  const [econtact, setEContact] = useState(false)

  const changeProfile = () => {
    (
      async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === 'granted') {
          try {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
              base64: true,
            })
            if (!result.cancelled) {
              currentUser.setUser({ ...currentUser.user, profilepicture: result.base64 })
              changed.changed = true
              setEdit(true)
              setPicture(result.base64)
            }
          }
          catch (error) {
          }
        }
        else {
          Alert.alert('Sorry', 'Permission is denied !!');
        }
      }
    )()
  }

  const handleEdit = async () => {
    setEdit(false);
    if (name == "" || uname == "" || gender == "" || email == "" || contact == "") {
      handleReset()
      Alert.alert('Sorry', 'All the fields are required !!');
      return
    }
    if (gender !== "Male" && gender !== "Female") {
      handleReset()
      Alert.alert('Sorry', 'Enter proper gender!!');
      return
    }
    if (currentUser.user.emailid !== email) {
      var emailpattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (!email.match(emailpattern)) {
        handleReset()
        Alert.alert(
          "Sorry",
          "Enter proper email id!!"
        )
        return
      }
    }
    if (currentUser.user.contactno !== contact) {
      var contactpattern = /^[6-9]\d{9}$/;
      if (!contact.match(contactpattern)) {
        handleReset()
        Alert.alert(
          "Sorry",
          "Enter proper contact number!!"
        )
        return
      }
    }
    if (currentUser.user.username !== uname) {
      let valid = await checkExistance(uname);
      if (!valid) {
        handleReset()
        Alert.alert('Sorry', 'Username already exists!!');
        return
      }
    }
    currentUser.setUser({ ...currentUser.user, name: name, username: uname, gender: gender, emailid: email, contactno: contact })
    changed.changed = true
  }

  const handleReset = () => {
    setName(currentUser.user.name)
    setUName(currentUser.user.username)
    setGender(currentUser.user.gender)
    setEmail(currentUser.user.emailid)
    setContact(currentUser.user.contactno)
    setPicture(currentUser.user.profilepicture)
    setEName(false)
    setEUName(false)
    setEGender(false)
    setEEmail(false)
    setEContact(false)
  }

  const focused = useIsFocused()
  useEffect(() => {
    if (!focused) {
      handleReset()
    }
  }, [focused])
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.profileContainter}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={styles.user}>
            <View>
              <View style={styles.imgContainter}>
                <Image source={{ uri: `data:image/gif;base64,${picture}` }} style={styles.image}></Image>
              </View>
            </View>
            <Entypo name="edit" size={24} color="rgba(1,0,87,0.78)" onPress={changeProfile} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={styles.name}>{currentUser.user.name}</Text>
          </View>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.row}>
            <MaterialCommunityIcons name="account-details-outline" size={35} color="rgba(1,0,87,0.78)" style={{ marginLeft: 18, marginRight: 17, }} />
            <View style={{ justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.rowTextInfo1}>Name</Text>
                <Entypo name="edit" size={20} color="rgba(1,0,87,0.78)" style={{ marginTop: 5, }} onPress={() => { setEName(!ename); setEdit(true) }} />
              </View>
              <TextInput style={[styles.rowTextInfo2]} value={name} onChangeText={name => setName(name)} editable={ename} />
            </View>
          </View>
          <View style={styles.row}>
            <FontAwesome5 name="user" size={27} color="rgba(1,0,87,0.78)" style={{ marginLeft: 24, marginRight: 22, }} />
            <View style={{ justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.rowTextInfo1}>User Name</Text>
                <Entypo name="edit" size={20} color="rgba(1,0,87,0.78)" style={{ marginTop: 5, }} onPress={() => { setEUName(!euname); setEdit(true) }} />
              </View>
              <TextInput style={[styles.rowTextInfo2]} value={uname} onChangeText={uname => setUName(uname)} editable={euname} />
            </View>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="gender-male-female-variant" size={30} color="rgba(1,0,87,0.78)" style={{ marginLeft: 18, marginRight: 20, }} />
            <View style={{ justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.rowTextInfo1}>Gender</Text>
                <Entypo name="edit" size={20} color="rgba(1,0,87,0.78)" style={{ marginTop: 5, }} onPress={() => { setEGender(!egender); setEdit(true) }} />
              </View>
              <TextInput style={[styles.rowTextInfo2]} value={gender} onChangeText={gender => setGender(gender)} editable={egender} />
            </View>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="email-outline" size={30} color="rgba(1,0,87,0.78)" style={{ marginLeft: 18, marginRight: 20, }} />
            <View style={{ justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.rowTextInfo1}>Email</Text>
                <Entypo name="edit" size={20} color="rgba(1,0,87,0.78)" style={{ marginTop: 5, }} onPress={() => { setEEmail(!eemail); setEdit(true) }} />
              </View>
              <TextInput style={[styles.rowTextInfo2]} value={email} onChangeText={email => setEmail(email)} editable={eemail} />
            </View>
          </View>
          <View style={styles.row}>
            <Feather name="phone" size={30} color="rgba(1,0,87,0.78)" style={{ marginLeft: 18, marginRight: 18, }} />
            <View style={{ justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.rowTextInfo1}>Contact Number</Text>
                <Entypo name="edit" size={20} color="rgba(1,0,87,0.78)" style={{ marginTop: 5, }} onPress={() => { setEContact(!econtact); setEdit(true) }} />
              </View>
              <TextInput style={[styles.rowTextInfo2]} value={contact} onChangeText={contact => setName(contact)} editable={econtact} />
            </View>
          </View>
        </View>
        <View style={styles.btnconcontainer}>
          <Pressable style={[styles.bookcontainer, { backgroundColor: edit ? 'rgba(1,0,87,0.78)' : 'rgba(1,0,87,0.7)', }]}
            android_ripple={{ color: 'white' }} disabled={!edit} onPress={handleEdit}>
            <Text style={styles.booktext}>Save Changes</Text>
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
  modalbackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingTop: (11 / 100) * (Dimensions.get('window').height),
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
  profileContainter: {
    flex: 1,
    marginTop: 40,
  },
  user: {
    flexDirection: 'row',
    marginLeft: '5%',
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'rgba(1,0,87,0.78)',
  },
  imgContainter: {
    width: 200,
    height: 200,
    overflow: 'hidden',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'rgba(1,0,87,0.78)',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  userInfo: {
    marginTop: 30,
    marginLeft: (4 / 100) * (Dimensions.get('window').width),
  },
  row: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 50,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 20,
  },
  rowTextHead: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  rowTextInfo1: {
    fontSize: 17,
    fontWeight: 'bold',
    width: Dimensions.get('window').width - 155,
    alignSelf: 'center',
    marginBottom: 2,
  },
  rowTextInfo2: {
    fontSize: 17,
    width: Dimensions.get('window').width - 120,
    alignSelf: 'center',
  },
  textBox: {
    width: 200,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
  },
  button: {
    flex: 1,
    width: 200,
    marginTop: 20,
    alignSelf: 'center',
  },
  editcontainer: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  editpressable: {
    minWidth: 150,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    backgroundColor: 'red'
  },
  edittext: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    paddingLeft: 5,
    minWidth: 200,
    maxWidth: 500,
    height: 37,
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
  btnconcontainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 30,
  },
  bookcontainer: {
    marginTop: 10,
    width: (87 / 100) * (Dimensions.get('window').width),
    height: 50,
    marginLeft: (6.5 / 100) * (Dimensions.get('window').width),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  booktext: {
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 21,
    color: 'white',
  },
})

export default UserProfileScreen