import React, {
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Pressable,
  Modal,
  Animated,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  editParkingAreaInfo,
  cancelParkingArea,
  editParkingPicture,
} from "../../Backend/ParkingAreas/AllAboutAreas";
import * as ImagePicker from "expo-image-picker";
import { userContext } from "../../App";
import { Dimensions } from "react-native";
import LoadingOverlay from "../CommonScreens/LoadingOverlay";

const CancelService = ({ cancelservice, children }) => {
  const [show, setShow] = useState(cancelservice);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const toggleModal = () => {
    if (cancelservice) {
      setShow(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShow(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  useEffect(() => {
    toggleModal();
  }, [cancelservice]);
  return (
    <Modal transparent visible={show}>
      <View style={styles.modalbackground}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.modalcontainer,
              { transform: [{ scale: scaleValue }] },
            ]}
          >
            {children}
          </Animated.View>
        </ScrollView>
      </View>
    </Modal>
  );
};
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
    } else {
      setTimeout(() => setShow(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  useEffect(() => {
    toggleModal();
  }, [visible]);
  return (
    <Modal transparent visible={show}>
      <View style={styles.modalbackground2}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.modalcontainer2,
              { transform: [{ scale: scaleValue }] },
            ]}
          >
            {children}
          </Animated.View>
        </ScrollView>
      </View>
    </Modal>
  );
};
function ApprovedProvidedAreaItem({ navigation, route }) {
  const currentUser = useContext(userContext);
  const [visible, setVisible] = useState(false);
  const [providedvehicles, setProvidedVehicles] = useState(false);
  const [cancelservice, setCancelService] = useState(false);
  const [change, setChanging] = useState(false);
  let capacity = 0;
  route.params.item.capacities.forEach((x) => (capacity += parseInt(x)));
  const [totalcapacity, setTotalCapacity] = useState(capacity);

  const [tempnewservicename, setTempNewServiceName] = useState(
    route.params.item.servicename
  );
  const [newservicename, setNewServiceName] = useState(
    route.params.item.servicename
  );

  const [newhatchbackrate, setNewHatchbackRate] = useState(0);
  const [newhatchbackcapacity, setNewHatchbackCapacity] = useState(0);

  const [newsedanrate, setNewSedanRate] = useState(0);
  const [newsedancapacity, setNewSedanCapacity] = useState(0);

  const [newsuvrate, setNewSUVRate] = useState(0);

  const [newsuvcapacity, setNewSUVCapacity] = useState(0);

  const [newluxuryrate, setNewLuxuryRate] = useState(0);
  const [newluxurycapacity, setNewLuxuryCapacity] = useState(0);

  const [tempnewhatchbackrate, setTempNewHatchbackRate] =
    useState(newhatchbackrate);
  const [tempnewsedanrate, setTempNewSedanRate] = useState(newsedanrate);
  const [tempnewsuvrate, setTempNewSUVRate] = useState(newsuvrate);
  const [tempnewluxuryrate, setTempNewLuxuryRate] = useState(newluxuryrate);

  const [tempnewhatchbackcapacity, setTempNewHatchbackCapacity] =
    useState(newhatchbackcapacity);
  const [tempnewsedancapacity, setTempNewSedanCapacity] =
    useState(newsedancapacity);
  const [tempnewsuvcapacity, setTempNewSUVCapacity] = useState(newsuvcapacity);
  const [tempnewluxurycapacity, setTempNewLuxuryCapacity] =
    useState(newluxurycapacity);

  const [registrationdate, setRegistrationDate] = useState(new Date());
  const [isDisplayDate, setShow] = useState(false);
  const [displaymode, setMode] = useState("date");
  const [canceldate, setcancelDate] = useState(new Date());
  const [cancelquery, setcancelQuery] = useState("");
  const [providername, setProviderName] = useState("");
  const [areaImage, setAreaImage] = useState(route.params.item.areaimage);

  const cancelarea = async () => {
    setCancelService(false);
    if (cancelquery == "") {
      Alert.alert("Problem", "Please Enter Reason!!");
    } else if (cancelquery.length < 30) {
      Alert.alert("Problem", "Reason must be of minimum of 30 character!!");
    } else {
      try {
        setChanging(true);
        let cancelAreaInfo = {
          cancellationdate: canceldate,
          cancelleddate: new Date().toString(),
          reason: cancelquery,
          parkingareaid: route.params.item.id,
        };
        let result = await cancelParkingArea(
          cancelAreaInfo,
          route.params.item.status,
          route.params.item.id
        );
        if (result) {
          Alert.alert(
            "Sucees",
            "Area Cancelled sucessfully from that entered date onwards!!",
            [
              {
                text: "Okay",
                onPress: () => {
                  navigation.navigate("ApprovedProvidedAreaList");
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            "Problem",
            "Can't possible on this date due to bookings!!"
          );
        }
      } catch (error) {
        Alert.alert("Oops", "Something Went Wrong !!");
      } finally {
        setChanging(false);
      }
    }
  };
  useLayoutEffect(() => {
    if (route.params.item.cartypes.includes("Hatchback")) {
      let ind = route.params.item.cartypes.indexOf("Hatchback");
      setNewHatchbackRate(route.params.item.rates[ind]);
      setNewHatchbackCapacity(route.params.item.capacities[ind]);
      setTempNewHatchbackRate(route.params.item.rates[ind]);
      setTempNewHatchbackCapacity(route.params.item.capacities[ind]);
    } else {
      setNewHatchbackRate(0);
      setNewHatchbackCapacity(0);
      setTempNewHatchbackRate(0);
      setTempNewHatchbackCapacity(0);
    }
    if (route.params.item.cartypes.includes("Sedan")) {
      let ind = route.params.item.cartypes.indexOf("Sedan");
      setNewSedanRate(route.params.item.rates[ind]);
      setNewSedanCapacity(route.params.item.capacities[ind]);
      setTempNewSedanRate(route.params.item.rates[ind]);
      setTempNewSedanCapacity(route.params.item.capacities[ind]);
    } else {
      setNewSedanRate(0);
      setNewSedanCapacity(0);
      setTempNewSedanRate(0);
      setTempNewSedanCapacity(0);
    }
    if (route.params.item.cartypes.includes("SUV")) {
      let ind = route.params.item.cartypes.indexOf("SUV");
      setNewSUVRate(route.params.item.rates[ind]);
      setNewSUVCapacity(route.params.item.capacities[ind]);
      setTempNewSUVRate(route.params.item.rates[ind]);
      setTempNewSUVCapacity(route.params.item.capacities[ind]);
    } else {
      setNewSUVRate(0);
      setNewSUVCapacity(0);
      setTempNewSUVRate(0);
      setTempNewSUVCapacity(0);
    }
    setRegistrationDate(new Date(route.params.item.registereddate));
  }, []);

  const showcancelservice = () => {
    setCancelService(true);
  };

  const changeParkingPicture = () => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted") {
        try {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
          });
          if (!result.cancelled) {
            try {
              setChanging(true);
              let updatedArea = route.params.item;
              updatedArea = { ...updatedArea, areaimage: result.base64 };
              delete updatedArea.id;
              updatedArea = { id: route.params.item.id, data: updatedArea };
              let update = await editParkingPicture(updatedArea);
              if (update) {
                setAreaImage(result.base64);
                Alert.alert(
                  "Success",
                  "Your parking picture has been updated successfully !!"
                );
              } else {
                Alert.alert("Oops", "We can't update your new parking picture");
              }
            } catch (error) {
              Alert.alert("Oops", "We can't update your new parking picture");
            } finally {
              setChanging(false);
            }
          }
        } catch (error) {}
      } else {
        Alert.alert("Sorry", "Permission is denied !!");
      }
    })();
  };

  const handleEdit = async () => {
    setVisible(false);
    if (
      (tempnewhatchbackcapacity == 0 && tempnewhatchbackrate > 0) ||
      (tempnewsedancapacity == 0 && tempnewsedanrate > 0) ||
      (tempnewsuvcapacity == 0 && tempnewsuvrate > 0) ||
      (tempnewluxurycapacity == 0 && tempnewluxuryrate > 0)
    ) {
      Alert.alert("Problem", "Capacity is zero then Rate must be 0!!");
    } else if (tempnewservicename == "") {
      Alert.alert("Problem", "Service name can't be empty!!");
    } else {
      let cartypes = [];
      let rates = [];
      let capacities = [];
      let carrevenue = {};
      let carservices = {};
      let cartraffic = {};

      if (tempnewhatchbackrate > 0) {
        cartypes.push("Hatchback");
        rates.push(tempnewhatchbackrate);
        capacities.push(tempnewhatchbackcapacity);
        carrevenue["Hatchback"] = route.params.item.carrevenue["Hatchback"]
          ? route.params.item.carrevenue["Hatchback"]
          : 0;
        carservices["Hatchback"] = route.params.item.carservices["Hatchback"]
          ? route.params.item.carservices["Hatchback"]
          : "Working";
        cartraffic["Hatchback"] = route.params.item.cartraffic["Hatchback"]
          ? route.params.item.cartraffic["Hatchback"]
          : 0;
      }
      if (tempnewsedanrate > 0) {
        cartypes.push("Sedan");
        rates.push(tempnewsedanrate);
        capacities.push(tempnewsedancapacity);
        carrevenue["Sedan"] = route.params.item.carrevenue["Sedan"]
          ? route.params.item.carrevenue["Sedan"]
          : 0;
        carservices["Sedan"] = route.params.item.carservices["Sedan"]
          ? route.params.item.carservices["Sedan"]
          : "Working";
        cartraffic["Sedan"] = route.params.item.cartraffic["Sedan"]
          ? route.params.item.cartraffic["Sedan"]
          : 0;
      }
      if (tempnewsuvrate > 0) {
        cartypes.push("SUV");
        rates.push(tempnewsuvrate);
        capacities.push(tempnewsuvcapacity);
        carrevenue["SUV"] = route.params.item.carrevenue["SUV"]
          ? route.params.item.carrevenue["SUV"]
          : 0;
        carservices["SUV"] = route.params.item.carservices["SUV"]
          ? route.params.item.carservices["SUV"]
          : "Working";
        cartraffic["SUV"] = route.params.item.cartraffic["SUV"]
          ? route.params.item.cartraffic["SUV"]
          : 0;
      }

      try {
        setChanging(true);
        let updatedArea = route.params.item;
        updatedArea = {
          ...updatedArea,
          cartypes: cartypes,
          rates: rates,
          capacities: capacities,
          carrevenue: carrevenue,
          carservices: carservices,
          cartraffic: cartraffic,
          servicename: tempnewservicename,
        };
        delete updatedArea.id;
        updatedArea = { id: route.params.item.id, data: updatedArea };

        let result = await editParkingAreaInfo(updatedArea);
        if (result) {
          Alert.alert(
            "Sucees",
            "Data Edited Sucessfully!!",
            [
              {
                text: "Okay",
                onPress: () => {
                  navigation.navigate("ApprovedProvidedAreaList");
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert("Oops", "Something went wrong !!");
        }
      } catch (error) {
        Alert.alert("Oops", "Something went wrong !!");
      } finally {
        setChanging(false);
      }
    }
  };

  const handleReset = () => {
    if (route.params.item.cartypes.includes("Hatchback")) {
      let ind = route.params.item.cartypes.indexOf("Hatchback");
      setNewHatchbackRate(route.params.item.rates[ind]);
      setNewHatchbackCapacity(route.params.item.capacities[ind]);
    } else {
      setNewHatchbackRate(0);
      setNewHatchbackCapacity(0);
    }
    if (route.params.item.cartypes.includes("Sedan")) {
      let ind = route.params.item.cartypes.indexOf("Sedan");
      setNewSedanRate(route.params.item.rates[ind]);
      setNewSedanCapacity(route.params.item.capacities[ind]);
    } else {
      setNewSedanRate(0);
      setNewSedanCapacity(0);
    }
    if (route.params.item.cartypes.includes("SUV")) {
      let ind = route.params.item.cartypes.indexOf("SUV");
      setNewSUVRate(route.params.item.rates[ind]);
      setNewSUVCapacity(route.params.item.capacities[ind]);
    } else {
      setNewSUVRate(0);
      setNewSUVCapacity(0);
    }

    setTempNewHatchbackRate(newhatchbackrate);
    setTempNewSedanRate(newsedanrate);
    setTempNewSUVRate(newsuvrate);
    setTempNewLuxuryRate(newluxuryrate);

    setTempNewHatchbackCapacity(newhatchbackcapacity);
    setTempNewSedanCapacity(newsedancapacity);
    setTempNewSUVCapacity(newsuvcapacity);
    setTempNewLuxuryCapacity(newluxurycapacity);
    setNewServiceName(route.params.item.servicename);
    setTempNewServiceName(route.params.item.servicename);

    let capacity = 0;
    route.params.item.capacities.forEach((x) => (capacity += parseInt(x)));
    setTotalCapacity(capacity);
  };
  const changeSelectedDate = (e, selectedDate) => {
    const currentDate = selectedDate || canceldate;
    setShow(false);
    setcancelDate(currentDate);
  };
  const handleDate = () => {
    setShow(true);
  };
  if (change) {
    return <LoadingOverlay />;
  }
  return (
    <ScrollView style={styles.screen}>
      <ModalPopup visible={visible}>
        <View style={styles.modalheader}>
          <AntDesign
            name="close"
            size={24}
            color="rgba(1,0,87,0.78)"
            onPress={() => setVisible(false)}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.searchcontainer}>
            <View style={styles.inputContainter}>
              <View style={[styles.input, { flexDirection: "row" }]}>
                <Entypo
                  name="edit"
                  size={24}
                  color="rgba(1,0,87,0.78)"
                  style={{ marginTop: 15, marginLeft: 18, marginRight: 10 }}
                />
                <TextInput
                  style={[styles.entry]}
                  placeholder="Enter New Parking Name"
                  value={tempnewservicename}
                  onChangeText={(value) => {
                    setTempNewServiceName(value);
                  }}
                ></TextInput>
              </View>
            </View>
            <View style={styles.inputContainter}>
              <View
                style={[styles.input, { flexDirection: "row", height: 375 }]}
              >
                <Ionicons
                  name="car-sport"
                  size={30}
                  color="rgba(1,0,87,0.78)"
                  style={{ marginLeft: 15, marginRight: 15, marginTop: 165 }}
                />
                <View style={{ marginTop: 20 }}>
                  <Text style={[styles.text, { marginLeft: 0, fontSize: 15 }]}>
                    Hatchback
                  </Text>
                  <View
                    style={{
                      flexDirection: "column",
                      marginTop: 5,
                      marginLeft: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        marginVertical: 0,
                        marginLeft: 0,
                      }}
                    >
                      <Text style={{ marginTop: 7, fontWeight: "500" }}>
                        Rate :{" "}
                      </Text>
                      <TextInput
                        placeholder="Rate"
                        keyboardType="numeric"
                        editable={true}
                        value={String(tempnewhatchbackrate)}
                        onChangeText={(value) => setTempNewHatchbackRate(value)}
                        style={[
                          {
                            marginRight: 5,
                            textAlign: "center",
                            textAlignVertical: "center",
                            borderBottomWidth: 2,
                            width: 130,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 0,
                          },
                        ]}
                      />
                      <Text style={{ marginTop: 7 }}>Rs/Hr</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginVertical: 3,
                        marginLeft: 0,
                      }}
                    >
                      <Text style={{ marginTop: 7, fontWeight: "500" }}>
                        Slots :{" "}
                      </Text>
                      <TextInput
                        placeholder="Slot"
                        keyboardType="numeric"
                        editable={true}
                        value={String(tempnewhatchbackcapacity)}
                        onChangeText={(value) =>
                          setTempNewHatchbackCapacity(value)
                        }
                        style={[
                          {
                            marginRight: 5,
                            textAlign: "center",
                            textAlignVertical: "center",
                            borderBottomWidth: 2,
                            width: 130,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 0,
                          },
                        ]}
                      />
                      <Text style={{ marginTop: 7 }}>Slots</Text>
                    </View>
                  </View>
                  <Text style={[styles.text, { fontSize: 15, marginTop: 25 }]}>
                    Sedan
                  </Text>
                  <View
                    style={{
                      flexDirection: "column",
                      marginTop: 5,
                      marginLeft: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        marginVertical: 0,
                        marginLeft: 0,
                      }}
                    >
                      <Text style={{ marginTop: 7, fontWeight: "500" }}>
                        Rate :{" "}
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        placeholder="Rate"
                        editable={true}
                        value={String(tempnewsedanrate)}
                        onChangeText={(value) => setTempNewSedanRate(value)}
                        style={[
                          {
                            marginRight: 5,
                            textAlign: "center",
                            textAlignVertical: "center",
                            borderBottomWidth: 2,
                            width: 130,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 0,
                          },
                        ]}
                      />
                      <Text style={{ marginTop: 7 }}>Rs/Hr</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginVertical: 3,
                        marginLeft: 0,
                      }}
                    >
                      <Text style={{ marginTop: 7, fontWeight: "500" }}>
                        Slots :{" "}
                      </Text>
                      <TextInput
                        placeholder="Slot"
                        keyboardType="numeric"
                        editable={true}
                        value={String(tempnewsedancapacity)}
                        onChangeText={(value) => setTempNewSedanCapacity(value)}
                        style={[
                          {
                            marginRight: 5,
                            textAlign: "center",
                            textAlignVertical: "center",
                            borderBottomWidth: 2,
                            width: 130,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 0,
                          },
                        ]}
                      />
                      <Text style={{ marginTop: 7 }}>Slots</Text>
                    </View>
                  </View>
                  <Text style={[styles.text, { fontSize: 15, marginTop: 25 }]}>
                    SUV
                  </Text>
                  <View
                    style={{
                      flexDirection: "column",
                      marginVertical: 5,
                      marginLeft: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        marginVertical: 0,
                        marginLeft: 0,
                      }}
                    >
                      <Text style={{ marginTop: 7, fontWeight: "500" }}>
                        Rate :{" "}
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        placeholder="Rate"
                        editable={true}
                        value={String(tempnewsuvrate)}
                        onChangeText={(value) => setTempNewSUVRate(value)}
                        style={[
                          {
                            marginRight: 5,
                            textAlign: "center",
                            textAlignVertical: "center",
                            borderBottomWidth: 2,
                            width: 130,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 0,
                          },
                        ]}
                      />
                      <Text style={{ marginTop: 7 }}>Rs/Hr</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        marginVertical: 5,
                        marginLeft: 0,
                      }}
                    >
                      <Text style={{ marginTop: 7, fontWeight: "500" }}>
                        Slots :{" "}
                      </Text>
                      <TextInput
                        placeholder="Slot"
                        keyboardType="numeric"
                        editable={true}
                        value={String(tempnewsuvcapacity)}
                        onChangeText={(value) => setTempNewSUVCapacity(value)}
                        style={[
                          {
                            marginRight: 5,
                            textAlign: "center",
                            textAlignVertical: "center",
                            borderBottomWidth: 2,
                            width: 130,
                            borderRadius: 5,
                            paddingHorizontal: 10,
                            paddingVertical: 0,
                          },
                        ]}
                      />
                      <Text style={{ marginTop: 7 }}>Slots</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View
                style={[
                  styles.btnconcontainer,
                  { marginTop: 10, marginLeft: "3%" },
                ]}
              >
                <Pressable
                  android_ripple={{ color: "white" }}
                  style={[
                    styles.editcontainer,
                    { width: (80 / 100) * Dimensions.get("window").width },
                  ]}
                  onPress={(e) => handleReset()}
                >
                  <Text style={styles.edittext}>Reset</Text>
                </Pressable>
              </View>
              <View style={[styles.btnconcontainer, { marginLeft: "3%" }]}>
                <Pressable
                  android_ripple={{ color: "white" }}
                  style={[
                    styles.cancelcontainer,
                    { width: (80 / 100) * Dimensions.get("window").width },
                  ]}
                  onPress={(e) => {
                    handleEdit();
                    let totalCapacity =
                      parseInt(tempnewhatchbackcapacity) +
                      parseInt(tempnewluxurycapacity) +
                      parseInt(tempnewsedancapacity) +
                      parseInt(tempnewsuvcapacity);
                    setTotalCapacity(totalCapacity);
                  }}
                >
                  <Text style={styles.canceltext}>Apply</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </ModalPopup>
      <View style={styles.parkingContainter}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <View style={styles.parking}>
            <View>
              <View style={styles.imgContainter}>
                <Image
                  source={{ uri: `data:image/gif;base64,${areaImage}` }}
                  style={styles.image}
                ></Image>
              </View>
            </View>
            <Entypo
              name="edit"
              size={24}
              color="rgba(1,0,87,0.78)"
              onPress={changeParkingPicture}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={styles.name}>{newservicename}</Text>
          </View>
        </View>
        <View style={styles.parkingInfo}>
          <View style={styles.row}>
            <FontAwesome5
              name="user"
              size={27}
              color="rgba(1,0,87,0.78)"
              style={{ marginLeft: 24, marginRight: 22 }}
            />
            <View style={{ justifyContent: "center" }}>
              <Text style={styles.rowTextInfo1}>Provider Name</Text>
              <Text style={styles.rowTextInfo2}>{currentUser.user.name}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Ionicons
              name="car-sport"
              size={30}
              color="rgba(1,0,87,0.78)"
              style={{ marginLeft: 20, marginRight: 18 }}
            />
            <View style={{ justifyContent: "center" }}>
              <Text style={styles.rowTextInfo1}>Vehicles Information</Text>
              <View style={{ justifyContent: "center" }}>
                {newhatchbackcapacity > 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      width: Dimensions.get("window").width - 120,
                    }}
                  >
                    <Text
                      style={[
                        styles.rowTextInfo3,
                        {
                          marginLeft: 0,
                          fontSize: 16,
                          marginTop: 0,
                          fontWeight: "500",
                          alignSelf: "flex-start",
                        },
                      ]}
                    >
                      Hatchback :{" "}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        width: Dimensions.get("window").width - 215,
                        flexWrap: "wrap",
                        textAlignVertical: "top",
                      }}
                    >
                      <Text
                        style={[
                          styles.rowTextInfo3,
                          { marginRight: 5, marginTop: 2, fontSize: 16 },
                        ]}
                      >
                        {newhatchbackrate} Rs. ,
                      </Text>
                      <Text
                        style={[
                          styles.rowTextInfo3,
                          {
                            textAlign: "center",
                            textAlignVertical: "center",
                            marginTop: 0,
                            fontSize: 16,
                          },
                        ]}
                      >
                        {newhatchbackcapacity} Slots
                      </Text>
                    </View>
                  </View>
                ) : null}
                {newsedancapacity > 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      width: Dimensions.get("window").width - 120,
                    }}
                  >
                    <Text
                      style={[
                        styles.rowTextInfo3,
                        {
                          fontSize: 16,
                          marginLeft: 0,
                          marginTop: 0,
                          fontWeight: "500",
                          alignSelf: "flex-start",
                        },
                      ]}
                    >
                      Sedan :{" "}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        width: Dimensions.get("window").width - 215,
                        flexWrap: "wrap",
                        textAlignVertical: "top",
                      }}
                    >
                      <Text
                        style={[
                          styles.rowTextInfo3,
                          {
                            marginRight: 5,
                            textAlign: "center",
                            textAlignVertical: "center",
                            marginTop: 2,
                            fontSize: 16,
                          },
                        ]}
                      >
                        {newsedanrate} Rs. ,
                      </Text>
                      <Text
                        style={[
                          styles.rowTextInfo3,
                          {
                            textAlign: "center",
                            textAlignVertical: "center",
                            marginTop: 0,
                            fontSize: 16,
                          },
                        ]}
                      >
                        {newsedancapacity} Slots
                      </Text>
                    </View>
                  </View>
                ) : null}
                {newsuvcapacity > 0 ? (
                  <View
                    style={{
                      flexDirection: "row",
                      width: Dimensions.get("window").width - 120,
                    }}
                  >
                    <Text
                      style={[
                        styles.rowTextInfo3,
                        {
                          fontSize: 16,
                          marginLeft: 0,
                          marginTop: 0,
                          fontWeight: "500",
                          alignSelf: "flex-start",
                        },
                      ]}
                    >
                      SUV :{" "}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        width: Dimensions.get("window").width - 215,
                        flexWrap: "wrap",
                        textAlignVertical: "top",
                      }}
                    >
                      <Text
                        style={[
                          styles.rowTextInfo3,
                          {
                            marginRight: 5,
                            textAlign: "center",
                            textAlignVertical: "center",
                            marginTop: 2,
                            fontSize: 16,
                          },
                        ]}
                      >
                        {newsuvrate} Rs. ,
                      </Text>
                      <Text
                        style={[
                          styles.rowTextInfo3,
                          {
                            textAlign: "center",
                            textAlignVertical: "center",
                            marginTop: 0,
                            fontSize: 16,
                          },
                        ]}
                      >
                        {newsuvcapacity} Slots
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <MaterialIcons
              size={30}
              name="date-range"
              color="rgba(1,0,87,0.78)"
              style={{ marginTop: 0, marginHorizontal: 20 }}
            />
            <View style={{ justifyContent: "center" }}>
              <Text style={styles.rowTextInfo1}>Registered Date</Text>
              <Text style={styles.rowTextInfo2}>
                {(registrationdate.getDate().toString().length < 2
                  ? "0" + registrationdate.getDate().toString()
                  : registrationdate.getDate().toString()) +
                  "-" +
                  ((registrationdate.getMonth() + 1).toString().length < 2
                    ? "0" + (registrationdate.getMonth() + 1).toString()
                    : (registrationdate.getMonth() + 1).toString()) +
                  "-" +
                  registrationdate.getFullYear()}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <MaterialIcons
              name="reduce-capacity"
              size={29}
              color="rgba(1,0,87,0.78)"
              style={{ marginTop: 0, marginHorizontal: 20 }}
            />
            <View style={{ justifyContent: "center" }}>
              <Text style={styles.rowTextInfo1}>Total Capacity</Text>
              <Text style={styles.rowTextInfo2}>{totalcapacity}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="city-variant-outline"
              size={30}
              color="rgba(1,0,87,0.78)"
              style={{ marginTop: 0, marginLeft: 19, marginRight: 20 }}
            />
            <View style={{ justifyContent: "center" }}>
              <Text style={styles.rowTextInfo1}>City</Text>
              <Text style={styles.rowTextInfo2}>{route.params.item.city}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Octicons
              name="location"
              size={32}
              color="rgba(1,0,87,0.78)"
              style={{ marginLeft: 21, marginRight: 21 }}
            />
            <View style={{ justifyContent: "center" }}>
              <Text style={styles.rowTextInfo1}>Address</Text>
              <Text style={styles.rowTextInfo2}>
                {route.params.item.address}
              </Text>
            </View>
          </View>
          <CancelService cancelservice={cancelservice}>
            <View style={styles.modalheader}>
              <AntDesign
                name="close"
                size={24}
                color="rgba(1,0,87,0.78)"
                onPress={() => setCancelService(false)}
              />
            </View>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ marginLeft: 0 }}>
                {isDisplayDate && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={canceldate ? canceldate : new Date()}
                    mode={displaymode}
                    is24Hour={false}
                    display="default"
                    minimumDate={new Date()}
                    onChange={changeSelectedDate}
                  />
                )}
                <View style={styles.inputContainter2}>
                  <Pressable
                    style={[styles.input2, { flexDirection: "row" }]}
                    onPress={handleDate}
                  >
                    <MaterialIcons
                      name="date-range"
                      size={24}
                      color="rgba(1,0,87,0.78)"
                      style={{ marginTop: 15, marginLeft: 15, marginRight: 15 }}
                    />
                    <TextInput
                      style={[styles.entry2, { color: "black" }]}
                      editable={false}
                      value={
                        canceldate
                          ? (canceldate.getDate().toString().length < 2
                              ? "0" + canceldate.getDate().toString()
                              : canceldate.getDate().toString()) +
                            "-" +
                            ((canceldate.getMonth() + 1).toString().length < 2
                              ? "0" + (canceldate.getMonth() + 1).toString()
                              : (canceldate.getMonth() + 1).toString()) +
                            "-" +
                            canceldate.getFullYear()
                          : ""
                      }
                      placeholder="Enter Date"
                    />
                  </Pressable>
                </View>
                <View style={styles.queryrow}>
                  <View
                    style={[
                      styles.queryinput,
                      { flexDirection: "row", height: 130 },
                    ]}
                  >
                    <FontAwesome5
                      name="question-circle"
                      size={24}
                      color="rgba(1,0,87,0.78)"
                      style={{ marginTop: 15, marginLeft: 13, marginRight: 13 }}
                    />
                    <TextInput
                      multiline={true}
                      placeholder="Enter Your Reason Here"
                      numberOfLines={5}
                      style={[
                        styles.entry2,
                        { textAlignVertical: "top", marginTop: 15 },
                      ]}
                      value={cancelquery}
                      onChangeText={(value) => {
                        setcancelQuery(value);
                      }}
                    ></TextInput>
                  </View>
                </View>
                <View style={styles.btnconcontainer2}>
                  <Pressable
                    style={[styles.bookcontainer]}
                    android_ripple={{ color: "white" }}
                    onPress={cancelarea}
                  >
                    <Text style={styles.booktext}>Submit</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </CancelService>

          <View style={{ marginTop: 40, marginBottom: 0 }}>
            <View style={styles.btnconcontainer}>
              <Pressable
                android_ripple={{ color: "white" }}
                style={styles.editcontainer}
                onPress={(e) => setVisible(true)}
              >
                <Text style={styles.edittext}>Edit</Text>
              </Pressable>
            </View>
            <View style={styles.btnconcontainer}>
              <Pressable
                android_ripple={{ color: "white" }}
                style={styles.cancelcontainer}
                onPress={(e) => showcancelservice()}
              >
                <Text style={styles.canceltext}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E8F4F8",
  },
  inputContainter: {
    padding: 5,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  searchcontainer: {
    justifyContent: "center",
    marginHorizontal: 10,
    marginVertical: 20,
  },
  parkingContainter: {
    flex: 1,
    marginTop: 50,
    marginBottom: 50,
  },
  parking: {
    flexDirection: "row",
    marginLeft: "5%",
  },
  name: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
    color: "rgba(1,0,87,0.78)",
  },
  imgContainter: {
    width: 250,
    height: 250,
    overflow: "hidden",
    borderRadius: 125,
    borderWidth: 3,
    borderColor: "rgba(1,0,87,0.78)",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  parkingInfo: {
    marginTop: 50,
    paddingLeft: (2.5 / 100) * Dimensions.get("window").width,
  },
  row: {
    flexDirection: "row",
    marginLeft: (10 / 100) * Dimensions.get("window").width,
    marginBottom: 7,
  },
  rowhead: {
    fontWeight: "bold",
    fontSize: 18,
    color: "black",
  },
  rowinfo: {
    fontSize: 18,
    marginBottom: 20,
    width: Dimensions.get("window").width - 220,
  },
  listitem: {
    fontSize: 18,
  },
  btnconcontainer: {
    flex: 1,
  },
  queryrow: {
    flexDirection: "row",
    marginTop: 15,
  },
  rowTextHead: {
    fontWeight: "bold",
    fontSize: 17,
    borderWidth: 2,
  },
  input: {
    alignItems: "center",
    width: Dimensions.get("window").width - 200,
    height: 37,
    borderColor: "black",
    borderRadius: 10,
    borderBottomWidth: 2,
    color: "black",
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
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  btnconcontainer: {
    flex: 1,
    marginLeft: "2.5%",
  },
  btnconcontainer2: {
    flex: 1,
    marginLeft: "2.5%",
    marginVertical: 20,
  },
  editcontainer: {
    marginTop: 10,
    width: (90 / 100) * Dimensions.get("window").width,
    height: 50,
    marginLeft: (0 / 100) * Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "rgba(1,0,87,0.78)",
  },
  edittext: {
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 21,
    color: "white",
  },
  cancelcontainer: {
    marginTop: 10,
    width: (90 / 100) * Dimensions.get("window").width,
    height: 50,
    marginLeft: (0 / 100) * Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "rgba(1,0,87,0.78)",
  },
  canceltext: {
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 21,
    color: "white",
  },
  applycontainer: {
    marginTop: 10,
    width: (71 / 100) * Dimensions.get("window").width,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "rgba(1,0,87,0.78)",
    marginLeft: 18,
    marginLeft: (2 / 100) * Dimensions.get("window").width,
  },
  applytext: {
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 21,
    color: "white",
  },
  bookcontainer: {
    marginTop: 10,
    width: (71 / 100) * Dimensions.get("window").width,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "rgba(1,0,87,0.78)",
    marginLeft: 18,
    marginLeft: (2 / 100) * Dimensions.get("window").width,
  },
  booktext: {
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 21,
    color: "white",
  },
  row: {
    flexDirection: "row",
    width: Dimensions.get("window").width - 38,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 20,
  },
  rowTextInfo1: {
    fontSize: 17,
    fontWeight: "bold",
    width: Dimensions.get("window").width - 120,
    alignSelf: "center",
    marginBottom: 5,
  },
  rowTextInfo2: {
    fontSize: 17,
    width: Dimensions.get("window").width - 120,
    alignSelf: "center",
  },
  rowTextInfo3: {
    fontSize: 17,
    alignSelf: "center",
  },
  inputContainter: {
    padding: 5,
    marginTop: 10,
    flexDirection: "row",
    marginLeft: (1.5 / 100) * Dimensions.get("window").width,
  },
  input: {
    width: Dimensions.get("window").width - 80,
    height: 58,
    borderRadius: 20,
    backgroundColor: "white",
  },
  entry: {
    width: Dimensions.get("window").width - 150,
    fontSize: 16,
  },
  inputContainter2: {
    padding: 5,
    marginTop: 10,
    flexDirection: "row",
    marginLeft: (4.5 / 100) * Dimensions.get("window").width,
  },
  input2: {
    width: Dimensions.get("window").width - 123,
    height: 58,
    borderRadius: 20,
    backgroundColor: "white",
  },
  entry2: {
    width: Dimensions.get("window").width - 187,
    fontSize: 16,
  },
  queryrow: {
    marginTop: 20,
    flexDirection: "row",
    marginLeft: (6.5 / 100) * Dimensions.get("window").width,
  },
  queryinput: {
    width: Dimensions.get("window").width - 123,
    height: 58,
    borderRadius: 20,
    backgroundColor: "white",
  },
  modalbackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingTop: (25 / 100) * Dimensions.get("window").height,
  },
  modalcontainer: {
    marginLeft: "10.5%",
    width: "80%",
    height: "100%",
    backgroundColor: "#E8F4F8",
    paddingTop: 30,
    borderRadius: 20,
    elevation: 20,
  },
  modalbackground2: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingTop: (6.5 / 100) * Dimensions.get("window").height,
  },
  modalcontainer2: {
    marginLeft: "5%",
    width: "90%",
    height: "100%",
    backgroundColor: "#E8F4F8",
    paddingTop: 30,
    borderRadius: 20,
    elevation: 20,
  },
  modalheader: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 20,
  },
});

export default ApprovedProvidedAreaItem;
