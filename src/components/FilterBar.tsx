import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AnimalFilter } from '../types/types';

interface FilterBarProps {
  selectedFilter: AnimalFilter;
  onFilterChange: (filter: AnimalFilter) => void;
}

// Array de filtros com emojis para um toque visual
const filters: { label: string; value: AnimalFilter; emoji: string }[] = [
  { label: 'Todos', value: 'all', emoji: '🐾' },
  { label: 'Cachorros', value: 'Cachorro', emoji: '🐕' },
  { label: 'Gatos', value: 'Gato', emoji: '🐈' },
  { label: 'Coelhos', value: 'Coelho', emoji: '🐇' },
];

export const FilterBar: React.FC<FilterBarProps> = ({ selectedFilter, onFilterChange }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {filters.map(({ label, value, emoji }) => {
          const isSelected = selectedFilter === value;
          return (
            <TouchableOpacity
              key={value}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onFilterChange(value)}
            >
              <Text style={styles.emoji}>{emoji}</Text>
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // A barra de filtros agora flui com o conteúdo, em vez de ser posicionada de forma absoluta.
    // O espaçamento é controlado pela tela que a utiliza (HomeScreen).
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 12, // Espaçamento moderno entre os itens
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  emoji: {
    fontSize: 16,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});