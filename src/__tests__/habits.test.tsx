import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Habits from '@/app/(app)/habits';
import api from '@/api';
import { useFocusEffect } from 'expo-router';

jest.mock('@/api');
jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(),
}));

describe('Habits Component', () => {
  const mockHabits = [
    {
      id: 1,
      name: 'Habit 1',
      description: 'Description 1',
      counter: 5,
      expected_counter: 10,
      current_streak: 3,
      highest_streak: 5,
    },
    {
      id: 2,
      name: 'Habit 2',
      description: 'Description 2',
      counter: 2,
      expected_counter: 5,
      current_streak: 1,
      highest_streak: 2,
    },
  ];

  beforeEach(() => {
    (api.getHabits as jest.Mock).mockResolvedValue(mockHabits);
    (useFocusEffect as jest.Mock).mockImplementationOnce((callback) =>
      callback(),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and displays habits', async () => {
    const { getByText } = render(<Habits />);

    await waitFor(() => {
      expect(getByText('Habit 1')).toBeTruthy();
      expect(getByText('Habit 2')).toBeTruthy();
    });
  });

  it('handles habit deletion', async () => {
    (api.deleteHabit as jest.Mock).mockResolvedValue({});
    const { getByText, getAllByText, queryByText } = render(<Habits />);

    await waitFor(() => {
      expect(getByText('Habit 1')).toBeTruthy();
    });

    fireEvent.press(getAllByText('Eliminar')[0]);

    await waitFor(() => {
      expect(queryByText('Habit 1')).toBeNull();
    });
  });

  it('opens and closes the modal form', async () => {
    const { getByText, queryByText, getAllByText } = render(<Habits />);

    await waitFor(() => {
      expect(getByText('Crear nuevo hábito')).toBeTruthy();
    });

    fireEvent.press(getByText('Crear nuevo hábito'));

    await waitFor(() => {
      expect(getByText('Nuevo hábito')).toBeTruthy();
    });

    fireEvent.press(getByText('Cancelar'));

    await waitFor(() => {
      expect(queryByText('Nuevo hábito')).toBeNull();
    });

    await waitFor(() => {
      expect(getAllByText('Editar')[0]).toBeTruthy();
    });

    fireEvent.press(getAllByText('Editar')[0]);

    await waitFor(() => {
      expect(getByText('Editar hábito')).toBeTruthy();
    });

    fireEvent.press(getByText('Cancelar'));

    await waitFor(() => {
      expect(queryByText('Editar hábito')).toBeNull();
    });
  });
});
