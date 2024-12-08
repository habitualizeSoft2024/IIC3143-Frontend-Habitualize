import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Screen from '@/components/Screen';
import { useFocusEffect } from 'expo-router';
import api from '@/api';
import Preloader from '@/components/Preloader';
import HabitScreenModalForm from '@/components/HabitScreenModalForm';

export default function Habits() {
  const [habits, setHabits] = useState<any[] | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshHabits, setRefreshHabits] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchHabits() {
        try {
          const habits = await api.getHabits();
          setHabits(habits);
        } catch {
          window.alert(
            '¡Oops! Ha ocurrido un error al intentar cargar tus hábitos.',
          );
        }
      }
      fetchHabits();
      refreshHabits && setRefreshHabits(false);
    }, [refreshHabits]),
  );

  async function deleteHabit(id: number) {
    try {
      await api.deleteHabit({ id });
      setHabits(
        (prevHabits) =>
          prevHabits && prevHabits?.filter((habit: any) => habit.id !== id),
      );
    } catch {
      window.alert(
        '¡Oops! Ha ocurrido un error al intentar eliminar el hábito.',
      );
    }
  }

  if (!habits) {
    return <Preloader />;
  }

  return (
    <Screen>
      <Text style={styles.title}>{`Hábitos`}</Text>
      <View style={styles.container}>
        <ScrollView style={styles.habits}>
          {habits.map((habit: any, index) => (
            <View key={index} style={styles.habitContainer}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.habitDescription}>
                    {habit.description}
                  </Text>
                  <Text style={styles.habitInfo}>
                    Contador actual: {habit.counter}
                    {'\n'}
                    Contador objetivo: {habit.expected_counter}
                    {'\n'}
                    Racha actual: {habit.current_streak}
                    {'\n'}
                    Mejor racha: {habit.highest_streak}
                  </Text>
                </View>

                <View>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setSelectedHabit(habit);
                      setShowModal(true);
                    }}
                  >
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteHabit(habit.id)}
                  >
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.createHabit}
          onPress={() => {
            setSelectedHabit(null);
            setShowModal(true);
          }}
        >
          <Text style={styles.createHabitText}>Crear nuevo hábito</Text>
        </TouchableOpacity>
      </View>
      <HabitScreenModalForm
        closeModal={() => setShowModal((value) => !value)}
        isVisible={showModal}
        selectedHabit={selectedHabit}
        setRefreshHabits={setRefreshHabits}
      />
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
    padding: 20,
  },
  habits: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    maxHeight: 650,
  },
  habitContainer: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#BBE8FE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    marginBottom: 10,
  },
  habitName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  habitDescription: {
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
  },
  habitInfo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  editButton: {
    backgroundColor: 'black',
    height: 50,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    height: 50,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: -5,
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: '600',
    color: '#333',
    padding: 20,
  },
  createHabit: {
    marginTop: 10,
    backgroundColor: '#4ab7bd',
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  createHabitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
