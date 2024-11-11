import { ScrollView, ScrollViewProps } from 'react-native';

export default function Screen({ ...props }: ScrollViewProps) {
  return (
    <ScrollView
      style={{ height: '100%' }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
      }}
      {...props}
    />
  );
}
