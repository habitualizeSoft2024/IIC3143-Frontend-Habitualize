import React, { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Screen from '@/components/Screen';
import { router, useFocusEffect } from 'expo-router';
import api from '@/api';
import Preloader from '@/components/Preloader';
import { PieChart } from 'react-native-gifted-charts';
import { useSession } from '@/contexts/AuthContext';

export default function Index() {
  const [habits, setHabits] = useState<any[] | null>(null);
  const { username } = useSession();

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
    }, []),
  );

  async function changeHabitCounter(habit: any, change: number) {
    if (habit.counter + change < 0) {
      return;
    }
    try {
      await api.updateHabit({ id: habit.id, counter: habit.counter + change });
      setHabits(
        (prevHabits) =>
          prevHabits &&
          prevHabits.map((prevHabit) =>
            prevHabit.id === habit.id
              ? { ...prevHabit, counter: prevHabit.counter + change }
              : prevHabit,
          ),
      );
    } catch {
      window.alert(
        '¡Oops! Ha ocurrido un error al intentar actualizar el contador.',
      );
    }
  }

  if (!habits) {
    return <Preloader />;
  }

  if (habits.length === 0) {
    return (
      <Screen>
        <Text style={styles.greetingText}>{`¡Hola, ${username}!`}</Text>
        <TouchableOpacity
          style={styles.manageHabits}
          onPress={() => {
            router.navigate('/habits');
          }}
        >
          <Text style={styles.manageHabitsText}>Gestionar hábitos</Text>
        </TouchableOpacity>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.greetingText}>{`¡Hola, ${username}!`}</Text>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hábitos</Text>
          <ScrollView style={styles.habits}>
            {habits.map((habit: any, index) => (
              <View key={index} style={styles.habitContainer}>
                <View style={styles.row}>
                  <View>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    <Text style={styles.habitInfo}>
                      Contador: {habit.counter}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.counterButton}
                      onPress={() => changeHabitCounter(habit, -1)}
                    >
                      <Text style={styles.counterButtonText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.counterButton}
                      onPress={() => changeHabitCounter(habit, 1)}
                    >
                      <Text style={styles.counterButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.manageHabits}
            onPress={() => {
              router.navigate('/habits');
            }}
          >
            <Text style={styles.manageHabitsText}>Gestionar hábitos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.chart}>
            <Text style={styles.charTitle}>Compromisos cumplidos</Text>
            <PieChart
              donut={true}
              innerRadius={80}
              data={[
                { value: 70, color: '#56A0E6' },
                { value: 30, color: 'black' },
              ]}
              centerLabelComponent={() => {
                return <Text style={styles.chartText}>70%</Text>;
              }}
            />
            <TouchableOpacity
              style={styles.manageHabits}
              onPress={() => {
                router.navigate('/stats');
              }}
            >
              <Text style={styles.manageHabitsText}>Ver más</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greetingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
    maxHeight: 700,
  },
  section: {
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
    marginBottom: 10,
  },
  habitInfo: {
    fontSize: 25,
    color: '#333',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chart: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
    width: '100%',
    gap: 20,
    padding: 20,
  },
  counterButton: {
    backgroundColor: 'black',
    width: 50,
    height: 50,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  counterButtonText: {
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
  manageHabits: {
    marginTop: 10,
    backgroundColor: '#4ab7bd',
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  manageHabitsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  charTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});
