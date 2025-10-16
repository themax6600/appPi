
import { createStackNavigator } from "@react-navigation/stack"

import CriarConta from "../screens/CriarConta"
import Initial from "../screens/Initial"
import Logar from "../screens/Logar"
import TabNavigator from "../routes/TabNavigator"
import AuthLoading from "../components/AuthLoading"

const Stack = createStackNavigator()

export default function StackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Initial" component={Initial} />
            <Stack.Screen name="CriarConta" component={CriarConta} />
            <Stack.Screen name="Logar" component={Logar} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="AuthLoading" component={AuthLoading} />
        </Stack.Navigator>
    )
}