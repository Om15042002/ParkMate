import * as React from 'react';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { context } from './SearchTabs';
import { useContext } from 'react';
import LoadingOverlay from '../LoadingOverlay';
import NoDataFound from '../NoDataFound';

function SearchByMap({ navigation }) {

  const search = useContext(context)
  var lcn = null
  if (search.nearby) {
    lcn = { ...search.clocation }
  }
  else {
    if (search.locations)
      lcn = { ...search.locations[0].location }
  }
  if (search.fetching) {
    return <LoadingOverlay />
  }
  return (

    search.locations ?
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{ ...lcn, latitudeDelta: 0.1922, longitudeDelta: 0.1421 }}
          provider="google"
        >
          {
            search.nearby ?
              <Marker
                key={-1}
                coordinate={search.clocation}
                pinColor='#EE4B2B'
                draggable={false}
              >
                <Callout style={{ flex: 1 }}>
                  <Text>Your Location</Text>
                </Callout>
              </Marker> : null
          }
          {
            search.locations.map((location, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={location.location}
                  pinColor='skyblue'
                  draggable={false}
                  onDragStart={e => {
                  }}
                  onDragEnd={e => {
                  }}
                  onPress={e => {
                    navigation.navigate("ParkingItem", { item: location, car: search.car, duration: search.duration, date: search.date })
                  }}
                >
                  <Callout style={{ flex: 1 }}>
                    <Text>{location.servicename}</Text>
                  </Callout>
                </Marker>
              )
            })
          }
          {search.nearby ? <Circle center={{ ...search.clocation }} radius={5000} /> : null}
        </MapView>
      </View> : <NoDataFound />
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
});


export default SearchByMap