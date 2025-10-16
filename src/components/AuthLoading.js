import { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { supabase } from '../../utils/supabase'

export default function AuthLoading({ navigation }) {
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        navigation.replace('TabNavigator')
      } else {
        navigation.replace('Logar')
      }
    }

    checkSession()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#002D85" />
    </View>
  )
}
