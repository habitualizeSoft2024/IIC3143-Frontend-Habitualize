import { Slot, Stack } from 'expo-router';
import AuthProvider from '../components/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* <Slot /> */}
      {/* se intercambio usar el ruteo de Slot por Stack por mejor documentacion, hablar con Benja */}
      <Stack>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </AuthProvider>
  );
}
