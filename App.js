
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from "./src/routes/StackNavigator";
import { NotificacaoProvider } from "./src/components/NotificacaoContext";

export default function App() {
  return (
    <NotificacaoProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </NotificacaoProvider>
  );
}
