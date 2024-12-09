import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Index from '@/app/(app)/index';
import { useSession } from '@/contexts/AuthContext';
import api from '@/api';
import { useFocusEffect } from 'expo-router';

jest.mock('@/contexts/AuthContext', () => ({ useSession: jest.fn() }));
jest.mock('react-native-gifted-charts', () => ({
  PieChart: () => null,
}));
jest.mock('@/api');
jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(),
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('Index Component', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ username: 'testuser' });
    (useFocusEffect as jest.Mock).mockImplementationOnce((callback) =>
      callback(),
    );
  });

  it('renders greeting and manage habits button when no habits', async () => {
    mockApi.getHabits.mockResolvedValueOnce([]);
    const { getByText, queryByText } = render(<Index />);

    await waitFor(() => {
      expect(getByText('¡Hola, testuser!')).toBeTruthy();
      expect(getByText('Gestionar hábitos')).toBeTruthy();
      expect(queryByText('Hábitos')).toBeNull();
    });
  });

  it('renders habits and allows counter updates', async () => {
    const habits = [{ id: 1, name: 'Habit 1', counter: 0 }];
    mockApi.getHabits.mockResolvedValueOnce(habits);
    const { getByText } = render(<Index />);

    await waitFor(() => {
      expect(getByText('Habit 1')).toBeTruthy();
      expect(getByText('Contador: 0')).toBeTruthy();
    });

    fireEvent.press(getByText('+'));
    await waitFor(() => {
      expect(getByText('Contador: 1')).toBeTruthy();
    });

    fireEvent.press(getByText('-'));
    await waitFor(() => {
      expect(getByText('Contador: 0')).toBeTruthy();
    });
  });

  it('renders statistics section', async () => {
    const habits = [{ id: 1, name: 'Habit 1', counter: 0 }];
    mockApi.getHabits.mockResolvedValueOnce(habits);
    const { getByText } = render(<Index />);

    await waitFor(() => {
      expect(getByText('Estadísticas')).toBeTruthy();
      expect(getByText('Compromisos cumplidos')).toBeTruthy();
    });
  });
});
