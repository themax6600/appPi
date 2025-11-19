import { View, Image, TouchableWithoutFeedback, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withSequence,
    interpolateColor,
} from "react-native-reanimated";
import { useEffect } from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import sesc from "../../assets/img/sesc.png";
import senac from "../../assets/img/senac.png";

import Home from "../screens/Home";
import Notificacoes from "../screens/Notificacoes";
import Pedidos from "../screens/Pedidos";
import Perfil from "../screens/Perfil";
import Produtos from "../screens/Produtos";

import { useNotificacao } from "../components/NotificacaoContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AnimatedTabIcon({ source, focused, routeName }) {
    const navigation = useNavigation();
    const rotation = useSharedValue(0);
    const scale = useSharedValue(focused ? 1.3 : 1);
    const shadow = useSharedValue(focused ? 1 : 0);

    const animatedStyle = useAnimatedStyle(() => {
        const bgColor = interpolateColor(focused ? 1 : 0, [0, 1], ["transparent", "#FFC400"]);

        return {
            transform: [
                { scale: scale.value },
                { rotate: `${rotation.value}deg` },
            ],
            backgroundColor: bgColor,
            shadowColor: "#004C99",
            shadowOffset: { width: 0, height: 6 * shadow.value },
            shadowOpacity: 0.3 * shadow.value,
            shadowRadius: 12 * shadow.value,
            elevation: 10 * shadow.value,
        };
    });

    const handlePress = () => {
        scale.value = withSpring(0.90, {}, () => {
            scale.value = withSpring(focused ? 1.3 : 1);
        });

        rotation.value = withSequence(
            withTiming(-12, { duration: 80 }),
            withTiming(12, { duration: 80 }),
            withTiming(-8, { duration: 60 }),
            withTiming(8, { duration: 60 }),
            withTiming(0, { duration: 60 })
        );

        if (!focused) navigation.navigate(routeName);
    };

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <Animated.View
                style={[
                    {
                        padding: 12,
                        borderRadius: 30,
                        alignItems: "center",
                        justifyContent: "center",
                    },
                    animatedStyle,
                ]}
            >
                <Image
                    source={source}
                    style={{ width: 30, height: 30, tintColor: focused ? "#000" : "#808080" }}
                />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

function FadeScreen({ component: Component }) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, ...TransitionPresets.FadeFromBottomAndroid }}>
            <Stack.Screen name="Inner" component={Component} />
        </Stack.Navigator>
    );
}

export default function TabNavigator() {
    const { contador, zerarNotificacoes } = useNotificacao();

    const badgeScale = useSharedValue(1);

    useEffect(() => {
        badgeScale.value = 1;

        setTimeout(() => {
            badgeScale.value = 1.5;
            badgeScale.value = withSpring(1, { damping: 3, stiffness: 150 });
        }, 0);
    }, [contador]);

    const badgeAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: badgeScale.value }],
    }));

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: "#E8E8E8",
                    height: 70,
                    borderTopWidth: 0,
                    elevation: 8,
                    paddingBottom: 90,
                },
                headerStyle: { backgroundColor: "#004C99" },
                headerTitle: () => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={sesc} style={{ marginRight: 10 }} />
                        <Image source={senac} />
                    </View>
                ),
                headerTitleAlign: "center",
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Home"
                children={() => <FadeScreen component={Home} />}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabIcon
                            source={require("../../assets/img/home.png")}
                            focused={focused}
                            routeName="Home"
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Pedidos"
                children={() => <FadeScreen component={Pedidos} />}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabIcon
                            source={require("../../assets/img/produtos.png")}
                            focused={focused}
                            routeName="Pedidos"
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Produtos"
                children={() => <FadeScreen component={Produtos} />}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabIcon
                            source={require("../../assets/img/caixa.png")}
                            focused={focused}
                            routeName="Produtos"
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Notificações"
                children={() => <FadeScreen component={Notificacoes} />}
                listeners={{
                    tabPress: () => zerarNotificacoes()
                }}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View>
                            <AnimatedTabIcon
                                source={require("../../assets/img/notificacao.png")}
                                focused={focused}
                                routeName="Notificações"
                            />

                            {contador > 0 && (
                                <Animated.View
                                    style={[
                                        {
                                            position: "absolute",
                                            top: -2,
                                            right: -2,
                                            backgroundColor: "red",
                                            borderRadius: 12,
                                            width: 22,
                                            height: 22,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        },
                                        badgeAnimatedStyle,
                                    ]}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
                                        {contador}
                                    </Text>
                                </Animated.View>
                            )}
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Perfil"
                children={() => <FadeScreen component={Perfil} />}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AnimatedTabIcon
                            source={require("../../assets/img/perfil1.png")}
                            focused={focused}
                            routeName="Perfil"
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
