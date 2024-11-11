import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Screen from '@/components/Screen';
import { router } from 'expo-router';

export default function LandingPage() {
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Metas</Text>
            <Text style={styles.infoDescription}>
              Establece y sigue tus metas personales de forma simple y
              organizada.
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Recordatorios</Text>
            <Text style={styles.infoDescription}>
              Recibe recordatorios de tus actividades importantes para no
              olvidarlas.
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Estadísticas</Text>
            <Text style={styles.infoDescription}>
              Observa tus logros y el progreso de tus metas en tiempo real.
            </Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.sectionTitle}>Bienvenido a Habitualize!</Text>
          <Text style={styles.sectionSubtitle}>
            Gestiona tus metas, recordatorios y observa tu progreso.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => router.navigate('/login')}
          >
            <Text style={styles.buttonText}>Ingresar</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9FAF8',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#CFEDEE',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22a098',
    marginBottom: 5,
  },
  infoDescription: {
    fontSize: 14,
    color: '#3a6a6a',
    textAlign: 'center',
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22a098',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#3a6a6a',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#22a098',
    padding: 10,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
