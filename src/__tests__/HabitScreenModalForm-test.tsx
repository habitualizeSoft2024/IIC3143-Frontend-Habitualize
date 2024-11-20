import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import HabitScreenModalForm from '@/components/HabitScreenModalForm';

describe('HabitScreenModalForm', () => {
  const mockCloseModal = jest.fn();
  const mockCreateHabit = jest.fn();
  const mockUpdateHabit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for creating a habit', () => {
    const { getByPlaceholderText, getByText } = render(
      <HabitScreenModalForm
        isVisible={true}
        closeModal={mockCloseModal}
        isEditing={false}
        createHabit={mockCreateHabit}
        updateHabit={mockUpdateHabit}
      />,
    );

    expect(getByPlaceholderText('Nombre')).toBeTruthy();
    expect(getByPlaceholderText('Descripción')).toBeTruthy();
    expect(getByPlaceholderText('Contador esperado')).toBeTruthy();
    expect(getByText('Crear')).toBeTruthy();
  });

  it('renders correctly for editing a habit', () => {
    const selectedHabit = {
      habit_id: '1',
      user_id: '123',
      name: 'Leer',
      description: 'Leer un libro todos los días',
      counter: 5,
      current_streak: 3,
      highest_streak: 5,
      expected_counter: 10,
    };

    const { getByPlaceholderText, getByText } = render(
      <HabitScreenModalForm
        isVisible={true}
        closeModal={mockCloseModal}
        isEditing={true}
        selectedHabit={selectedHabit}
        createHabit={mockCreateHabit}
        updateHabit={mockUpdateHabit}
      />,
    );

    expect(getByPlaceholderText('Nombre').props.value).toBe('Leer');
    expect(getByPlaceholderText('Descripción').props.value).toBe(
      'Leer un libro todos los días',
    );
    expect(getByPlaceholderText('Contador esperado').props.value).toBe('10');
    expect(getByText('Guardar')).toBeTruthy();
  });

  it('sanitizes the expected_counter input to allow only numbers', () => {
    const { getByPlaceholderText } = render(
      <HabitScreenModalForm
        isVisible={true}
        closeModal={mockCloseModal}
        isEditing={false}
        createHabit={mockCreateHabit}
        updateHabit={mockUpdateHabit}
      />,
    );

    const counterInput = getByPlaceholderText('Contador esperado');
    act(() => {
      fireEvent.changeText(counterInput, '123abc!@#');
    });
    expect(counterInput.props.value).toBe('123'); // Solo números son permitidos
  });
});
