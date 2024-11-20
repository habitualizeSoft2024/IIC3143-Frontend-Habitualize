import { fireEvent, render } from '@testing-library/react-native';
import HabitBlock from '@/components/HabitBlock';

describe('<HabitBlock />', () => {
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

  const item: Habit = {
    habit_id: '1',
    user_id: '123',
    name: 'Drink Water',
    description: 'Drink 8 cups of water daily',
    counter: 5,
    current_streak: 3,
    highest_streak: 10,
    expected_counter: 8,
  };

  const mockOnEdit = jest.fn();
  const mockOnIncrease = jest.fn();
  const mockOnDecrease = jest.fn();
  const mockOnDelete = jest.fn();

  test('Habit renders correctly on HabitBlock', () => {
    const { getByText } = render(
      <HabitBlock
        habit={item}
        onEdit={mockOnEdit}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onDelete={mockOnDelete}
      />,
    );

    expect(getByText('Drink Water')).toBeTruthy();
    expect(getByText('Drink 8 cups of water daily')).toBeTruthy();
    expect(getByText('Contador: 5')).toBeTruthy();
    expect(getByText('Racha actual: 3')).toBeTruthy();
    expect(getByText('Mejor racha: 10')).toBeTruthy();
    expect(getByText('Contador esperado: 8')).toBeTruthy();
  });

  test('Clicking Edit button calls onEdit', () => {
    const { getByText } = render(
      <HabitBlock
        habit={item}
        onEdit={mockOnEdit}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.press(getByText('Editar'));
    expect(mockOnEdit).toHaveBeenCalledWith(item);
  });

  test('Clicking + button calls onIncrease', () => {
    const { getByText } = render(
      <HabitBlock
        habit={item}
        onEdit={mockOnEdit}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.press(getByText('+'));
    expect(mockOnIncrease).toHaveBeenCalledWith(item);
  });

  test('Clicking - button calls onDecrease', () => {
    const { getByText } = render(
      <HabitBlock
        habit={item}
        onEdit={mockOnEdit}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.press(getByText('-'));
    expect(mockOnDecrease).toHaveBeenCalledWith(item);
  });

  test('Clicking Delete button calls onDelete', () => {
    const { getByText } = render(
      <HabitBlock
        habit={item}
        onEdit={mockOnEdit}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.press(getByText('Eliminar'));
    expect(mockOnDelete).toHaveBeenCalledWith(item);
  });
});
