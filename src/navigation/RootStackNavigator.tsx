// src/navigation/RootStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import WelcomeScreen from '../screens/WelcomeScreen';
import AppNavigator from './AppNavigator';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminStack from './AdminStack';
import PetDetailScreen from '../screens/PetDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import { ProfileStackNavigator } from './ProfileStackNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Main" component={AppNavigator} />
      <Stack.Screen name="PetDetail" component={PetDetailScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminStack} />
      <Stack.Screen name="UserProfileRoot" component={ProfileStackNavigator} />
    </Stack.Navigator>
  );
}