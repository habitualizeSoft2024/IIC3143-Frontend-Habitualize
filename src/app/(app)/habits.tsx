import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '@/api';
import HabitBlock from '@/components/HabitBlock';
import Screen from '@/components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';
import HabitScreenModalForm from '@/components/HabitScreenModalForm';

// Datos Mock
const mockHabits = [
  {
    habit_id: '1',
    user_id: 'user123',
    name: 'Drink Water',
    description: 'Drink 8 cups of water daily',
    counter: 5,
    current_streak: 3,
    highest_streak: 10,
    expected_counter: 8,
  },
  {
    habit_id: '2',
    user_id: 'user123',
    name: 'Morning Run',
    description: 'Go for a 30-minute run every morning',
    counter: 2,
    current_streak: 7,
    highest_streak: 15,
    expected_counter: 1,
  },
  {
    habit_id: '3',
    user_id: 'user123',
    name: 'Read a Book',
    description: 'Read at least 10 pages of a book each day',
    counter: 10,
    current_streak: 4,
    highest_streak: 12,
    expected_counter: 10,
  },
  {
    habit_id: '4',
    user_id: 'user123',
    name: 'Meditation',
    description: 'Meditate for 15 minutes each evening',
    counter: 15,
    current_streak: 2,
    highest_streak: 8,
    expected_counter: 1,
  },
  {
    habit_id: '5',
    user_id: 'user123',
    name: 'Study Spanish',
    description: 'Practice Spanish for 30 minutes daily',
    counter: 3,
    current_streak: 5,
    highest_streak: 5,
    expected_counter: 1,
  },
];

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

function transformSingleHabitToRequestData(habit: Habit): HabitRequestData {
  return {
    id: +habit.habit_id,
    user: +habit.user_id,
    name: habit.name,
    description: habit.description,
    expected_counter: habit.expected_counter,
    counter: habit.counter,
    current_streak: habit.current_streak,
    highest_streak: habit.highest_streak,
  };
}

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

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  async function fetchHabits() {
    try {
      const response = await api.getHabits(); // Replace with your actual API call
      setHabits(transformHabitData(response));
    } catch (error) {
      console.error('Error fetching habits:', error);
      setHabits(mockHabits); // Use mock data on error for testing
    }
  }

  // Fetch habits data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, []),
  );

  function openCreateModal() {
    setIsEditing(false);
    setModalVisible(true);
  }

  function openEditModal(habit: Habit) {
    setIsEditing(true);
    setSelectedHabit(habit);
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
  };

  async function createHabit(values: any) {
    // Enviamos el habit a la API
    try {
      await api.createHabit({
        ...values,
        expected_counter: +values.expected_counter,
      });
      fetchHabits();
      closeModal();
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  }

  async function updateHabit(values: any) {
    try {
      await api.updateHabit({
        id: selectedHabit?.habit_id,
        ...values,
        expected_counter: +values.expected_counter,
      });
      fetchHabits();
      closeModal();
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  }

  async function onDelete(habit: Habit) {
    // Transformamos el habit a un objeto que pueda ser enviado a la API
    const habitData = transformSingleHabitToRequestData(habit);
    // Enviamos el habit a la API
    try {
      await api.deleteHabit(habitData);
      fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  }

  const onIncrease = (habit: Habit) => {
    try {
      api.updateHabit({
        id: +habit.habit_id,
        counter: habit.counter + 1,
      });
      fetchHabits();
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  async function onDecrease(habit: Habit) {
    try {
      await api.updateHabit({
        id: +habit.habit_id,
        counter: habit.counter - 1 < 0 ? 0 : habit.counter - 1,
      });
      fetchHabits();
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  }

  return (
    <Screen>
      <View style={{ flex: 1, padding: 20 }}>
        <LinearGradient
          colors={['#FFFFFF', '#4AB7BD']}
          style={{ padding: 10, borderRadius: 8 }}
        >
          <Text style={styles.headerText}>Hábitos</Text>

          <FlatList
            data={habits}
            renderItem={({ item }) => (
              <HabitBlock
                habit={item}
                onEdit={openEditModal}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onDelete={onDelete}
              />
            )}
            ListFooterComponent={
              <TouchableOpacity
                onPress={openCreateModal}
                style={styles.createButton}
              >
                <Text style={styles.createButtonText}>Crear nuevo hábito</Text>
              </TouchableOpacity>
            }
          />
        </LinearGradient>
        {/* Modal for Creating or Editing a Habit */}
        <HabitScreenModalForm
          isVisible={isModalVisible}
          isEditing={isEditing}
          selectedHabit={selectedHabit}
          closeModal={closeModal}
          createHabit={createHabit}
          updateHabit={updateHabit}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  createButton: {
    borderColor: '#0d0d0d',
    backgroundColor: '#4CAF50',
    borderWidth: 0.5,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  deletebutton: {
    flex: 1,
    backgroundColor: '#FF0000',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
