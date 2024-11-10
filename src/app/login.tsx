// src/app/login.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginForm from '../components/LoginForm';
import { useRouter } from 'expo-router';
import api from '@/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const status = '';
  const router = useRouter();

  // falta arreglar handleLogin: corregir el status, evaluar cambiar todo eso a register y probar la API
  // OJO este codigo esta duplicado con LoginForm
  const handleLogin = async () => {
    try {
      const response = await api.login(email, password, username, status); // VERIFICAR BEN ESTO
      if (response.token) {
        // esto es solo una idea, buscar una forma de guardar el token en el contexto
        // await AsyncStorage.setItem('token', response.token);

        router.push('/landingpage');
      } else {
        console.log('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error(error);
      console.log('Login failed. Please check your credentials.');
    }
  };

  return (
    <View style={styles.container}>
      {/* aquí poner un logo para habitualize */}
      <Text style={styles.title}>Login</Text>
      <LoginForm />
    </View>
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
