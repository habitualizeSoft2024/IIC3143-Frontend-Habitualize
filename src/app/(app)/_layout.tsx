import { useSession } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Pressable, Text } from 'react-native';

export default function RootLayout() {
  const { loggedIn } = useSession();
  const { logOut } = useSession();

  if (!loggedIn) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Drawer
      screenOptions={{
        headerRight: () => (
          <Pressable onPress={logOut} style={{ marginRight: 10 }}>
            <Text>Cerrar sesión</Text>
          </Pressable>
        ),
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Inicio',
          headerTitle: 'Habitualize',
        }}
      />
      <Drawer.Screen
        name="habits"
        options={{
          drawerLabel: 'Hábitos',
          headerTitle: 'Mis Hábitos',
        }}
      />
    </Drawer>
  );
}
