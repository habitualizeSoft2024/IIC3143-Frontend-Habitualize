import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { useSession } from '@/contexts/AuthContext';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const { logIn } = useSession();

  const router = useRouter();

  const handleLogin = async (values: any) => {
    try {
      await logIn(values); // VERIFICAR BEN ESTO
    } catch (error) {
      console.error(error);
      console.log('Login failed. Please check your credentials.');
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Formik initialValues={{ email: '', password: '' }} onSubmit={handleLogin}>
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.container}>
          <View>
            <TextInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <TextInput
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry={true}
              style={styles.input}
            />

            <Button title="Login" onPress={handleSubmit as any} />

            <Text>Don't have an account?</Text>

            <Button
              title="Create Account"
              onPress={() => router.navigate('/signup')}
            />

            {error && <Text>{error}</Text>}
          </View>
        </View>
      )}
    </Formik>
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
