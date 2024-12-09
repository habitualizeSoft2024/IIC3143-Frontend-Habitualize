import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Login from '@/app/(auth)/login';
import api from '@/api';
import { useSession } from '@/contexts/AuthContext';

jest.mock('@/api', () => ({ logIn: jest.fn() }));
jest.mock('@/contexts/AuthContext', () => ({
  useSession: jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      logIn: async (values: any) => {
        await api.logIn(values);
      },
    });
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<Login />);
    expect(getByPlaceholderText('Nombre de usuario')).toBeTruthy();
    expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
  });

  it('handles form submission successfully', async () => {
    (api.logIn as jest.Mock).mockResolvedValueOnce({ token: 'testtoken' });
    const { getByPlaceholderText, getByText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Nombre de usuario'), 'testuser');
    fireEvent.changeText(
      getByPlaceholderText('Correo electrónico'),
      'testuser@example.com',
    );
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password');
    fireEvent.press(getByText('Ingresar'));

    await waitFor(() => {
      expect(api.logIn).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password',
      });
    });
  });

  it('shows login error message', async () => {
    (api.logIn as jest.Mock).mockRejectedValueOnce(new Error('Login error'));
    const { getByPlaceholderText, getByText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Nombre de usuario'), 'testuser');
    fireEvent.changeText(
      getByPlaceholderText('Correo electrónico'),
      'testuser@example.com',
    );
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password');
    fireEvent.press(getByText('Ingresar'));

    await waitFor(() => {
      expect(
        getByText(
          '¡Oops! Inicio de sesión fallido. ¿Estás seguro de que los datos ingresados son correctos?',
        ),
      ).toBeTruthy();
    });
  });
});
