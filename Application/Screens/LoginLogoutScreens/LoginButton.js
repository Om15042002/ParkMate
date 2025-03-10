import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'

function LoginButton() {
    var navigation = useNavigation()
    const openLogin = () => {
        navigation?.navigate("LoginFlow")
    }
    const wcolor = 'rgb(168, 167, 163)'
    return (
        <View style={styles.container}>
            <Pressable android_ripple={{ color: wcolor, radius: 5 }} onPress={openLogin}>
                <Text style={styles.text}>Login</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 7,
        marginRight: 15
    },
    text: {
        margin: 2,
        color: 'rgba(1,0,87,0.78)',
        fontSize: 18,
        fontWeight: 'bold',
    }
})

export default LoginButton