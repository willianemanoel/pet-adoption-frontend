import AsyncStorage from '@react-native-async-storage/async-storage';

// Use AsyncStorage como any para evitar erros de TypeScript
const storage = AsyncStorage as any;

export const Storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await storage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await storage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in storage:', error);
      throw error;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await storage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
      throw error;
    }
  },

  clear: async (): Promise<void> => {
    try {
      await storage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
};