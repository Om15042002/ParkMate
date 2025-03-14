import React, { useState, useLayoutEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Dimensions } from "react-native";
import parking from "../../assets/Images/parking.png";
import revenue from "../../assets/Images/revenue.png";
import bparking from "../../assets/Images/bparking.png";
import LoadingOverlay from "../CommonScreens/LoadingOverlay";
import { getData } from "../../Backend/HomePages/Provider";
import { userContext } from "../../App";
import NoDataFound2 from "../CommonScreens/NoDataFound2";
import starImageFilled from "../../assets/Images/fillstar.png";
import starImageCorner from "../../assets/Images/emptystar.png";
import { useIsFocused } from "@react-navigation/native";

function ProviderMainScreen() {
  const currentUser = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let res = await getData(currentUser.user.id);
        setData(res);
      } catch (error) {
        Alert.alert("Oops", "Something went wrong !!");
      } finally {
        setLoading(false);
      }
    };
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);
  if (loading) {
    return <LoadingOverlay />;
  }
  const maxRating = [1, 2, 3, 4, 5];
  const CustomRatingBar = ({ rating }) => {
    return (
      <View style={styles.customRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity activeOpacity={0.7} key={item} onPress={() => {}}>
              <Image
                style={styles.starImageStyle}
                source={item <= rating ? starImageFilled : starImageCorner}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  return (
    <ImageBackground
      source={bparking}
      resizeMode="stretch"
      style={{ flex: 1, justifyContent: "center" }}
      imageStyle={{ opacity: 0.8 }}
    >
      {data ? (
        <ScrollView style={styles.screen}>
          <View style={styles.container}>
            <View style={styles.public}>
              <View style={styles.quote}>
                <Text style={styles.primequote}>Your Statistics</Text>
              </View>
              <View style={styles.servicestyle}>
                <View style={styles.serviceimagestyle}>
                  <Image
                    style={{ height: 70, width: 70 }}
                    source={parking}
                  ></Image>
                </View>
                <View style={styles.servicecontentstyle}>
                  <Text
                    style={styles.servicetitle}
                  >{`${data[0]}  Parkings`}</Text>
                </View>
              </View>
              <View style={styles.servicestyle}>
                <View style={[styles.serviceimagestyle, { marginTop: 5 }]}>
                  <Image
                    style={{ height: 60, width: 60 }}
                    source={revenue}
                  ></Image>
                </View>
                <View style={styles.servicecontentstyle}>
                  <Text
                    style={styles.servicetitle}
                  >{`Rs. ${data[1]}  Revenue`}</Text>
                </View>
              </View>
            </View>
            <View style={styles.parking}>
              <View style={[styles.quote, { marginTop: 35 }]}>
                <Text style={styles.primequote}>Your Top Parkings</Text>
              </View>
              <View>
                {data[2] ? (
                  data[2].map((location, index) => (
                    <View style={styles.locationitem} key={index}>
                      <View style={styles.parkingnameandcars}>
                        <Text style={styles.parkingname}>
                          {location.servicename}
                        </Text>
                        <CustomRatingBar rating={3 - index} />
                        <View style={[{ flexDirection: "row", marginTop: 17 }]}>
                          <Text style={{ fontWeight: "450", fontSize: 17 }}>
                            Revenue :{" "}
                          </Text>
                          <Text
                            style={{
                              fontWeight: "450",
                              fontSize: 17,
                              marginTop: 1,
                            }}
                          >{`${location.revenue} Rs.`}</Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <NoDataFound2 />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      ) : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 30,
    marginBottom: 20,
  },
  quote: {
    marginLeft: (5 / 100) * Dimensions.get("window").width,
    marginBottom: 16,
  },
  primequote: {
    fontWeight: "800",
    fontSize: 23,
    color: "rgba(1,0,87,0.78)",
    color: "white",
  },
  secondquote: {
    fontWeight: "500",
    fontSize: 16,
    color: "rgba(1,0,87,0.78)",
    color: "white",
  },
  servicestyle: {
    flex: 1,
    flexDirection: "row",
    alignContent: "flex-start",
    minHeight: "14%",
    width: "88%",
    borderColor: "black",
    elevation: 2,
    shadowColor: "#52006A",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 15,
    marginVertical: 5,
    marginLeft: (7 / 100) * Dimensions.get("window").width,
  },
  serviceimagestyle: {
    flexBasis: "25%",
    marginLeft: 30,
  },
  servicecontentstyle: {
    flexBasis: "62%",
    marginLeft: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  servicetitle: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "450",
    justifyContent: "center",
  },
  locationitem: {
    flex: 1,
    marginTop: 10,
    marginLeft: (7 / 100) * Dimensions.get("window").width,
    borderRadius: 5,
    width: "88%",
    padding: 10,
    borderColor: "black",
    elevation: 2,
    shadowColor: "#52006A",
    backgroundColor: "white",
    borderRadius: 20,
    paddingLeft: 15,
    paddingVertical: 10,
  },
  parkingname: {
    fontWeight: "500",
    fontSize: 18,
    marginBottom: 5,
  },
  customRatingBarStyle: {
    flexDirection: "row",
    marginTop: 0,
  },
  starImageStyle: {
    width: 21,
    height: 21,
    resizeMode: "cover",
    marginRight: 5,
  },
  rating: {
    marginTop: 10,
    marginLeft: 5,
    marginBottom: 20,
    fontSize: 20,
    color: "grey",
  },
  carcontainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  car: {
    alignItems: "center",
    marginTop: 7,
    marginBottom: 5,
    marginRight: 15,
  },
  cartext: {
    fontSize: 15,
  },
});

export default ProviderMainScreen;
