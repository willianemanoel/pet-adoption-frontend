// src/navigation/PetsStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardPetsScreen from '../screens/DashboardPetsScreen';
import AddEditPetScreen from '../screens/AddEditPetScreen';
import { PetsStackParamList } from '../types/navigation'; // Alterado para PetsStackParamList

const Stack = createNativeStackNavigator<PetsStackParamList>(); // Usar PetsStackParamList

const PetsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DashboardPets" 
        component={DashboardPetsScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="AddEditPet" 
        component={AddEditPetScreen} 
        options={{ headerShown: true, title: 'Adicionar / Editar Pet' }} 
      />
    </Stack.Navigator>
  );
};

export default PetsStackNavigator;