// src/types/navigation.ts
import { NavigatorScreenParams } from '@react-navigation/native';

// Pets Stack (Dashboard/Admin)
export type PetsStackParamList = {
  DashboardPets: undefined;
  AddEditPet: { pet?: any };
};

// Chats Stack (Dashboard/Admin)
export type ChatStackParamList = {
  DashboardChats: undefined;
  Chat: { chatId: string };
};

// Tabs do App (ATUALIZADO - adicione todas as abas que você tem)
export type AppTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Matches: undefined;
  Chats: undefined;
  Profile: undefined;
  Pets: undefined;
};

// Root Stack (geral)
export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  PetDetail: { pet: any };
  Chat: { chatId: string };
  AdminLogin: undefined;
  DashboardPets: undefined;
  AddEditPet: { pet?: any };
  DashboardChats: undefined;
};