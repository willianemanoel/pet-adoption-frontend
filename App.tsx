// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';

import { RootStackParamList } from './src/types/navigation';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ProfileScreen from './src/screens/UserProfileScreen';
import PetDetailScreen from './src/screens/PetDetailScreen';
import ChatScreen from './src/screens/ChatScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';

// Admin Stack
import AdminStack from './src/navigation/AdminStack';

LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'props.pointerEvents',
]);

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={HomeScreen} />
        <Stack.Screen name="PetDetail" component={PetDetailScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />

        {/* Admin */}
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
