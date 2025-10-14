// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import RootStackNavigator from './src/navigation/RootStackNavigator';

LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'props.pointerEvents',
]);

export default function App() {
  return (
    <NavigationContainer>
      <RootStackNavigator />
    </NavigationContainer>
  );
}