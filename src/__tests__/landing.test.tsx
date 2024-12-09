import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Landing from '@/app/(auth)/index';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    navigate: jest.fn(),
  },
}));

describe('Landing', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Landing />);
    expect(getByText('Metas')).toBeTruthy();
    expect(
      getByText(
        'Establece y sigue tus metas personales de forma simple y organizada.',
      ),
    ).toBeTruthy();
    expect(getByText('Estadísticas')).toBeTruthy();
    expect(
      getByText(
        'Observa tus logros y el progreso de tus metas en tiempo real.',
      ),
    ).toBeTruthy();
    expect(getByText('Bienvenido a Habitualize!')).toBeTruthy();
    expect(
      getByText('Gestiona tus metas, recordatorios y observa tu progreso.'),
    ).toBeTruthy();
    expect(getByText('Ingresar')).toBeTruthy();
  });

  it('navigates to login on button press', () => {
    const { getByText } = render(<Landing />);
    fireEvent.press(getByText('Ingresar'));
    expect(router.navigate).toHaveBeenCalledWith('/login');
  });
});
