import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Formik } from 'formik';

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

interface HabitScreenModalFormProps {
  isVisible: boolean;
  closeModal: () => void;
  isEditing: boolean;
  selectedHabit?: Habit | null;
  createHabit: (values: any) => void;
  updateHabit: (values: any) => void;
}

export default function HabitScreenModalForm({
  isVisible,
  closeModal,
  isEditing,
  selectedHabit,
  createHabit,
  updateHabit,
}: HabitScreenModalFormProps) {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalBackground}>
        <Formik
          initialValues={
            isEditing
              ? {
                  name: selectedHabit?.name || '',
                  description: selectedHabit?.description || '',
                  expected_counter:
                    selectedHabit?.expected_counter.toString() || '',
                }
              : {
                  name: '',
                  description: '',
                  expected_counter: '',
                }
          }
          onSubmit={isEditing ? updateHabit : createHabit}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Nuevo Hábito</Text>
              <TextInput
                placeholder="Nombre"
                style={styles.input}
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              <TextInput
                placeholder="Descripción"
                style={styles.input}
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
              />
              <TextInput
                placeholder="Contador esperado"
                keyboardType="numeric"
                style={styles.input}
                value={values.expected_counter}
                onChangeText={(text) => {
                  // Sanitización: Solo permitir números positivos
                  const sanitizedValue = text.replace(/[^0-9]/g, ''); // Elimina todo lo que no sea un dígito
                  handleChange('expected_counter')(sanitizedValue); // Actualiza el estado con el valor limpio
                }}
                onBlur={handleBlur('expected_counter')}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.deletebutton}
                  onPress={closeModal}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit as any}
                >
                  <Text style={styles.buttonText}>
                    {isEditing ? 'Guardar' : 'Crear'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  deletebutton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
