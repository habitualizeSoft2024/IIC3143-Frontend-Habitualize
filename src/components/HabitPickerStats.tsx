import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { HabitCounterCompletion, HabitCounterLineChart } from './HabitChart';
import api from '@/api';

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

interface WeeklyStat {
  startWeek: string;
  endWeek: string;
  totalCounter: number;
  meanStreak: number;
  expectedCounter: number;
  name: string;
}

export default function HabitPickerStats({ habits }: { habits: Habit[] }) {
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [habitStats, setHabitStats] = useState<any>(null);

  // Manejar selección del hábito y obtener estadísticas
  const handleHabitSelect = async (habitId: string) => {
    setSelectedHabit(habitId);
    setLoading(true);
    if (habitId) {
      try {
        console.log('Estadísticas del hábito:', habitId);
        const response = await api.getHabitWeeklyStat({ id: +habitId });

        let habitWeeklyStat: WeeklyStat[] = response.map(
          (item: any): WeeklyStat => {
            return {
              startWeek: item.week_start,
              endWeek: item.week_end,
              totalCounter: item.total_counter,
              meanStreak: item.mean_streak,
              expectedCounter: item.expected_counter,
              name: item.name,
            };
          },
        );

        setHabitStats(habitWeeklyStat);
        console.log('Estadísticas del hábito:', response);
      } catch (error) {
        console.error('Error al obtener las estadísticas del hábito:', error);
      }
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greetingText}>
        Selecciona un hábito para ver estadísticas:
      </Text>
      <Picker
        selectedValue={selectedHabit as any}
        onValueChange={(value: string) => handleHabitSelect(value)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccionar..." value={''} />
        {habits.map((habit) => (
          <Picker.Item
            key={habit.habit_id}
            label={habit.name}
            value={habit.habit_id}
          />
        ))}
      </Picker>
      {loading ? (
        <ActivityIndicator size="large" color="#4ab7bd" />
      ) : habitStats ? (
        <View style={styles.card}>
          <HabitCounterCompletion
            data={habitStats}
            habitTitle={
              habits.find((habit) => habit.habit_id === selectedHabit)?.name ||
              ''
            }
          />
          <HabitCounterLineChart
            data={habitStats}
            habitTitle={
              habits.find((habit) => habit.habit_id === selectedHabit)?.name ||
              ''
            }
          />
        </View>
      ) : (
        selectedHabit && (
          <Text style={styles.cardText}>
            No hay estadísticas disponibles para este hábito.
          </Text>
        )
      )}
    </ScrollView>
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
  picker: {
    fontSize: 25,
    width: 250,
    alignSelf: 'center',
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
    borderColor: '#4ab7bd',
    borderWidth: 2,
    borderRadius: 8,
  },
});
