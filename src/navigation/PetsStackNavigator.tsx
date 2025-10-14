// src/navigation/PetsStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardPetsScreen from '../screens/DashboardPetsScreen';
import AddEditPetScreen from '../screens/AddEditPetScreen';
import { PetsStackParamList } from '../types/navigation'; 

const Stack = createNativeStackNavigator<PetsStackParamList>();

const PetsStackNavigator: React.FC = () => {
  return (
    // ✅ CORREÇÃO: Removido o headerShown para evitar cabeçalhos duplicados
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* A tela 'DashboardPets' aqui é a tela real da lista.
        A aba no AdminTabNavigator também se chama 'DashboardPets', mas ela aponta
        para este navegador de pilha inteiro, resolvendo a ambiguidade.
      */}
      <Stack.Screen 
        name="DashboardPets" 
        component={DashboardPetsScreen} 
      />
      <Stack.Screen 
        name="AddEditPet" 
        component={AddEditPetScreen}
        // A tela de Adicionar/Editar pode ter seu próprio cabeçalho
        options={{ headerShown: true, title: 'Adicionar / Editar Pet' }} 
      />
    </Stack.Navigator>
  );
};

export default PetsStackNavigator;