// src/hooks/usePets.ts
import { useState, useEffect } from 'react';
import { Pet } from '../types/types';

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('http://192.168.0.107:3000/api/animals'); // IP do backend
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
