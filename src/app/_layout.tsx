import { Slot } from 'expo-router';
import AuthProvider from '../components/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
