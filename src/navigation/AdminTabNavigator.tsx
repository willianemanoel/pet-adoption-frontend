// src/navigation/AdminTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import DashboardChatsScreen from '../screens/DashboardChatsScreen';
import DashboardMatchRequestsScreen from '../screens/DashboardMatchRequestsScreen';
// Importamos o StackNavigator em vez da tela individual
import PetsStackNavigator from './PetsStackNavigator';

import { AdminTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<AdminTabParamList>();

const AdminTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          height: 70, 
          paddingBottom: 10, 
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="DashboardPets"
        // O componente agora é o StackNavigator
        component={PetsStackNavigator}
        options={{
          tabBarLabel: 'Pets',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DashboardMatchRequests"
        component={DashboardMatchRequestsScreen}
        options={{
          tabBarLabel: 'Solicitações',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="git-pull-request" size={size} color={color} />
          ),
          tabBarBadge: 3,
          tabBarBadgeStyle: { backgroundColor: '#EF4444' },
        }}
      />
      <Tab.Screen
        name="DashboardChats"
        component={DashboardChatsScreen}
        options={{
          tabBarLabel: 'Conversas',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;