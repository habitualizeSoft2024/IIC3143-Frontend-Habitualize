import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Formik } from 'formik';
import { useSession } from '@/contexts/AuthContext';

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useSession();

  const handleSignup = async (values: any) => {
    try {
      await signUp(values);
    } catch (error) {
      console.error(error);
      console.log('Signup failed.');
      setError(
        '¡Oops! Registro fallido. ¿Estás seguro que ingresaste un correo electrónico válido?',
      );
    }
  };

  return (
    <Formik
      initialValues={{ username: '', email: '', password: '' }}
      onSubmit={handleSignup}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View>
          <View style={styles.container}>
            <Text style={styles.title}>Registrarme</Text>
            <TextInput
              placeholder="Nombre de usuario"
              placeholderTextColor="#9e9e9e"
              value={values.username}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              style={styles.input}
            />
            <TextInput
              placeholder="Correo electrónico"
              placeholderTextColor="#9e9e9e"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              style={styles.input}
            />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#9e9e9e"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry={true}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit as any}
            >
              <Text style={styles.buttonText}>Registrarme</Text>
            </TouchableOpacity>

            {error && <Text>{error}</Text>}
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => router.navigate('/login')}>
                <Text style={styles.link}>¿Ya te encuentras registrado?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#22a098',
    backgroundColor: '#f0fcfc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    maxWidth: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#064d46',
    marginBottom: 20,
  },
  input: {
    width: 470,
    maxWidth: '100%',
    backgroundColor: '#e0faf5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#064d46',
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#22a098',
  },
  button: {
    width: 470,
    maxWidth: '100%',
    backgroundColor: '#22a098',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
    margin: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 50,
  },
  link: {
    flex: 1,
    color: '#22a098',
    fontSize: 14,
    textAlign: 'center',
  },
});
