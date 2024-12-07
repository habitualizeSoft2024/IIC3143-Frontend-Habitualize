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
  HabitCounterCompletion,
  HabitCounterLineChart,
  MockEmptyLineChart,
  MockEmptyPieChart,
  MockLineChart,
  MockPieChart,
  TotalCompletedHabitsPieChart,
} from '@/components/HabitChart';
import StatCarousel from '@/components/StatCarousel';
import { ScrollView } from 'react-native-gesture-handler';

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
  id: number;
  name: string;
  type: string;
  level: string | null;
  description: string;
  created_at: string;
  updated_at: string;
};

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

  /* const carouselData = [
    <MockLineChart />,
    <MockPieChart />,
    <MockEmptyLineChart />,
    <MockEmptyPieChart />
  ];
  const WeeklyStatsCarousel = <StatCarousel data={weeklyStats.map((stats, index) => (
    <View key={index} style={styles.card}>
      <HabitCounterLineChart data={stats} habitTitle={stats[0].name} />
      <HabitCounterCompletion data={stats} habitTitle={""} />
    </View>
  ))} />;

  const WeeklyStatsScrollView = weeklyStats.map((stats, index) => (
    <View key={index} style={styles.card}>
      <HabitCounterLineChart data={stats} habitTitle={stats[0].name} />
      <HabitCounterCompletion data={stats} habitTitle={""} />
    </View>
  )); */

  const WeeklyStatsScrollViewWithCarousel = weeklyStats.map((stats, index) => (
    <View key={index} style={styles.card}>
      <StatCarousel
        data={[
          <HabitCounterLineChart
            data={stats}
            habitTitle={'Hábito: ' + stats[0].name}
          />,
          <HabitCounterCompletion
            data={stats}
            habitTitle={'Hábito: ' + stats[0].name}
          />,
        ]}
      />
    </View>
  ));

  // Medals
  const [medals, setMedals] = useState<Medal[]>([]);
  async function fetchMedals() {
    try {
      const response = await api.getMedals();
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

  const MedalGridMap =
    medals.length > 0 ? (
      medals.map((medal, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{medal.name}</Text>
          <Text style={styles.cardText}>{medal.description}</Text>
        </View>
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
      <View style={{ padding: 10 }}>
        <Text style={styles.sectionTitle}>Medallas</Text>
        <View style={styles.grid}>{MedalGridMap}</View>
        <Text style={styles.sectionTitle}>Estadísticas Generales</Text>
        <ScrollView style={{ maxHeight: 400, padding: 10 }}>
          <View style={styles.card}>
            <TotalCompletedHabitsPieChart data={compresedWeeklyStats} />
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
                        stat.totalCounter > stat.expectedCounter &&
                        new Date(stat.startWeek) <= new Date() &&
                        new Date(stat.endWeek) >= new Date(),
                    ).length
                }
              </Text>
            </Text>
            <Text style={styles.cardText}>
              Hábitos bajo el contador esperado:
              <Text style={{ color: 'red' }}>
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
        <ScrollView style={{ maxHeight: 400, padding: 10 }}>
          {WeeklyStatsScrollViewWithCarousel}
        </ScrollView>
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
