import React, { useCallback, useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '@/api';
import { AuthContext } from '@/components/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';

export default function Index() {
  const [backendGreeting, setBackendGreeting] = useState<string>('');
  const { userId, token } = useContext(AuthContext);

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

      {userId ? (
        <>
          <Text>Welcome back, User {userId}!</Text>
          <Text>Your token is: {token}</Text>
        </>
      ) : (
        <LoginForm />
      )}
    </View>
  );
}
