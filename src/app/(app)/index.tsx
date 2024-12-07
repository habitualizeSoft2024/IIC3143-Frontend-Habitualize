import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Screen from '@/components/Screen';
import api from '@/api';
import { router, useFocusEffect } from 'expo-router';

import {
  MockEmptyLineChart,
  MockEmptyPieChart,
  MockLineChart,
  MockPieChart,
  TotalCompletedHabitsPieChart,
} from '@/components/HabitChart';
import StatCarousel from '@/components/StatCarousel';

function transformHabitData(data: HabitRequestData[]): Habit[] {
  return data.map((item) => ({
    habit_id: `${item.id}`,
    user_id: `${item.user}`,
    name: item.name,
    description: item.description,
    counter: item.counter,
    current_streak: item.current_streak,
    highest_streak: item.highest_streak,
    expected_counter: item.expected_counter,
  }));
}

type Habit = {
  habit_id: string;
  user_id: string;
  name: string;
  description: string;
  counter: number;
  current_streak: number;
  highest_streak: number;
  expected_counter: number;
};

type HabitRequestData = {
  id: number;
  user: number;
  name: string;
  description: string;
  expected_counter: number;
  counter: number;
  current_streak: number;
  highest_streak: number;
};

interface WeeklyStat {
  startWeek: string;
  endWeek: string;
  totalCounter: number;
  meanStreak: number;
  expectedCounter: number;
  name: string;
}

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>([]);
  async function fetchHabits() {
    try {
      const response = await api.getHabits(); // Replace with your actual API call
      const sortedHabits = transformHabitData(response).sort(
        (a, b) => +a.habit_id - +b.habit_id,
      );
      setHabits(sortedHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  }

  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[][]>([]);
  async function fetchWeeklyStats() {
    try {
      const statsPromises = habits.map(async (habit) => {
        const response = await api.getHabitWeeklyStat({ id: +habit.habit_id });

        let habitWeeklyStat: WeeklyStat[] = response.map(
          (item: any): WeeklyStat => {
            return {
              startWeek: item.week_start,
              endWeek: item.week_end,
              totalCounter: item.total_counter,
              meanStreak: item.mean_streak,
              expectedCounter: item.expected_counter,
              name: habit.name,
            };
          },
        );
        return habitWeeklyStat;
      });
      const stats = await Promise.all(statsPromises);
      setWeeklyStats(stats);
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
    }
  }

  useEffect(() => {
    if (habits.length > 0) {
      fetchWeeklyStats();
    }
  }, [habits]);

  useEffect(() => {
    console.log('Weekly Stats:', weeklyStats);
  }, [weeklyStats]);

  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, []),
  );

  const [goals, setGoals] = useState([
    { id: 1, text: 'No fumar', checked: false },
    { id: 2, text: 'Ir al gimnasio', checked: false },
    { id: 3, text: 'No morder uñas', checked: false },
    { id: 4, text: 'Comer verduras', checked: false },
  ]);

  const [reminders, setReminders] = useState([
    { id: 1, text: 'Pagar suscripción de gym', checked: false },
    { id: 2, text: 'Comprar suplementos', checked: false },
  ]);

  const toggleGoal = (id: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id ? { ...goal, checked: !goal.checked } : goal,
      ),
    );
  };

  const toggleReminder = (id: number) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, checked: !reminder.checked }
          : reminder,
      ),
    );
  };

  const compresedWeeklyStats = weeklyStats.flat();

  return (
    <Screen>
      <Text style={styles.greetingText}>{'Bienvenid@ de vuelta'}</Text>
      <View style={styles.grid}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recordatorios</Text>
          <View style={styles.card}>
            {reminders.map((reminder) => (
              <View
                key={reminder.id}
                style={[
                  styles.reminderItem,
                  reminder.checked && styles.reminderItemChecked,
                ]}
              >
                <Text
                  style={[
                    styles.reminderText,
                    reminder.checked && styles.reminderTextChecked,
                  ]}
                >
                  {reminder.text}
                </Text>
                <Switch
                  value={reminder.checked}
                  onValueChange={() => toggleReminder(reminder.id)}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Ha disminuido en un 30% la actividad "no fumar"
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metas</Text>
          <View style={styles.card}>
            {goals.map((goal) => (
              <View
                key={goal.id}
                style={[
                  styles.goalItem,
                  goal.checked && styles.goalItemChecked,
                ]}
              >
                <Text
                  style={[
                    styles.goalText,
                    goal.checked && styles.goalTextChecked,
                  ]}
                >
                  {goal.text}
                </Text>
                <Switch
                  value={goal.checked}
                  onValueChange={() => toggleGoal(goal.id)}
                />
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.newGoalButton}
            onPress={() => {
              router.navigate('/habits');
            }}
          >
            <Text style={styles.newGoalText}>Gestionar metas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.card}>
            <TotalCompletedHabitsPieChart data={compresedWeeklyStats} />
            <Text style={styles.cardText}>15 días sin fumar</Text>
            <Text style={styles.cardText}>30 horas de ejercicio</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F9FC',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 20,
  },
  userText: {
    fontSize: 16,
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 5,
  },
  tokenText: {
    fontSize: 14,
    color: '#6b6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  section: {
    width: '48%',
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#4ab7bd',
    borderWidth: 2,
    backgroundColor: '#E0F7FA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  reminderItemChecked: {
    backgroundColor: '#E0F7FA',
    opacity: 0.6,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  reminderText: {
    fontSize: 16,
    color: '#333',
  },
  reminderTextChecked: {
    color: '#888',
    textDecorationLine: 'line-through',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  goalItemChecked: {
    backgroundColor: '#E0F7FA',
    opacity: 0.6,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  goalText: {
    fontSize: 16,
    color: '#333',
  },
  goalTextChecked: {
    color: '#888',
    textDecorationLine: 'line-through',
  },
  newGoalButton: {
    marginTop: 10,
    backgroundColor: '#4ab7bd',
    padding: 10,
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  newGoalText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
