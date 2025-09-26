// src/components/FilterBar.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { AnimalFilter } from '../types/types';

interface FilterBarProps {
  selectedFilter: AnimalFilter;
  onFilterChange: (filter: AnimalFilter) => void;
}

const filters: AnimalFilter[] = ['all', 'Cachorro', 'Gato', 'Coelho'];

export const FilterBar: React.FC<FilterBarProps> = ({ selectedFilter, onFilterChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Botão fixo no canto superior direito */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.filterButtonText}>
          Filtrar
        </Text>
      </TouchableOpacity>

      {/* Modal com opções de filtro */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um filtro</Text>

            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.optionButton,
                  selectedFilter === filter && styles.selectedOption
                ]}
                onPress={() => {
                  onFilterChange(filter);
                  setModalVisible(false); // fecha modal ao escolher
                }}
              >
                <Text style={styles.optionText}>
                  {filter === 'all' ? 'Todos' : filter}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40, // ajuste conforme o header da sua tela
    right: 20,
    zIndex: 1000,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: '#EF4444',
    borderRadius: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
