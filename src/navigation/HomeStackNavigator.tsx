// src/navigation/HomeStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PetDetailScreen from '../screens/PetDetailScreen';
import { Pet } from '../types/types'; // se tiver tipo Pet

export type HomeStackParamList = {
  Home: undefined;
  PetDetail: { pet: Pet };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="PetDetail" component={PetDetailScreen} />
  </Stack.Navigator>
);
