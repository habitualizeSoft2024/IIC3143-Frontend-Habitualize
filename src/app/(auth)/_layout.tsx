import { useSession } from '@/contexts/AuthContext';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { loggedIn } = useSession();
  if (loggedIn) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerTitle: '',
        headerStyle: { backgroundColor: '#E9FAF8' },
        contentStyle: {
          backgroundColor: '#E9FAF8',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
