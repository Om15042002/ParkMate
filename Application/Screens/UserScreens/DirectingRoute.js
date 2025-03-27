import React, { useEffect, useRef } from 'react';
import MapView, { Callout, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import * as Location from 'expo-location';
import { useState, useLayoutEffect } from 'react'
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_API_KEY = "AIzaSyBdhAmcXNW6R24eXCQvU2X9wLgGtn2p80A"

function DirectingRoute({ route }) {
  const mapRef = useRef()
  const [origin, setOrigin] = useState(route.params.source)
  const [destination, setDestination] = useState(route.params.item.destination)
  const [distance, setDistance] = useState(1)
  const [duration, setDuration] = useState(1)
  const [go, setGo] = useState(false)
  const edgePadding = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50,
  }
  useLayoutEffect(() => {
    if (!go) {
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding })
    }
    else {
      mapRef.current?.animateCamera({ center: origin, zoom: 19 }, { duration: 2000 })
    }
    return () => {
      clearInterval(followUser)
    }
  }, [go, origin, mapRef.current])


  const onReady = (args) => {
    if (args) {
      setDistance(args.distance)
      setDuration(args.duration)
    }
  }

  var followUser = null;

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {

    }
    try {
      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      setOrigin({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    }
    catch (error) {
      clearInterval(followUser)
      Alert.alert(
        "Error",
        "Directions won't work without GPS"
      )
    }
  }
  const traceRoute = () => {
    (
      async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {

        }
        try {
          let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
          setOrigin({ latitude: location.coords.latitude, longitude: location.coords.longitude });
          setGo(true)
        }
        catch (error) {
          Alert.alert(
            "Error",
            "Directions won't work without GPS"
          )
        }
      }
    )()
    followUser = setInterval(() => {
      getCurrentLocation();
    }, 5000);
  }
  useEffect(() => {
    return () => {
      clearInterval(followUser)
    }
  }, [])

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{ ...origin, latitudeDelta: 0.1922, longitudeDelta: 0.1421 }}
        provider="google"
      >
        <MapViewDirections
          origin={origin}
          destination={destination}
          strokeWidth={7}
          strokeColor='#3388FF'
          onReady={onReady}
          apikey={GOOGLE_API_KEY}
          geodesic={true}
          lineCap="round"
          mode="DRIVING"
          optimizeWaypoints={false}
          precision="low"
          resetOnChange={true}
          timePrecision="none"
        />
        <Marker
          coordinate={origin}
          pinColor='red'
          draggable={false}
          onPress={e => {
          }}
        >
          <Callout style={{ flex: 1 }}>
            <Text>Your Location</Text>
          </Callout>
        </Marker>
        <Marker
          coordinate={destination}
          pinColor='red'
          draggable={false}
          onPress={e => {
          }}
        >
          <Callout style={{ flex: 1 }}>
            <Text>{route.params.item.parkingname}</Text>
          </Callout>
        </Marker>
      </MapView>
      {
        distance && duration ? (!go ? <View style={styles.infocontainer}>
          <View style={styles.info}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.infotext}>Distance : </Text>
              <Text style={[styles.infotext2]}>{distance.toFixed(2)} Km</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.infotext}>Time : </Text>
              <Text style={[styles.infotext2]}>{Math.ceil(duration)} Min</Text>
            </View>
          </View>
          <View style={styles.gocontainer}>
            <Pressable style={styles.gopressable} android_ripple={{ color: 'white' }} onPress={traceRoute}>
              <Text style={styles.go}>Go</Text>
            </Pressable>
          </View>
        </View> : <View style={[styles.infocontainer, { height: '10%', justifyContent: 'center' }]}>
          <View style={styles.info}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.infotext}>Distance : </Text>
              <Text style={[styles.infotext2]}>{distance.toFixed(2)} Km</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.infotext}>Time : </Text>
              <Text style={[styles.infotext2]}>{Math.ceil(duration)} Min</Text>
            </View>
          </View>
        </View>) : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  infocontainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#E8F4F8',
    elevation: 5,
    padding: 8,
    borderRadius: 0,
    bottom: 0,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  infotext: {
    fontWeight: '600',
    fontSize: 18,
    color: 'rgba(1,0,87,0.78)'
  },
  infotext2: {
    fontWeight: '400',
    fontSize: 18,
    marginTop: 1,
  },
  gocontainer: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
  },
  gopressable: {
    width: (40 / 100) * (Dimensions.get('window').width),
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: 'rgba(1,0,87,0.78)'
  },
  go: {
    alignItems: 'center',
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});


export default DirectingRoute