import { Slot } from 'expo-router';
import Navbar from '../components/navigation/Navbar';

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <Slot />
    </>
  );
}
