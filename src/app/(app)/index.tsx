import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import api from '@/api';
import { useSession } from '@/contexts/AuthContext';

export default function Index() {
  const [backendGreeting, setBackendGreeting] = useState<string>('');
  const { userId, token } = useSession();
  const router = useRouter();

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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        {backendGreeting
          ? 'Backend says: ' + backendGreeting
          : 'No greetings available from backend :'}
      </Text>

      {
        <>
          if (userId){' '}
          {
            <>
              <Text>Welcome back, User {userId}!</Text>
              <Text>Your token is: {token}</Text>
            </>
          }
        </>
      }
    </View>
  );
}
