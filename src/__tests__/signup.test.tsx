import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import api from '@/api';
import { useSession } from '@/contexts/AuthContext';
import Signup from '@/app/(auth)/signup';

jest.mock('@/api', () => ({ createUser: jest.fn() }));
jest.mock('@/contexts/AuthContext', () => ({
  useSession: jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      signUp: async (values: any) => {
        await api.createUser(values);
      },
    });
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<Signup />);
    expect(getByPlaceholderText('Nombre de usuario')).toBeTruthy();
    expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
  });

  it('handles form submission successfully', async () => {
    (api.createUser as jest.Mock).mockResolvedValueOnce({ token: 'testtoken' });
    const { getByPlaceholderText, getAllByText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText('Nombre de usuario'), 'testuser');
    fireEvent.changeText(
      getByPlaceholderText('Correo electrónico'),
      'testuser@example.com',
    );
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password');
    fireEvent.press(getAllByText('Registrarme')[1]);

    await waitFor(() => {
      expect(api.createUser).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password',
      });
    });
  });

  it('shows login error message', async () => {
    (api.createUser as jest.Mock).mockRejectedValueOnce(
      new Error('Login error'),
    );
    const { getByPlaceholderText, getAllByText, getByText } = render(
      <Signup />,
    );

    fireEvent.changeText(getByPlaceholderText('Nombre de usuario'), 'testuser');
    fireEvent.changeText(
      getByPlaceholderText('Correo electrónico'),
      'testuser@example.com',
    );
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password');
    fireEvent.press(getAllByText('Registrarme')[1]);

    await waitFor(() => {
      expect(
        getByText(
          '¡Oops! Registro fallido. ¿Estás seguro que los datos ingresados son válidos?',
        ),
      ).toBeTruthy();
    });
  });
});
