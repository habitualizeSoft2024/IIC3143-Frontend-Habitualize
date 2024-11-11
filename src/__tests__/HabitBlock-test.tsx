import { render } from '@testing-library/react-native';
import HabitBlock from '@/components/HabitBlock';

describe('<HabitBlock />', () => {
  test('Habit renders correctly on HabitBlock', () => {
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

    const { getByText } = render(
      <HabitBlock
        habit={item}
        onEdit={() => {}}
        onIncrease={() => {}}
        onDecrease={() => {}}
        onDelete={() => {}}
      />,
    );

    getByText('Drink Water');
  });
});
