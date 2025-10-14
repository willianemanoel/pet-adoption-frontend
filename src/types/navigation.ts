// src/types/navigation.ts
import { Pet } from './types';

export type NavigatorScreenParams<ParamList> = {
  screen: keyof ParamList;
  params?: ParamList[keyof ParamList];
};

export type PetsStackParamList = {
  DashboardPets: undefined;
  AddEditPet: { pet?: Pet };
};

export type ChatStackParamList = {
  DashboardChats: undefined;
  Chat: { chatId: string; petName?: string };
};

// ✅ CORREÇÃO: Removidas as abas 'Chats' e 'Pets'
export type AppTabParamList = {
  HomeStack: undefined;
  Favorites: undefined;
  Matches: undefined;
  Profile: undefined;
};

export type AdminTabParamList = {
  DashboardPets: NavigatorScreenParams<PetsStackParamList>;
  DashboardMatchRequests: undefined;
  DashboardChats: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Main: NavigatorScreenParams<AppTabParamList>;
  PetDetail: { pet: Pet };
  Chat: { chatId: string; petId?: number; petName?: string; petImage?: string };
  AdminLogin: undefined;
  AdminDashboard: NavigatorScreenParams<AdminTabParamList>;
  UserProfileRoot: undefined;
  AddEditPet: { pet?: Pet };
};