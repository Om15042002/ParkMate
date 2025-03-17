import React, { useContext } from 'react'
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import { context } from './SearchTabs'
import LoadingOverlay from '../LoadingOverlay'
import NoDataFound from '../NoDataFound'

function SearchByList({ navigation }) {

    const search = useContext(context)
    const handleItem = (item) => {
        navigation.navigate("ParkingItem", { item: item, car: search.car, duration: search.duration, date: search.date })
    }

    const render = (itemData) => {
        return (
            <View>
                <Pressable android_ripple={{ color: 'rgb(168, 167, 163)' }} style={styles.locationitem} >
                    <View style={styles.parkingnameandcars}>
                        <Text style={styles.parkingname}>{itemData.item.servicename}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.citytext}>City : </Text>
                            <Text style={styles.citytext}>{itemData.item.city}</Text>
                        </View>
                        <View style={[styles.lastrow, { marginTop: 10 }]}>
                            <View style={styles.carcontainer}>
                                {
                                    itemData.item.cartype.map(
                                        car => (
                                            <View key={car} style={styles.car}>
                                                <Text style={styles.cartext}>{car}</Text>
                                            </View>
                                        )
                                    )
                                }
                            </View>
                            <Pressable android_ripple={{ color: 'rgb(168, 167, 163)', radius: 5 }} onPress={e => handleItem(itemData.item)}>
                                <Text style={[styles.knowmore, { marginTop: 10 }]}>{"Know More >>"}</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </View>
        )
    }

    if (search.fetching) {
        return <LoadingOverlay />
    }
    return (

        search.locations ?
            <View style={styles.screen}>
                <View style={styles.container}>
                    <View style={styles.locationcontainer}>
                        <FlatList showsVerticalScrollIndicator={false} data={search.locations} renderItem={(itemData) => render(itemData)} keyExtractor={(item) => item.serviceid} />
                    </View>
                </View></View> : <NoDataFound />

    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#E8F4F8',
    },
    container: {
        flex: 1,
        marginHorizontal: 2,
        marginBottom: 20,
    },
    locationcontainer: {
        borderColor: 'black',
        flex: 1,
        marginTop: 10,
        margin: 5,
    },
    locationitem: {
        marginTop: 10,
        borderRadius: 10,
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(1,0,87,0.78)',
        margin: 5,
        padding: 10,
        backgroundColor: 'white',
        elevation: 2,
    },
    parkingname: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
    },
    parkingnameandcars: {
        flexBasis: '70%',
    },
    availbility: {
        flexBasis: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    availbilitytext: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    carcontainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    car: {
        borderColor: 'grey',
        alignItems: 'center',
        minWidth: 60,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
        backgroundColor: 'lightgrey',
    },
    cartext: {
        color: 'black',
        fontSize: 12,
    },
    citytext: {
        fontSize: 15,
    },
    lastrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    knowmore: {
        marginRight: 2,
        color: 'rgba(1,0,87,0.78)',
    },
})


export default SearchByList