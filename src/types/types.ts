// src/types/types.ts

// ➤ Tipo para um pet
export interface Pet {
  // 🔹 Campos de imagem (para compatibilidade entre diferentes telas)
  img_url?: string | string[]; // Pode ser uma URL única ou várias
  photos_url?: string[];       // URLs vindas da API
  photos?: string[];           // URLs locais ou múltiplas imagens
  image?: string;              // Imagem única (ex: upload local)

  // 🔹 Identificação
  id: number;
  name: string;

  // 🔹 Classificação
  type?: 'Cachorro' | 'Gato' | 'Coelho' | 'Outro';
  breed?: string;
  age?: number;
  ageUnit?: string; // ex: "anos", "meses"

  // 🔹 Descrição e informações adicionais
  description?: string;
  organization?: string;
  location?: string;

  // 🔹 Atributos físicos e de saúde
  size?: 'Pequeno' | 'Médio' | 'Grande';
  sex?: string; // "Macho" ou "Fêmea"
  vaccinated?: boolean;
  neutered?: boolean;

  // 🔹 Personalidade e necessidades
  temperament?: string[];
  needs?: string[];

  // 🔹 Dados adicionais (para dashboard, analytics, etc.)
  status?: 'Disponível' | 'Em processo' | 'Adotado';
  matches?: number;
  views?: number;
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

// ➤ Tipos auxiliares para navegação e interface
export type Screen = 'home' | 'matches' | 'favorites' | 'profile';
export type AnimalFilter = 'all' | 'Cachorro' | 'Gato' | 'Coelho';
export type ModalSize = 'small' | 'medium' | 'large';
