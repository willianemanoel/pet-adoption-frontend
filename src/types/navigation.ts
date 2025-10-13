// src/types/navigation.ts
import { Pet } from './types';

// Declaração manual de NavigatorScreenParams
export type NavigatorScreenParams<ParamList> = {
  screen?: keyof ParamList;
  params?: ParamList[keyof ParamList];
};

// Tabs do App
export type AppTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Matches: undefined;
  Profile: undefined;
};

// Tabs do Admin
export type AdminTabParamList = {
  DashboardPets: undefined;
  DashboardMatchRequests: undefined;
  DashboardChats: undefined;
};

// Root Stack
export type RootStackParamList = {
  Welcome: undefined;
  Main: NavigatorScreenParams<AppTabParamList>;
  PetDetail: { pet: Pet };
  Chat: { chatId: string };
  AdminLogin: undefined;
  AdminDashboard: NavigatorScreenParams<AdminTabParamList>;
   UserProfileRoot: undefined;
};
