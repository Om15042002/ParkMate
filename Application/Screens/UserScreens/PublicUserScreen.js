import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import PublicUserHomeScreen from './PublicUserHomeScreen';
import LogoutScreen from '../LoginLogoutScreens/LogoutScreen';
import UserProfileScreen from './UserProfileScreen';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import CustomDrawer from './CustomeDrawer';
import Subscriptions from './Subscriptions';
import Bookings from './Bookings';

const Drawer = createDrawerNavigator()
function PublicUserScreen({ setSkip, loggedin, setLoginClicked, setLoggedIn }) {
  return (
    <Drawer.Navigator initialRouteName="UserHome"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerType: 'front',
        headerShown: true,
        drawerActiveBackgroundColor: 'rgba(1,0,87,0.78)',
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: 'black',
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
        headerStyle: { backgroundColor: '#E8F4F8' },
        headerTintColor: 'rgba(1,0,87,0.78)',
        lazy: true,
        overlayColor: 'rgba(0,0,0,0.4)',
        swipeEnabled: true,
        drawerHideStatusBarOnOpen: false
      }}>
      <Drawer.Screen name="UserProfile" component={UserProfileScreen} options={{
        title: "Profile",
        drawerIcon: ({ color }) => (
          <AntDesign name="profile" size={24} color={color} />
        ),
      }} />
      <Drawer.Screen initialParams={{ setSkip: setSkip, loggedin: loggedin, setLoginClicked: setLoginClicked, setLoggedIn: setLoggedIn, userType: "Public" }} name="UserHome" component={PublicUserHomeScreen} options={{
        title: "Home",
        drawerIcon: ({ color }) => (
          <Ionicons name="home-outline" size={24} color={color} />
        ),
      }} />
      <Drawer.Screen name="Bookings" component={Bookings} options={{
        title: "Bookings",
        drawerIcon: ({ color }) => (
          <Ionicons name="bookmark-outline" size={24} color={color} />
        ),
      }} />
      <Drawer.Screen name="Subscriptions" component={Subscriptions} options={{
        title: "Subscriptions",
        drawerIcon: ({ color }) => (
          <Ionicons name="bookmarks-outline" size={24} color={color} />
        ),
      }} />
      <Drawer.Screen initialParams={{ loggedin: loggedin, setLoggedIn: setLoggedIn }} name="Logout" component={LogoutScreen} options={{
        title: "Logout",
        drawerIcon: ({ color }) => (
          <AntDesign name="logout" size={22} color={color} />
        ),
      }} />
    </Drawer.Navigator>
  )
}


export default PublicUserScreen