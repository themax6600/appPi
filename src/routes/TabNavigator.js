import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from '../screens/Home';
import Details from '../screens/Details';
import Local from "../screens/Local";
import Cart from "../screens/Cart";
import User from "../screens/User";

const tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <tab.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <tab.Screen name="Home" component={Home}
                options={{
                    tabBarActiveTintColor: '#898875',
                    tabBarLabael: "Caffee",
                    tabBarIcon: () => (
                        <Image
                            style={{ width: 24, height: 24 }}
                            source={require('../../assets/img/casa.png')}
                        />
                    ),
                }}
            />
            <tab.Screen name="Local" component={Local}
                options={{
                    tabBarActiveTintColor: '#898875',
                    tabBarLabael: "Local",
                    tabBarIcon: () => (
                        <Image
                            style={{ width: 24, height: 24 }}
                            source={require('../../assets/img/marcador.png')}
                        />
                    ),
                }}
            />
            <tab.Screen name="Cart" component={Cart}
                options={{
                    tabBarActiveTintColor: '#898875',
                    tabBarLabael: "Cart",
                    tabBarIcon: () => (
                        <Image
                            style={{ width: 24, height: 24 }}
                            source={require('../../assets/img/copo.png')}
                        />
                    ),
                }}
            />
            <tab.Screen name="User" component={User}
                options={{
                    tabBarActiveTintColor: '#898875',
                    tabBarLabael: "User",
                    tabBarIcon: () => (
                        <Image
                            style={{ width: 24, height: 24 }}
                            source={require('../../assets/img/user.png')}
                        />
                    ),
                }}
            />
            {<tab.Screen name="Details" component={Details} />}
        </tab.Navigator>
    )
}
