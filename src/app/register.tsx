import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginForm from '../components/LoginForm';
import { useRouter } from 'expo-router';

export default function Register() {
  const navigation = useNavigation();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <LoginForm />
      <Text onPress={() => router.push('/login')}>
        Already have an account? Login here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
});
