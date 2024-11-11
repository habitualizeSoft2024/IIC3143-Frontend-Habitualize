import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

type HabitBlockProps = {
  habit: Habit;
  onEdit: (habit_id: Habit) => void;
  onIncrease: (habit_id: Habit) => void;
  onDecrease: (habit_id: Habit) => void;
  onDelete: (habit_id: Habit) => void;
};

export default function HabitBlock({
  habit,
  onEdit,
  onIncrease,
  onDecrease,
  onDelete,
}: HabitBlockProps) {
  const {
    name,
    description,
    counter,
    current_streak,
    highest_streak,
    expected_counter,
  } = habit;

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.counter}>Contador: {counter}</Text>
        <Text style={styles.streak}>Racha actual: {current_streak}</Text>
        <Text style={styles.streak}>Mejor racha: {highest_streak}</Text>
        <Text style={styles.expected}>
          Contador esperado: {expected_counter}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => onEdit(habit)} style={styles.button}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onIncrease(habit)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDecrease(habit)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(habit)}
          style={styles.deleteButton}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
  },
  infoContainer: {
    flex: 4, // Takes 80% of the container width
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
  },
  streak: {
    fontSize: 14,
    color: '#333',
  },
  expected: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flex: 1, // Takes 20% of the container width
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#56A0E6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
