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
import api from '@/api';
import { useSession } from '@/contexts/AuthContext';

export default function HabitScreenModalForm({
  isVisible,
  closeModal,
  selectedHabit,
  setRefreshHabits,
}: {
  isVisible: boolean;
  closeModal: () => void;
  selectedHabit?: any;
  setRefreshHabits: (value: boolean) => void;
}) {
  const { logOut } = useSession();

  async function createHabit(values: any) {
    try {
      await api.createHabit(values);
      setRefreshHabits(true);
      closeModal();
    } catch {}
  }

  async function editHabit(values: any) {
    try {
      await api.updateHabit({ id: selectedHabit.id, ...values });
      setRefreshHabits(true);
      closeModal();
    } catch {}
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalBackground}>
        <Formik
          initialValues={{
            name: selectedHabit?.name || '',
            description: selectedHabit?.description || '',
            expected_counter: selectedHabit?.expected_counter.toString() || '',
          }}
          onSubmit={selectedHabit ? editHabit : createHabit}
        >
          {({
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            values,
          }) => (
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {selectedHabit ? 'Editar hábito' : 'Nuevo hábito'}
              </Text>
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
                  const sanitizedValue = text.replace(/[^0-9]/g, '');
                  handleChange('expected_counter')(sanitizedValue);
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
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>
                    {selectedHabit ? 'Guardar' : 'Crear'}
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
