import { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  Animated,
} from "react-native";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto, AntDesign } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { getParkingArea } from "../../Backend/ParkingAreas/AllAboutAreas";
import * as React from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { userContext } from "../../App";
import LoadingOverlay from "../CommonScreens/LoadingOverlay";
import { useLayoutEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import NoDataFound from "../CommonScreens/NoDataFound";
import { Dimensions } from "react-native";

const ShowAreaLocation = ({ showarea, children }) => {
  const [showModal, setShowModal] = useState(showarea);
  const scaleValue = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [showarea]);
  const toggleModal = () => {
    if (showarea) {
      setShowModal(true);

      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      setShowModal(false);

      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Modal transparent visible={showModal}>
      <View style={[styles.modelBackGroundArea]}>
        <View style={[styles.modelContainerArea]}>{children}</View>
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
        duration: 800,
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

function ApprovedProvidedAreaList({ navigation, route }) {
  const currentUser = useContext(userContext);
  const [fetching, setFetching] = useState(true);
  const [providedareas, setProvidedAreas] = useState(null);
  const [areasinfo, setAreasInfo] = useState(null);
  const [showarea, setShowArea] = useState(false);
  const [visible, setVisible] = useState(false);
  const handleItem = (id, item) => {
    navigation.navigate("ApprovedProvidedAreaItem", { id: id, item: item });
  };

  const filterByFields = (areasinfo) => {
    if (city == "" && car == "") {
      return true;
    }
    if (city) {
      if (areasinfo.city != city) {
        return false;
      }
    }
    if (car) {
      if (!areasinfo.cartypes.includes(car)) {
        return false;
      }
    }
    return true;
  };
  const handleFilter = () => {
    setVisible(false);
    setProvidedAreas(areasinfo.filter(filterByFields));
  };

  const handleClear = () => {
    setCity("");
    setCar("");
  };
  const showlocation = () => {
    setShowArea(true);
  };
  const [car, setCar] = useState();
  const [city, setCity] = useState();
  const getArea = async () => {
    try {
      setFetching(true);
      let result = await getParkingArea(currentUser.user.id, "Working");
      setProvidedAreas(result);
      setAreasInfo(result);
    } catch (error) {
      Alert.alert("Oops", "Something went wrong !!");
    } finally {
      setFetching(false);
    }
  };
  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (isFocused) {
      getArea();
    }
  }, [isFocused]);

  const render = (itemData) => {
    return (
      <View>
        <Pressable
          android_ripple={{ color: "rgb(168, 167, 163)" }}
          style={styles.locationitem}
        >
          <View style={styles.parkingnameandcars}>
            <View style={styles.header}>
              <Text style={styles.parkingname}>
                {itemData.item.servicename}
              </Text>
              <ShowAreaLocation showarea={showarea}>
                <View style={[styles.modalheader, { marginRight: 0 }]}>
                  <AntDesign
                    name="close"
                    size={24}
                    color="rgba(1,0,87,0.78)"
                    onPress={() => setShowArea(false)}
                  />
                </View>
                <View
                  style={[
                    styles.container,
                    styles.mapcontainerArea,
                    { flexDirection: "column", alignItems: "center" },
                  ]}
                >
                  <Text
                    style={[
                      styles.parkingname,
                      { marginBottom: 20, color: "rgba(1,0,87,0.78)" },
                    ]}
                  >
                    Your Area Location
                  </Text>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitudeDelta: 0.1922,
                      longitudeDelta: 0.1421,
                      latitude: itemData.item.location.latitude,
                      longitude: itemData.item.location.longitude,
                    }}
                    provider="google"
                    showsUserLocation={false}
                  >
                    <Marker
                      key={-1}
                      coordinate={{
                        latitude: itemData.item.location.latitude,
                        longitude: itemData.item.location.longitude,
                      }}
                      pinColor="red"
                      draggable={false}
                    >
                      <Callout style={{ flex: 1 }}>
                        <Text>Your Location</Text>
                      </Callout>
                    </Marker>
                  </MapView>
                </View>
              </ShowAreaLocation>
              <Pressable
                style={styles.imgContainter}
                android_ripple={{ color: "rgb(168, 167, 163)", radius: 5 }}
                onPress={showlocation}
              >
                <EvilIcons name="location" size={30} color="black" />
              </Pressable>
            </View>
            <View>
              <View
                style={[
                  { flexDirection: "row" },
                  { marginTop: 0, marginBottom: 0 },
                ]}
              >
                <Text style={{ color: "green", fontSize: 16 }}>Working</Text>
              </View>
              <View
                style={[
                  { flexDirection: "row" },
                  { marginTop: 15, marginBottom: 0 },
                ]}
              >
                <Text style={styles.citytext}>City : </Text>
                <Text style={styles.citytext}>{itemData.item.city}</Text>
              </View>
              <View style={[styles.lastrow]}>
                <View style={[styles.parkingcars, { marginTop: 0 }]}>
                  <View style={styles.carcontainer}>
                    {itemData.item.cartypes.map((car) => (
                      <View key={car} style={styles.car}>
                        <Text style={styles.cartext}>{car}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <Pressable
                  android_ripple={{ color: "rgb(168, 167, 163)", radius: 5 }}
                  onPress={(e) => handleItem(itemData.id, itemData.item)}
                >
                  <Text style={[styles.knowmore]}>{"Know More >>"}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  if (fetching) {
    return <LoadingOverlay />;
  }

  return providedareas ? (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-end",
            marginTop: 15,
            marginRight: 20,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "rgba(1,0,87,0.78)",
            }}
          >
            Filter{" "}
          </Text>
          <Fontisto
            style={{ marginTop: 5 }}
            name="filter"
            size={24}
            color="rgba(1,0,87,0.78)"
            onPress={() => {
              setVisible(true);
            }}
          />
        </View>
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
                  <MaterialCommunityIcons
                    name="city-variant-outline"
                    size={24}
                    color="rgba(1,0,87,0.78)"
                    style={{ marginTop: 15, marginLeft: 15, marginRight: 15 }}
                  />
                  <TextInput
                    style={styles.entry}
                    value={city}
                    onChangeText={(city) => setCity(city)}
                    placeholder="Enter City (Optional)"
                  ></TextInput>
                </View>
              </View>
              <View style={styles.inputContainter}>
                <View style={[styles.input, { flexDirection: "row" }]}>
                  <Ionicons
                    name="car-sport-outline"
                    size={24}
                    color="rgba(1,0,87,0.78)"
                    style={{ marginTop: 15, marginHorizontal: 15 }}
                  />
                  <TextInput
                    style={styles.entry}
                    value={car}
                    onChangeText={(car) => setCar(car)}
                    placeholder="Enter Car (Optional)"
                  ></TextInput>
                </View>
              </View>
              <View style={{ marginTop: 20, marginBottom: 10 }}>
                <Pressable
                  style={styles.applycontainer}
                  android_ripple={{ color: "white" }}
                  onPress={(e) => handleClear()}
                >
                  <Text style={styles.applytext}>Clear</Text>
                </Pressable>
                <Pressable
                  style={styles.applycontainer}
                  android_ripple={{ color: "white" }}
                  onPress={(e) => handleFilter()}
                >
                  <Text style={styles.applytext}>Apply</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </ModalPopup>
        {providedareas.length !== 0 ? (
          <View style={styles.locationcontainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={providedareas}
              renderItem={(itemData) => render(itemData)}
              keyExtractor={(item, index) => item.id}
            />
          </View>
        ) : (
          <NoDataFound />
        )}
      </View>
    </View>
  ) : (
    <NoDataFound />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E8F4F8",
  },
  container: {
    flex: 1,
    marginHorizontal: 2,
    marginBottom: 20,
  },
  searchcontainer: {
    justifyContent: "center",
    marginHorizontal: 10,
    marginVertical: 20,
  },
  locationcontainer: {
    borderColor: "black",
    flex: 1,
    justifyContent: "center",
    marginTop: 10,
  },
  locationitem: {
    marginTop: 20,
    borderWidth: 0.5,
    borderRadius: 5,
    flex: 1,
    flexDirection: "row",
    margin: 5,
    padding: 10,
  },
  parkingname: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 0,
  },
  parkingnameandcars: {
    marginTop: 0,
    flexBasis: "100%",
  },
  parkingcars: {
    marginTop: 0,
    flexBasis: "70%",
  },
  carcontainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  car: {
    borderColor: "grey",
    alignItems: "center",
    minWidth: 60,
    marginTop: 3,
    marginBottom: 5,
    marginRight: 5,
    padding: 5,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "lightgrey",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imgContainter: {
    marginTop: 7,
    marginRight: 7,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  citytext: {
    fontSize: 15,
  },
  lastrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },
  knowmore: {
    marginTop: 10,
    marginRight: 5,
    color: "rgba(1,0,87,0.78)",
  },
  input: {
    paddingLeft: 5,
    minWidth: 200,
    maxWidth: 500,
    minHeight: 37,
    maxHeight: 40,
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
  applycontainer: {
    marginTop: 20,
    minWidth: 200,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "red",
  },
  applytext: {
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },
  modelBackGroundArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modelContainerArea: {
    width: "95%",
    height: "85%",
    backgroundColor: "#E8F4F8",
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  mapcontainerArea: {
    marginHorizontal: 20,
    flex: 1,
    backgroundColor: "#E8F4F8",
    alignItems: "center",
    marginTop: "2%",
  },
  map: {
    width: "110%",
    height: "93%",
  },
  locationcontainer: {
    borderColor: "black",
    flex: 1,
    marginTop: 10,
    margin: 5,
  },
  locationitem: {
    marginTop: 10,
    borderRadius: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(1,0,87,0.78)",
    margin: 5,
    padding: 10,
    backgroundColor: "white",
    elevation: 2,
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
  inputContainter: {
    padding: 5,
    marginTop: 10,
    flexDirection: "row",
    marginLeft: (2 / 100) * Dimensions.get("window").width,
  },
  input: {
    width: Dimensions.get("window").width - 123,
    height: 58,
    borderRadius: 20,
    backgroundColor: "white",
  },
  entry: {
    width: Dimensions.get("window").width - 187,
    fontSize: 16,
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
  modalheader: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 20,
  },
});

export default ApprovedProvidedAreaList;
