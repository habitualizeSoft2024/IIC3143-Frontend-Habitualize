import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
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
  HabitCounterBarChart,
  HabitCounterCompletion,
  HabitCounterLineChart,
  InvisibleChart,
  MockEmptyLineChart,
  MockEmptyPieChart,
  MockLineChart,
  MockPieChart,
  TotalCompletedHabitsPieChart,
} from '@/components/HabitChart';
import StatCarousel from '@/components/StatCarousel';
import { ScrollView } from 'react-native-gesture-handler';
import HabitPickerStats from '@/components/HabitPickerStats';

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

type Medal = {
  name: string;
  description: string;
  level: string;
  archieved: boolean;
  earned_at: string | null;
};

const MedalMockData: Medal[] = [
  {
    name: 'Medalla 1',
    description: 'Descripción de la medalla 1',
    level: 'bronce',
    archieved: true,
    earned_at: '2021-10-01',
  },
  {
    name: 'Medalla 2',
    description: 'Descripción de la medalla 2',
    level: 'gold',
    archieved: false,
    earned_at: null,
  },
  {
    name: 'Medalla 3',
    description: 'Descripción de la medalla 3',
    level: 'silver',
    archieved: true,
    earned_at: '2021-10-02',
  },
  {
    name: 'Medalla 4',
    description: 'Descripción de la medalla 4',
    level: 'gold',
    archieved: false,
    earned_at: null,
  },
];

export default function Index() {
  // Habits
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

  // Weekly Stats
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

  const compresedWeeklyStats = weeklyStats.flat();

  const highestStreakHabit =
    habits.length > 0
      ? habits.reduce((acc, habit) => {
          if (habit.highest_streak > acc.highest_streak) {
            return habit;
          }
          return acc;
        }, habits[0])
      : null;

  // Medals
  const [medals, setMedals] = useState<Medal[]>([]);
  async function fetchMedals() {
    try {
      const response = await api.getMedals();
      //const response = MedalMockData;
      setMedals(response);
    } catch (error) {
      console.error('Error fetching medals:', error);
    }
  }
  useEffect(() => {
    fetchMedals();
  }, []);
  //print medals
  useEffect(() => {
    console.log('Medals:', medals);
  }, [medals]);

  const MedalGridMapArchieved =
    medals.length > 0 ? (
      medals.map((medal, index) => (
        <React.Fragment key={index}>
          {medal.archieved && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{medal.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Image
                    source={{ uri: `assets/images/${medal.level}_default.jpg` }}
                    style={{ width: 100, height: 100 }}
                    resizeMode="cover"
                  />
                </View>
                <View style={{ flex: 3 }}>
                  <Text style={styles.cardText}>{medal.description}</Text>
                  <Text style={styles.cardText}>Nivel: {medal.level}</Text>
                  <Text style={styles.cardText}>
                    Logrado el: {medal.earned_at}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </React.Fragment>
      ))
    ) : (
      <View
        style={{
          ...styles.section,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>No hay medallas</Text>
      </View>
    );

  const MedalGridMapUnarchieved =
    medals.length > 0 ? (
      medals.map((medal, index) => (
        <React.Fragment key={index}>
          {!medal.archieved && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{medal.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Image
                    source={{ uri: `assets/images/${medal.level}_default.jpg` }}
                    style={{ width: 100, height: 100 }}
                    resizeMode="cover"
                  />
                </View>
                <View style={{ flex: 3 }}>
                  <Text style={styles.cardText}>{medal.description}</Text>
                  <Text style={styles.cardText}>Nivel: {medal.level}</Text>
                </View>
              </View>
            </View>
          )}
        </React.Fragment>
      ))
    ) : (
      <View
        style={{
          ...styles.section,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>No hay medallas</Text>
      </View>
    );

  return (
    <Screen>
      {InvisibleChart() /* Sirve para que no se rompa los gráficos */}
      <View style={{ padding: 10 }}>
        <Text style={styles.sectionTitle}>Medallas Obtenidas</Text>
        <View style={styles.grid}>{MedalGridMapArchieved}</View>
        <Text style={styles.sectionTitle}>Medallas por Lograr</Text>
        <View style={styles.grid}>{MedalGridMapUnarchieved}</View>
        <Text style={styles.sectionTitle}>Estadísticas Generales</Text>
        <ScrollView style={{ maxHeight: 400, padding: 10 }}>
          <View style={styles.card}>
            <TotalCompletedHabitsPieChart data={compresedWeeklyStats} />
            <HabitCounterBarChart
              data={compresedWeeklyStats}
              habitTitle="Counter total semanal"
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Hábito con mejor highest streak:{' '}
              {highestStreakHabit ? highestStreakHabit.name : 'No disponible'}
            </Text>
            <Text style={styles.cardText}>
              Número de hábitos interactuados esta semana:{' '}
              {
                weeklyStats
                  .flat()
                  .filter(
                    (stat) =>
                      stat.totalCounter > 0 &&
                      new Date(stat.startWeek) <= new Date() &&
                      new Date(stat.endWeek) >= new Date(),
                  ).length
              }
            </Text>
            <Text style={styles.cardText}>
              Hábitos sobre el contador esperado:
              <Text style={{ color: 'blue' }}>
                {' '}
                {
                  weeklyStats
                    .flat()
                    .filter(
                      (stat) =>
                        stat.totalCounter >= stat.expectedCounter &&
                        new Date(stat.startWeek) <= new Date() &&
                        new Date(stat.endWeek) >= new Date(),
                    ).length
                }
              </Text>
            </Text>
            <Text style={styles.cardText}>
              Hábitos bajo el contador esperado:
              <Text style={{ color: 'red' }}>
                {' '}
                {
                  weeklyStats
                    .flat()
                    .filter(
                      (stat) =>
                        stat.totalCounter < stat.expectedCounter &&
                        new Date(stat.startWeek) <= new Date() &&
                        new Date(stat.endWeek) >= new Date(),
                    ).length
                }
              </Text>
            </Text>
          </View>
        </ScrollView>

        <Text style={styles.sectionTitle}>Estadísticas de Hábito</Text>
        <HabitPickerStats habits={habits} />
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
    backgroundColor: '#FFFFFF',
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
