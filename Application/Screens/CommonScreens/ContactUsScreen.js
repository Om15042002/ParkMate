import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert } from 'react-native'
import postQuery from '../../Backend/Quries/Query'
import { Dimensions } from 'react-native'
import LoadingOverlay from './LoadingOverlay'
import { MaterialIcons, Octicons, Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

function ContactUsScreen() {
  const [query, setQuery] = useState({ name: "", email: "", detail: "" })
  const [sending, setSending] = useState(false)
  const sendQuery = async () => {
    if (!query.name || !query.email || !query.detail) {
      Alert.alert("Error", "All the fields are compulsory!!")
      return
    }
    try {
      setSending(true)
      await postQuery(query);
      Alert.alert("Success", "We will get back to you !!")
      setQuery({ name: "", email: "", detail: "" })
    }
    catch (error) {
      Alert.alert("Oops", "Something went wrong !!")
    }
    finally {
      setSending(false)
    }
  }
  if (sending) {
    return <LoadingOverlay />
  }
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.ourContacts}>
          <View style={styles.ourContactHead}>
            <Text style={styles.headText}>Want To Connect ?</Text>
          </View>
          <View>
            <View style={styles.row}>
              <MaterialCommunityIcons name="email-outline" size={30} color="rgba(1,0,87,0.78)" style={{ marginLeft: 18, marginRight: 15, }} />
              <View style={{ justifyContent: 'center' }}>
                <Text style={styles.rowTextInfo1}>Email</Text>
                <Text style={styles.rowTextInfo2}>kushayvhora@gmail.com</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Feather name="phone" size={30} color="rgba(1,0,87,0.78)" style={{ marginLeft: 18, marginRight: 15, }} />
              <View style={{ justifyContent: 'center' }}>
                <Text style={styles.rowTextInfo1}>Contact Number</Text>
                <Text style={styles.rowTextInfo2}>+91-8780987359</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Octicons name="location" size={32} color="rgba(1,0,87,0.78)" style={{ marginLeft: 18, marginRight: 20, }} />
              <View style={{ justifyContent: 'center' }}>
                <Text style={styles.rowTextInfo1}>Address</Text>
                <Text style={styles.rowTextInfo2}>Desai Building, Staion Road, Thasra, 388250</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.Queries}>
          <View style={styles.queryHead}>
            <Text style={[styles.headText, { marginLeft: 20 }]}>Any Query ?</Text>
          </View>
          <View style={{}}>
            <View style={styles.queryrow}>
              <View style={[styles.queryinput, { flexDirection: 'row' }]}>
                <Entypo name="edit" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 16, marginLeft: 18, marginRight: 10, }} />
                <TextInput placeholder='Enter Your Name' style={styles.entry} value={query.name} onChangeText={name => setQuery({ ...query, name: name })}></TextInput>
              </View>
            </View>
            <View style={styles.queryrow}>
              <View style={[styles.queryinput, { flexDirection: 'row' }]}>
                <MaterialCommunityIcons name="email-outline" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 17, marginLeft: 18, marginRight: 10, }} />
                <TextInput placeholder='Enter Your Email' style={styles.entry} value={query.email} onChangeText={email => setQuery({ ...query, email: email })}></TextInput>
              </View>
            </View>
            <View style={styles.queryrow}>
              <View style={[styles.queryinput, { flexDirection: 'row', height: 130, }]}>
                <MaterialIcons name="query-builder" size={24} color="rgba(1,0,87,0.78)" style={{ marginTop: 15, marginLeft: 18, marginRight: 10, }} />
                <TextInput multiline={true} placeholder='Enter Your Query Here' numberOfLines={5} style={[styles.entry, { textAlignVertical: 'top', marginTop: 15, }]} value={query.detail} onChangeText={detail => setQuery({ ...query, detail: detail })}></TextInput>
              </View>
            </View>
          </View>
          <View style={styles.btnconcontainer}>
            <Pressable style={[styles.editcontainer]} android_ripple={{ color: 'white' }} onPress={e => sendQuery()}>
              <Text style={styles.edittext}>Send</Text>
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
    justifyContent: 'center',
  },
  ourContacts: {
    marginTop: 30,
    marginLeft: 20,
  },
  Queries: {
    flex: 1,
    marginTop: 50,
  },
  ourContactHead: {
    marginBottom: 20,
  },
  queryHead: {
    marginBottom: 20,
  },
  queryrow: {
    marginTop: 20,
    flexDirection: 'row',
    marginLeft: (6.5 / 100) * (Dimensions.get('window').width),
  },
  queryinput: {
    width: Dimensions.get('window').width - 55,
    height: 58,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  entry: {
    width: Dimensions.get('window').width - 125,
    fontSize: 17,
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
  shadow2: {
    paddingLeft: 5,
    paddingTop: 5,
    borderRadius: 15,
    borderRadius: 5,
    width: Dimensions.get('window').width - 45,
    height: 130,
    elevation: 2,
    shadowColor: 'red',
  },
  queryinputarea: {
    textAlignVertical: 'top',
    width: Dimensions.get('window').width - 55,
    borderRadius: 5,
    fontSize: 16,
    padding: 7,
  },
  headText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'rgba(1,0,87,0.78)',
  },
  row: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 60,
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
    width: Dimensions.get('window').width - 120,
    alignSelf: 'center',
    marginBottom: 2,
  },
  rowTextInfo2: {
    fontSize: 17,
    width: Dimensions.get('window').width - 120,
    alignSelf: 'center',
  },
  btnconcontainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 30,
  },
  editcontainer: {
    marginTop: 10,
    width: (85 / 100) * (Dimensions.get('window').width),
    height: 50,
    marginLeft: (6.5 / 100) * (Dimensions.get('window').width),
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


export default ContactUsScreen