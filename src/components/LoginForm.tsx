import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthContext } from './contexts/AuthContext';
import api from '@/api';
import { useRouter } from 'expo-router';

export default function LoginForm() {
  const { login, createUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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

  const handleCreateAccount = async () => {
    try {
      // get response from create user
      await createUser(username, email, password);
    } catch (error) {
      setError('Account creation failed. Please try again.');
    }
  };
  return (
    <div style={styles.container}>
      <View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />

        <Button title="Login" onPress={handleLogin} />

        <Text>Don't have an account?</Text>

        <Button title="Create Account" onPress={handleCreateAccount} />

        {error && <Text>{error}</Text>}
      </View>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#f4fdfc',
    borderRadius: 6,
  },
  input: {
    height: 40,
    margin: 12,
    backgroundColor: '#dafef6',
    /* placeholderTextColor: 'grey', */
    borderRadius: 6,
    fontSize: 16,
  },
  button: {
    color: '#22a098',
  },
});
