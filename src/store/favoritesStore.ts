// src/store/favoritesStore.ts
import { create } from 'zustand';
import { Pet } from '../types/types';
// ✅ 1. Importar o AsyncStorage diretamente
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

// A interface para o estado e as ações permanece a mesma
interface FavoritesState {
  favoritePets: Pet[];
  actions: {
    toggleFavorite: (pet: Pet) => void;
    isFavorite: (petId: number) => boolean;
  };
}

// O store com a configuração de persistência corrigida
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoritePets: [],
      actions: {
        toggleFavorite: (pet) => {
          const currentFavorites = get().favoritePets;
          const isAlreadyFavorite = currentFavorites.some((fav) => fav.id === pet.id);

          let updatedFavorites: Pet[];
          if (isAlreadyFavorite) {
            updatedFavorites = currentFavorites.filter((fav) => fav.id !== pet.id);
          } else {
            updatedFavorites = [...currentFavorites, pet];
          }
          
          set({ favoritePets: updatedFavorites });
        },
        isFavorite: (petId) => {
          return get().favoritePets.some((fav) => fav.id === petId);
        },
      },
    }),
    {
      name: 'favorite-pets-storage', // Nome da chave no AsyncStorage
      // ✅ 2. CORREÇÃO: Usamos o AsyncStorage diretamente.
      // Esta é a forma padrão e mais confiável de fazer a integração.
      storage: createJSONStorage(() => AsyncStorage),
      
      // Apenas a parte 'favoritePets' do estado será persistida
      partialize: (state) => ({ favoritePets: state.favoritePets as Pet[] }),
    }
  )
);

// O hook de conveniência para acessar as ações permanece o mesmo
export const useFavoriteActions = () => useFavoritesStore((state) => state.actions);