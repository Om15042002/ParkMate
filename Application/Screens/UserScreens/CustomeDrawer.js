import React, { useContext } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { userContext } from '../../App';

const CustomDrawer = props => {
  const currentUser = useContext(userContext)
  return (
    <View style={{ flex: 1, backgroundColor: '#E8F4F8' }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: 'rgba(1,0,87,0.78)' }}>
        <ImageBackground
          style={{ padding: 20 }}>
          <View style={styles.imgContainter}>
            <Image source={{ uri: `data:image/gif;base64,${currentUser.user.profilepicture}` }} style={styles.image}></Image>
          </View>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 18,
              marginBottom: 5,
            }}>
            Hello, {currentUser.user.name}
          </Text>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#E8F4F8', paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imgContainter: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    borderRadius: 70,
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
})

export default CustomDrawer;