import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { VictoryPie, VictoryLabel } from "victory-native";
import { Dimensions } from "react-native";
import Svg from "react-native-svg";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { parkingTraffic } from "../../Backend/Statistics/Cars";
import LoadingOverlay from "../CommonScreens/LoadingOverlay";
import { Alert } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default ParkingRevenue = ({ route }) => {
  const [fetching, setFetching] = useState(true);
  const [parking, setParking] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [colorScale, setColorScale] = useState([]);
  const [nameToColor, setNameToColor] = useState({});
  const [totalTraffic, setTotalTraffic] = useState(0);

  useLayoutEffect(() => {
    const getStatistics = async () => {
      setFetching(true);
      try {
        let [flag, totalTraffic, chartData] = await parkingTraffic({
          parkingid: route.params.id,
        });
        if (flag) {
          setTotalTraffic(totalTraffic);
          let hue = 0;
          let alpha = 0.9;
          var colors = [];
          var nameToColor = {};
          for (let j = 0; j < chartData.length; j++) {
            let color = "hsla(" + hue + ",80%,45%," + alpha + ")";
            colors.push(color);
            hue += 500;
            nameToColor[chartData[j].name] = color;
          }
          setNameToColor(nameToColor);
          setColorScale(colors);
          setChartData(chartData);
        }
      } catch (error) {
        Alert.alert("Oops", "Something went wrong !!");
      } finally {
        setFetching(false);
      }
    };
    getStatistics();
  }, []);

  if (fetching) {
    return <LoadingOverlay />;
  }

  return chartData ? (
    <ScrollView style={{ flex: 1, backgroundColor: "#E8F4F8" }}>
      <View style={[styles.container, { marginBottom: 50 }]}>
        <Text
          style={{
            marginTop: 50,
            fontSize: 20,
            fontWeight: "bold",
            color: "rgba(1,0,87,0.78)",
          }}
        >
          Total Cars : {totalTraffic} Cars
        </Text>
        <Svg height={400} width={400} style={{ width: "100%", height: "auto" }}>
          <VictoryPie
            data={chartData}
            standalone={false}
            radius={({ datum }) =>
              parking && parking.name == datum.name ? 400 * 0.4 : 400 * 0.4 - 10
            }
            animate={{
              duration: 2000,
            }}
            innerRadius={70}
            labelRadius={({ innerRadius }) => (400 * 0.4 + innerRadius) / 2.5}
            style={{
              labels: {
                fill: "white",
                fontWeight: "bold",
              },
            }}
            labels={({ datum }) => (datum.y == 0 ? null : datum.label)}
            width={400}
            height={400}
            labelPlacement={"parallel"}
            labelPosition={"centroid"}
            colorScale={colorScale}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onPressIn: () => {
                    return [
                      {
                        target: "data",
                        mutation: (props) => {
                          if (
                            parking &&
                            parking.name == chartData[props.index].name
                          ) {
                            setParking(null);
                          } else {
                            setParking({ name: chartData[props.index].name });
                          }
                        },
                      },
                    ];
                  },
                },
              },
            ]}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{
              fontSize: 18,
              fill: "rgba(1,0,87,0.78)",
              fontWeight: "500",
            }}
            x={200}
            y={200}
            text={`${chartData.length}\n${
              chartData.length > 1 ? "Types" : "Type"
            }`}
          ></VictoryLabel>
        </Svg>

        <View style={{ flex: 1, width: screenWidth - 30, margin: 10 }}>
          {chartData.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  height: 40,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  backgroundColor:
                    parking && parking.name == item.name
                      ? nameToColor[parking.name]
                      : "#E8F4F8",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  if (parking && parking.name == item.name) {
                    setParking(null);
                  } else {
                    setParking({ name: item.name });
                  }
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      backgroundColor:
                        parking && parking.name == item.name
                          ? "white"
                          : nameToColor[item.name],
                    }}
                  ></View>
                  <Text
                    style={{
                      maxWidth: 170,
                      marginLeft: 20,
                      color:
                        parking && parking.name == item.name
                          ? "#E8F4F8"
                          : "rgba(1,0,87,0.78)",
                      fontWeight: "500",
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
                <View style={{}}>
                  <Text
                    style={{
                      color:
                        parking && parking.name == item.name
                          ? "white"
                          : "rgba(1,0,87,0.78)",
                      fontWeight: "500",
                    }}
                  >
                    {item.y + " Cars - " + item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E8F4F8",
  },
});
