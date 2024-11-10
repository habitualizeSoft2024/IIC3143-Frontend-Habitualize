import { useRouter } from 'expo-router';
import { Button, View } from 'react-native';

export default function Navbar() {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderColor: '#ddd',
      }}
    >
      <Button title="Inicio" onPress={() => router.push('/')} />
      {/* <Button title="Perfil" onPress={() => router.push('/profile')} />
      <Button title="Configuración" onPress={() => router.push('/settings')} /> */}
    </View>
  );
}
