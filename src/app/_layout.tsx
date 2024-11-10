import { Slot } from 'expo-router';
import Navbar from '../components/navigation/Navbar';

import AuthProvider from '../components/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
