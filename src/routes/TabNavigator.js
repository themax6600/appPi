import { Image, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import sesc from "../../assets/img/sesc.png"
import senac from "../../assets/img/senac.png";

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
                    backgroundColor: '#E8E8E8',
                },
                headerStyle: {
                    backgroundColor: '#004C99',
                },
                headerTitle: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={sesc}
                            style={{ width: 80, height: 50, resizeMode: 'contain', marginRight: 10 }}
                        />
                        <Image
                            source={senac}
                            style={{ width: 80, height: 50, resizeMode: 'contain' }}
                        />
                    </View>
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
                            style={{ width: 40, height: 40 }}
                            source={require('../../assets/img/home.png')}
                        />
                    ),
                }}
            />
            <tab.Screen name="Contato" component={Contato}
                options={{
                    tabBarActiveTintColor: '#898875',
                    tabBarIcon: () => (
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={require('../../assets/img/contato1.png')}
                        />
                    ),
                }}
            />
            <tab.Screen name="Notificações" component={Notificacoes}
                options={{
                    tabBarActiveTintColor: '#898875',
                    tabBarIcon: () => (
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={require('../../assets/img/notificacao.png')}
                        />
                    ),
                }}
            />
            <tab.Screen name="Perfil" component={Perfil}
                options={{
                    tabBarActiveTintColor: '#898875',
                    tabBarIcon: () => (
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={require('../../assets/img/perfil1.png')}
                        />
                    ),
                }}
            />

        </tab.Navigator>
    )
}
