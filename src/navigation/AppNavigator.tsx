// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import FavoritesScreen from '../screens/FavoritesScreen';
import MatchesScreen from '../screens/MatchesScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

import { HomeStackNavigator } from './HomeStackNavigator';
import { ChatsStackNavigator } from './ChatsStackNavigator';
import PetsStackNavigator from './PetsStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 70 },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Explorar',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="heart" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarLabel: 'Matches',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="users" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Chats"
        component={ChatsStackNavigator}
        options={{
          tabBarLabel: 'Conversas',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator} // Use um Stack Navigator aqui para navegação interna
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Pets"
        component={PetsStackNavigator}
        options={{
          tabBarLabel: 'Meus Pets',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="git-merge" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
