import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Profile from '@/app/(app)/profile';
import { useSession } from '@/contexts/AuthContext';
import api from '@/api';
import { useFocusEffect } from 'expo-router';

jest.mock('@/contexts/AuthContext', () => ({ useSession: jest.fn() }));
jest.mock('@/api');
jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(),
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('Profile Component', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ userId: 'testuser' });
    (useFocusEffect as jest.Mock).mockImplementationOnce((callback) =>
      callback(),
    );
  });

  it('renders user information correctly', async () => {
    const user = { username: 'testuser', email: 'testuser@example.com' };
    mockApi.getUser.mockResolvedValueOnce(user);
    const { getByText } = render(<Profile />);

    await waitFor(() => {
      expect(getByText('Nombre de usuario: ')).toBeTruthy();
      expect(getByText('testuser')).toBeTruthy();
      expect(getByText('Correo electrónico: ')).toBeTruthy();
      expect(getByText('testuser@example.com')).toBeTruthy();
    });
  });

  it('shows an alert on fetch error', async () => {
    mockApi.getUser.mockRejectedValueOnce(new Error('Fetch error'));
    window.alert = jest.fn();
    render(<Profile />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        '¡Oops! Ha ocurrido un error al intentar cargar tu información.',
      );
    });
  });
});
