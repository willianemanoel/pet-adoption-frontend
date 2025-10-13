// src/navigation/ProfileStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserProfileScreen from '../screens/UserProfileScreen';

export type ProfileStackParamList = {
  UserProfile: undefined;
  // adicione outras telas do perfil aqui
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      {/* outras telas do perfil podem ser adicionadas aqui */}
    </Stack.Navigator>
  );
};
