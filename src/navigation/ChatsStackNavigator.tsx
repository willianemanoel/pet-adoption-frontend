import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardChatsScreen from '../screens/DashboardChatsScreen';
import ChatScreen from '../screens/ChatScreen';
import { ChatStackParamList } from '../types/navigation'; // Agora a importação funcionará

const Stack = createNativeStackNavigator<ChatStackParamList>();

export const ChatsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DashboardChats"
        component={DashboardChatsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: true, title: 'Conversa' }}
      />
    </Stack.Navigator>
  );
};