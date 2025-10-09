import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SescSenac from "../../assets/img/sescsenac.png";

import Home from '../screens/Home';
import Notificacoes from "../screens/Notificacoes";
import Contato from "../screens/Contato";
import Perfil from "../screens/Perfil";

const tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#93BEFF',
                },
                headerStyle: {
                    backgroundColor: '#93BEFF',
                },
                headerTitle: () => (
                    <Image source={SescSenac} style={{ width: 202, height: 77, marginBottom: 30, }} />
                ),
                headerTitleAlign: 'center',
            }}
        >
            <tab.Screen name="Home" component={Home}
                options={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#898875',
                    tabBarIcon: () => (
                        <Image
                            style={{ width: 24, height: 24 }}
                            source={require('../../assets/img/home.webp')}
                        />
                    ),
                }}
            />
            <tab.Screen name="Contato" component={Contato}
                options={{
                    tabBarActiveTintColor: '#898875',
                    tabBarIcon: () => (
                        <Image
                            style={{ width: 24, height: 24 }}
                            source={require('../../assets/img/3.png')}
                        />
                    ),
                }}
            />
            <tab.Screen name="Notificações" component={Notificacoes}
                options={{
                    tabBarActiveTintColor: '#898875',
                    tabBarIcon: () => (
                        <Image
                            style={{ width: 24, height: 24 }}
                            source={require('../../assets/img/2.png')}
                        />
                    ),
                }}
            />
            <tab.Screen name="Perfil" component={Perfil}
                options={{
                    tabBarActiveTintColor: '#898875',
                    tabBarIcon: () => (
                        <Image
                            style={{ width: 24, height: 24 }}
                            source={require('../../assets/img/1.png')}
                        />
                    ),
                }}
            />

        </tab.Navigator>
    )
}
