import { useSession } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

export default function RootLayout() {
  const { loggedIn } = useSession();

  if (!loggedIn) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Inicio',
          headerTitle: 'Habitualize',
        }}
      />
    </Drawer>
  );
}
