import { ActivityIndicator } from 'react-native';
import Screen from './Screen';

export default function Preloader() {
  return (
    <Screen>
      <ActivityIndicator size="large" />
    </Screen>
  );
}
