import { Text, View } from 'react-native';
import { useCallback, useState } from 'react';
import api from '@/api';
import { useFocusEffect } from 'expo-router';

export default function Index() {
  const [backendGreeting, setBackendGreeting] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      async function getBackendGreeting() {
        try {
          const response = await api.getGreeting();
          setBackendGreeting(response.data);
        } catch (error) {
          console.error(error);
        }
      }
      getBackendGreeting();
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Hello, World!</Text>
      <Text>
        {backendGreeting
          ? 'Backend says: ' + backendGreeting
          : 'No greetings available from backend :('}
      </Text>
    </View>
  );
}
