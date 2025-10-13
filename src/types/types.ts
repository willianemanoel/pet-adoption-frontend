// src/types/types.ts

// ➤ Tipo para um pet
export interface Pet {
  id: number;
  name: string;
  type?: 'Cachorro' | 'Gato' | 'Coelho' | 'Outro';
  age?: number;
  description?: string;
  photos?: string[];
  ageUnit?: string;
  image?: string;
  organization?: string;
  breed?: string;
  location?: string;
  vaccinated?: boolean;
  neutered?: boolean;
  size?: 'Pequeno' | 'Médio' | 'Grande';
  temperament?: string[];
  needs?: string[];

  
}

// ➤ Tipo para matches de adoção
export interface Match {
  id: number;
  petId: number;
  matchedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
}

// ➤ Tipo para favoritos
export interface Favorite {
  id: number;
  petId: number;
  addedAt: Date;
}

// ➤ Tipo para usuário
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  stats: {
    matches: number;
    petsViewed: number;
    favorites: number;
    adopted: number;
    organization?: string;
  };
}

// ➤ Tipos auxiliares
export type Screen = 'home' | 'matches' | 'favorites' | 'profile';
export type AnimalFilter = 'all' | 'Cachorro' | 'Gato' | 'Coelho';
export type ModalSize = 'small' | 'medium' | 'large';
