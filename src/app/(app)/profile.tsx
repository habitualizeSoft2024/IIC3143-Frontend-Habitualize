import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '@/components/Screen';
import { useFocusEffect } from 'expo-router';
import api from '@/api';
import Preloader from '@/components/Preloader';
import { useSession } from '@/contexts/AuthContext';

export default function Profile() {
  const [user, setUser] = useState<any | null>(null);
  const { userId } = useSession();

  useFocusEffect(
    useCallback(() => {
      async function fetchUser() {
        try {
          const user = await api.getUser({ id: userId || '' });
          setUser(user);
        } catch {
          window.alert(
            '¡Oops! Ha ocurrido un error al intentar cargar tu información.',
          );
        }
      }
      fetchUser();
    }, [userId]),
  );

  if (!user) {
    return <Preloader />;
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{`Información personal`}</Text>
        <View style={styles.textRow}>
          <Text style={styles.infoField}>Nombre de usuario: </Text>
          <Text style={styles.info}>{user.username}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.infoField}>Correo electrónico: </Text>
          <Text style={styles.info}>{user.email}</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    borderRadius: 10,
    borderColor: '#4ab7bd',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    padding: 40,
    gap: 40,
  },
  infoField: {
    fontSize: 25,
    color: '#333',
    fontWeight: 'bold',
  },
  info: {
    fontSize: 25,
    color: '#333',
    fontWeight: 300,
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  textRow: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#4ab7bd',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
