import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import api from '@/api';
import { AuthContext } from '@/components/contexts/AuthContext';

export default function Index() {
  const [backendGreeting, setBackendGreeting] = useState<string>('');
  const { userId, token } = useContext(AuthContext);
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

      if (!userId) {
        router.push('/login');
      }
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

      {/* {userId ? (
        <>
          <Text>Welcome back, User {userId}!</Text>
          <Text>Your token is: {token}</Text>
        </>
      ) : (
        // router.replace('/login');
        <LoginForm />
      )} */}
    </View>
  );
}
