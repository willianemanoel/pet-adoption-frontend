// App.tsx - VERSÃO CORRIGIDA
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { LogBox } from 'react-native';

// Ignorar warnings específicos
LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'props.pointerEvents',
]);

// Telas
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ProfileScreen from './src/screens/UserProfileScreen';
import PetDetailScreen from './src/screens/PetDetailScreen';
import ChatScreen from './src/screens/ChatScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import DashboardPetsScreen from './src/screens/DashboardPetsScreen';
import AddEditPetScreen from './src/screens/AddEditPetScreen';
import DashboardChatsScreen from './src/screens/DashboardChatsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator para as telas principais do usuário
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ 
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <Feather name="heart" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Matches" 
        component={MatchesScreen} 
        options={{ 
          tabBarLabel: 'Matches',
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tela inicial */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        
        {/* Tab Navigator como tela principal */}
        <Stack.Screen name="Main" component={TabNavigator} />
        
        {/* Telas de stack (acessíveis a partir das tabs) */}
        <Stack.Screen name="PetDetail" component={PetDetailScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        
        {/* Telas do administrador */}
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="DashboardPets" component={DashboardPetsScreen} />
        <Stack.Screen name="AddEditPet" component={AddEditPetScreen} />
        <Stack.Screen name="DashboardChats" component={DashboardChatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}