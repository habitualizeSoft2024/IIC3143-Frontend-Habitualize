import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginForm from '@/components/LoginForm';
import Screen from '@/components/Screen';

export default function Login() {
  return (
    <Screen>
      {/* aquí poner un logo para habitualize */}
      <LoginForm />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#22a098',
  },
});
