import { Alert } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SearchByList from './SearchByList';
import SearchByMap from './SearchByMap';
import { createContext, useState, useLayoutEffect } from 'react';
import { searchByCity } from '../../../Backend/Searching/SearchParkings';
import { searchNearBy } from '../../../Backend/Searching/SearchParkings';
const Tab = createMaterialTopTabNavigator();
export const context = createContext("")

export default function SearchTabs({ route }) {

  const [fetching, setFetching] = useState(true)
  const [locations, setLocations] = useState(null)

  useLayoutEffect(() => {
    setFetching(true)
    const getLocations = async () => {
      try {
        let searchData = { car: route.params.car, datetime: route.params.date, duration: route.params.duration }
        if (route.params.nearby) {
          searchData.clocation = route.params.clocation
          let tlocations = await searchNearBy(searchData)
          setLocations(tlocations)
        }
        else if (route.params.city) {
          searchData.city = route.params.city
          let tlocations = await searchByCity(searchData)
          setLocations(tlocations)
        }
      }
      catch (error) {
        Alert.alert("Oops", "Something went wrong !!")
      }
      finally {
        setFetching(false)
      }
    }
    getLocations();
  }, [])

  return (
    <context.Provider value={{ nearby: route.params.nearby, clocation: route.params.clocation, locations: locations, car: route.params.car, duration: route.params.duration, date: route.params.date, fetching: fetching }}>
      <Tab.Navigator screenOptions={{
        tabBarShowLabel: true,
        tabBarScrollEnabled: false,
        tabBarActiveTintColor: '#0096FF',
        tabBarInactiveTintColor: 'rgba(1,0,87,0.78)',
        tabBarLabelStyle: { fontSize: 15, fontWeight: '500' },
        tabBarStyle: { backgroundColor: '#E8F4F8' },
        tabBarIndicatorStyle: { backgroundColor: '#0096FF' },
      }}>
        <Tab.Screen name="List" component={SearchByList} />
        <Tab.Screen name="Map" component={SearchByMap} />
      </Tab.Navigator>
    </context.Provider>
  );
}