import { Button, Text, View } from 'react-native';
import Screen from '@/components/Screen';
import { router } from 'expo-router';

const LandingPage = () => {
  return (
    <Screen>
      <View>
        <Text>Bienvenido!</Text>
        <Button
          title="Iniciar Sesión"
          onPress={() => router.navigate('/login')}
        />
      </View>
    </Screen>
  );
};

export default LandingPage;
