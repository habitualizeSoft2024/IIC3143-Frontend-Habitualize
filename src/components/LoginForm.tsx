import React, { useContext, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { AuthContext } from './contexts/AuthContext';

export default function LoginForm() {
  const { login, createUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      // get response from login
      await login(email, password, username);
    } catch (error) {
      setError('Login failed. Please check your credentials.');
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
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Button title="Login" onPress={handleLogin} />

      <Text>Don't have an account?</Text>
      <Button title="Create Account" onPress={handleCreateAccount} />

      {error && <Text>{error}</Text>}
    </View>
  );
}
