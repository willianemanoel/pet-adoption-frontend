// src/hooks/usePets.ts
import { useState, useEffect } from 'react';
import { Pet } from '../types/types';
import { API_BASE_URL } from '../config/api'; // ✅ Importar a URL correta

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        // ✅ Usar a URL correta
        const response = await fetch(`${API_BASE_URL}/animals`);
        const data = await response.json();
        setPets(data.animals);
      } catch (err) {
        setError('Erro ao buscar animais');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return { pets, loading, error };
};